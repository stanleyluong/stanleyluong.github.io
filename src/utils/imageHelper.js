import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Default collection names
const DEFAULT_COLLECTIONS = {
  main: 'main',
  education: 'education',
  work: 'work',
  skills: 'skills',
  certificates: 'certificates',
  projects: 'projects',
  testimonials: 'testimonials',
  imageMappings: 'imageMappings'
};

/**
 * Fetch an image as a blob
 * @param {string} imagePath - Path to the image
 * @returns {Promise<Blob>} Promise resolving to a blob
 */
export const fetchImageAsBlob = async (imagePath) => {
  try {
    // Normalize URL
    const url = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Try fetch first
    try {
      const response = await fetch(url, { mode: 'no-cors' });
      if (!response.ok && response.status !== 0) { // status 0 is expected with no-cors
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const blob = await response.blob();
      return blob;
    } catch (fetchError) {
      console.warn('Fetch failed, trying XMLHttpRequest:', fetchError);
      
      // Fallback to XMLHttpRequest
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300 || this.status === 0) {
            resolve(this.response);
          } else {
            reject(new Error(`Failed to load image: ${this.status} ${this.statusText}`));
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error occurred'));
        };
        
        xhr.send();
      });
    }
  } catch (error) {
    console.error(`Error fetching image ${imagePath}:`, error);
    throw error;
  }
};

/**
 * Extract filename from a path
 * @param {string} path - File path
 * @returns {string} Filename
 */
export const getFilenameFromPath = (path) => {
  if (!path) return '';
  
  // Remove query parameters if present
  const pathWithoutQuery = path.split('?')[0];
  
  // Get the filename from the path
  const parts = pathWithoutQuery.split('/');
  return parts[parts.length - 1];
};

/**
 * Get content type from filename
 * @param {string} filename - Filename
 * @returns {string} Content type
 */
export const getContentTypeFromFilename = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Upload an image to Firebase Storage
 * @param {string} imagePath - Path to the image
 * @param {string} storagePath - Path in Firebase Storage
 * @param {Object} metadata - Optional metadata
 * @returns {Promise<Object>} Promise resolving to upload result
 */
export const uploadImage = async (imagePath, storagePath, metadata = {}) => {
  try {
    console.log(`Uploading image: ${imagePath} to ${storagePath}`);
    
    // Get the image as a Blob
    const blob = await fetchImageAsBlob(imagePath);
    console.log(`Got blob: ${blob ? 'Yes' : 'No'}, type: ${blob?.type}, size: ${blob?.size} bytes`);
    
    if (!blob || blob.size === 0) {
      throw new Error(`Could not load image from ${imagePath}`);
    }
    
    // Determine content type
    const contentType = blob.type || getContentTypeFromFilename(storagePath);
    
    // Create metadata
    const uploadMetadata = {
      contentType,
      ...metadata
    };
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    console.log(`Uploading blob of size ${blob.size} bytes with type ${contentType}`);
    
    const snapshot = await uploadBytes(storageRef, blob, uploadMetadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    console.log(`Successfully uploaded image: ${imagePath} -> ${downloadUrl}`);
    
    return {
      filename: getFilenameFromPath(storagePath),
      path: imagePath,
      fullPath: snapshot.ref.fullPath,
      downloadUrl,
      metadata: snapshot.metadata,
      ref: snapshot.ref
    };
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    throw error;
  }
};

/**
 * Check if a URL is a Firebase Storage URL
 * @param {string} url - URL to check
 * @returns {boolean} True if it's a Firebase Storage URL
 */
export const isFirebaseStorageUrl = (url) => {
  return url && typeof url === 'string' && (
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('firebasestorage.app')
  );
};

/**
 * Creates an image mapping record in Firestore
 * @param {Object} mapping - Image mapping object
 * @param {string} mapping.localPath - Original local path
 * @param {string} mapping.storagePath - Firebase Storage path
 * @param {string} mapping.downloadUrl - Download URL
 * @param {string} mapping.type - Type of image (project, certificate, profile, testimonial)
 * @param {string} [mapping.entityId] - ID of the entity this image belongs to
 * @param {string} [mapping.thumbnailPath] - Path to thumbnail if applicable
 * @param {string} [mapping.thumbnailUrl] - URL of thumbnail if applicable
 * @returns {Promise<string>} Promise with document ID
 */
export const saveImageMapping = async (mapping) => {
  try {
    const mappingsCollection = collection(db, DEFAULT_COLLECTIONS.imageMappings);
    const docRef = await addDoc(mappingsCollection, {
      ...mapping,
      createdAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving image mapping:', error);
    throw error;
  }
};