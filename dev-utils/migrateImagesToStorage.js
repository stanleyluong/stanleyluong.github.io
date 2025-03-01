import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Upload a single image to Firebase Storage
 * 
 * @param {string} imagePath - Path to the image in the public folder
 * @param {string} storagePath - Path to store in Firebase Storage
 * @returns {Promise<string>} - Download URL of the uploaded image
 */
export const uploadImageToStorage = async (imagePath, storagePath) => {
  try {
    console.log(`Attempting to upload image: ${imagePath} to ${storagePath}`);
    
    // Special case for local development - direct file access
    // Skip network requests entirely for local files to avoid CORS
    const getImageFile = async (url) => {
      // Normalize URL
      url = url.startsWith('/') ? url.substring(1) : url;
      
      try {
        // For local development only
        console.log(`Loading image data from: ${url}`);
        
        // Use a direct fetch with no-cors mode
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
    };
    
    // Get the image as a Blob
    const blob = await getImageFile(imagePath);
    console.log(`Got blob: ${blob ? 'Yes' : 'No'}, type: ${blob?.type}, size: ${blob?.size} bytes`);
    
    if (!blob || blob.size === 0) {
      throw new Error(`Could not load image from ${imagePath}`);
    }
    
    // Determine content type
    const contentType = blob.type || 
      (imagePath.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg');
    
    // Create metadata
    const metadata = {
      contentType: contentType
    };
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    console.log(`Uploading blob of size ${blob.size} bytes with type ${contentType}`);
    
    // Log Firebase Storage configuration to help debug CORS issues
    console.log('Firebase Storage configuration:');
    console.log('- Storage bucket:', storage._bucket);
    console.log('- App config:', storage.app.options);
    
    try {
      const snapshot = await uploadBytes(storageRef, blob, metadata);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`Successfully uploaded image: ${imagePath} -> ${downloadURL}`);
      
      return downloadURL;
    } catch (error) {
      console.error('Upload error details:', error);
      console.log('Error code:', error.code || 'unknown');
      console.log('Error message:', error.message || 'No message');
      console.log('Error serverResponse:', error.serverResponse || 'No server response');
      
      // Check if this is a CORS issue or other common error
      if (error.message && (
          error.message.includes('CORS') || 
          error.code === 'storage/unauthorized' ||
          error.code === 'storage/object-not-found' ||
          error.code === 'storage/quota-exceeded')
      ) {
        console.error('Firebase Storage error: ' + error.code);
        console.error('This may be a CORS configuration issue or permissions problem.');
        console.error('Make sure CORS is properly configured on your Firebase Storage bucket.');
        console.error('Check your Firebase Storage rules and quota as well.');
        
        // Return the original image path rather than failing
        console.warn('Continuing with original path due to storage error');
        return imagePath;
      }
      
      throw error;
    }
    
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    // Return a placeholder URL to allow the migration to continue
    console.log('Returning original image path as fallback');
    return imagePath;
  }
};

/**
 * Check if URL is a Firebase Storage URL and if we should force re-upload
 */
const isFirebaseStorageUrl = (url) => {
  // Check if force upload is enabled
  try {
    const forceUpload = localStorage.getItem('forceImageUpload') === 'true';
    if (forceUpload) {
      console.log('Force re-upload enabled, ignoring existing Firebase Storage URLs');
      return false; // Pretend it's not a Firebase URL if force upload is enabled
    }
  } catch (e) {
    console.warn('Failed to check localStorage for forceImageUpload:', e);
  }
  
  // Normal check
  return url && typeof url === 'string' && (
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('firebasestorage.app')
  );
};

/**
 * Extract filename from a path or URL
 */
const getFilenameFromPath = (path) => {
  if (!path) return '';
  
  // Remove query parameters if present
  const pathWithoutQuery = path.split('?')[0];
  
  // Get the filename from the path
  const parts = pathWithoutQuery.split('/');
  return parts[parts.length - 1];
};

/**
 * Migrate project images to Firebase Storage
 */
export const migrateProjectImages = async () => {
  const results = {
    total: 0,
    success: 0,
    failed: 0,
    updatedProjects: 0,
    skipped: 0
  };
  
  try {
    // Get all projects
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    results.total = projectsSnapshot.docs.length;
    
    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      let updated = false;
      
      // Main project image
      if (project.image) {
        // Skip already uploaded Firebase Storage URLs
        if (isFirebaseStorageUrl(project.image)) {
          console.log(`Skipping already uploaded image: ${project.image}`);
          results.skipped++;
        } 
        // Upload local images
        else if (!project.image.startsWith('http')) {
          try {
            // Clean up the imagePath to prevent nested URLs
            const imagePath = project.image.startsWith('images/') 
              ? `/${project.image}` 
              : `/images/portfolio/${project.image}`;
            
            // Extract just the filename for the storage path
            const filename = getFilenameFromPath(project.image);
            const storagePath = `portfolio/${filename}`;
            
            console.log(`Uploading image from ${imagePath} to ${storagePath}`);
            const downloadURL = await uploadImageToStorage(imagePath, storagePath);
            
            // Update the project with the new URL
            project.originalImage = project.image;
            project.image = downloadURL;
            updated = true;
            results.success++;
          } catch (error) {
            console.error(`Failed to migrate main image for project ${project.title}:`, error);
            results.failed++;
          }
        }
      }
      
      // Project URL if it points to a local image
      if (project.url && project.url.startsWith('images/')) {
        try {
          const imagePath = `/${project.url}`;
          const filename = getFilenameFromPath(project.url);
          const storagePath = `portfolio/${filename}`;
          
          console.log(`Uploading URL image from ${imagePath} to ${storagePath}`);
          const downloadURL = await uploadImageToStorage(imagePath, storagePath);
          
          // Update the project with the new URL
          project.originalUrl = project.url;
          project.url = downloadURL;
          updated = true;
          results.success++;
        } catch (error) {
          console.error(`Failed to migrate URL image for project ${project.title}:`, error);
          results.failed++;
        }
      }
      
      // Project image gallery (if exists)
      if (project.images && Array.isArray(project.images)) {
        const updatedImages = [];
        const originalImages = [...project.images];
        
        for (const imageItem of project.images) {
          // Skip already uploaded Firebase Storage URLs
          if (isFirebaseStorageUrl(imageItem)) {
            console.log(`Skipping already uploaded gallery image: ${imageItem}`);
            updatedImages.push(imageItem);
            results.skipped++;
          } 
          // Upload local images
          else {
            try {
              const filename = getFilenameFromPath(imageItem);
              const imagePath = imageItem.startsWith('/') ? imageItem : `/images/portfolio/${filename}`;
              const storagePath = `portfolio/${filename}`;
              
              console.log(`Uploading gallery image from ${imagePath} to ${storagePath}`);
              const downloadURL = await uploadImageToStorage(imagePath, storagePath);
              
              updatedImages.push(downloadURL);
              results.success++;
            } catch (error) {
              console.error(`Failed to migrate gallery image ${imageItem} for project ${project.title}:`, error);
              results.failed++;
              // Keep the original image name if upload fails
              updatedImages.push(imageItem);
            }
          }
        }
        
        // Only update if we have changes to make
        if (JSON.stringify(updatedImages) !== JSON.stringify(originalImages)) {
          project.originalImages = originalImages;
          project.images = updatedImages;
          updated = true;
        }
      }
      
      // Update the project document if any changes were made
      if (updated) {
        await updateDoc(doc(db, 'projects', projectDoc.id), project);
        results.updatedProjects++;
      }
    }
    
    console.log('Project image migration completed:', results);
    return results;
    
  } catch (error) {
    console.error('Error migrating project images:', error);
    return results;
  }
};

/**
 * Migrate certificate images to Firebase Storage
 */
export const migrateCertificateImages = async () => {
  const results = {
    total: 0,
    success: 0,
    failed: 0,
    updatedCertificates: 0,
    skipped: 0
  };
  
  try {
    // Get all certificates
    const certificatesSnapshot = await getDocs(collection(db, 'certificates'));
    results.total = certificatesSnapshot.docs.length;
    
    for (const certDoc of certificatesSnapshot.docs) {
      const certificate = certDoc.data();
      let updated = false;
      
      // Certificate image
      if (certificate.image) {
        // Skip already uploaded Firebase Storage URLs
        if (isFirebaseStorageUrl(certificate.image)) {
          console.log(`Skipping already uploaded certificate image: ${certificate.image}`);
          results.skipped++;
        }
        // Upload local images
        else if (!certificate.image.startsWith('http')) {
          try {
            // Fix up the path if needed (remove ./ prefix)
            const imagePath = certificate.image.startsWith('./') 
              ? certificate.image.substring(1) 
              : certificate.image;
            
            // Get just the filename for storage path
            const filename = getFilenameFromPath(imagePath);
            const storagePath = `certificates/${filename}`;
            
            console.log(`Uploading certificate image from ${imagePath} to ${storagePath}`);
            const downloadURL = await uploadImageToStorage(imagePath, storagePath);
            
            // Update the certificate with the new URL
            certificate.originalImage = certificate.image;
            certificate.image = downloadURL;
            updated = true;
            results.success++;
          } catch (error) {
            console.error(`Failed to migrate image for certificate ${certificate.course}:`, error);
            results.failed++;
          }
        }
      }
      
      // Update the certificate document if any changes were made
      if (updated) {
        await updateDoc(doc(db, 'certificates', certDoc.id), certificate);
        results.updatedCertificates++;
      }
    }
    
    console.log('Certificate image migration completed:', results);
    return results;
    
  } catch (error) {
    console.error('Error migrating certificate images:', error);
    return results;
  }
};

/**
 * Migrate profile image to Firebase Storage
 */
export const migrateProfileImage = async () => {
  try {
    // Get the profile document
    const profileDoc = await getDocs(collection(db, 'main'));
    
    if (profileDoc.docs.length === 0) {
      console.error('Profile document not found');
      return false;
    }
    
    const profile = profileDoc.docs[0].data();
    const profileId = profileDoc.docs[0].id;
    
    // Check if profile image exists and is not already a Firebase Storage URL
    if (profile.image) {
      // Skip if already a Firebase Storage URL
      if (isFirebaseStorageUrl(profile.image)) {
        console.log(`Profile image is already on Firebase Storage: ${profile.image}`);
        return true;
      }
      // Upload if it's a local image
      else if (!profile.image.startsWith('http')) {
        try {
          console.log(`Profile image found: ${profile.image}`);
          // Correct path handling for profile pic
          let imagePath;
          if (profile.image === 'profilepic.webp') {
            imagePath = `/images/profilepic.webp`;
          } else {
            imagePath = profile.image.startsWith('/') ? profile.image : `/images/${profile.image}`;
          }
          console.log(`Using image path: ${imagePath}`);
          
          // Ensure storage path doesn't include 'images/' twice
          const storagePath = `profile/profilepic.webp`;
          console.log(`Using storage path: ${storagePath}`);
          
          const downloadURL = await uploadImageToStorage(imagePath, storagePath);
          
          // Update profile with new image URL
          profile.originalImage = profile.image;
          profile.image = downloadURL;
          
          // Update the document
          await updateDoc(doc(db, 'main', profileId), profile);
          console.log('Profile image successfully migrated');
          return true;
        } catch (error) {
          console.error('Failed to migrate profile image:', error);
          return false;
        }
      }
    }
    
    console.log('Profile image not found or already using external URL');
    return false;
    
  } catch (error) {
    console.error('Error migrating profile image:', error);
    return false;
  }
};

/**
 * Run all image migrations
 */
export const migrateAllImages = async () => {
  try {
    console.log('Starting migration of all images to Firebase Storage...');
    
    // Migrate profile image
    const profileResult = await migrateProfileImage();
    
    // Migrate project images
    const projectResults = await migrateProjectImages();
    
    // Migrate certificate images
    const certificateResults = await migrateCertificateImages();
    
    const results = {
      profile: profileResult,
      projects: projectResults,
      certificates: certificateResults
    };
    
    console.log('Image migration completed:', results);
    return results;
  } catch (error) {
    console.error('Error during image migration:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default migrateAllImages;