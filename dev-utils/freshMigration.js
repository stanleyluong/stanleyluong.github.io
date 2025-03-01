import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { 
  uploadImage, 
  getFilenameFromPath, 
  saveImageMapping 
} from './imageHelper';

// Default collection names
const COLLECTIONS = {
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
 * Clear all data from Firebase (Firestore collections and Storage)
 */
export const clearAllData = async () => {
  const results = {
    deletedCollections: [],
    deletedStorage: false,
    errors: []
  };
  
  try {
    // 1. Clear Firestore collections
    for (const collectionName of Object.values(COLLECTIONS)) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        // Delete each document in the collection
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        results.deletedCollections.push(collectionName);
        console.log(`Deleted all documents in collection: ${collectionName}`);
      } catch (error) {
        console.error(`Error deleting collection ${collectionName}:`, error);
        results.errors.push(`Failed to delete collection ${collectionName}: ${error.message}`);
      }
    }
    
    // 2. Clear Storage
    try {
      // Delete all files in portfolio folder
      const portfolioRef = ref(storage, 'portfolio');
      await clearStorageFolder(portfolioRef);
      
      // Delete all files in certificates folder
      const certificatesRef = ref(storage, 'certificates');
      await clearStorageFolder(certificatesRef);
      
      // Delete all files in profile folder
      const profileRef = ref(storage, 'profile');
      await clearStorageFolder(profileRef);
      
      results.deletedStorage = true;
      console.log('Deleted all files in Firebase Storage');
    } catch (error) {
      console.error('Error deleting files from Storage:', error);
      results.errors.push(`Failed to delete files from Storage: ${error.message}`);
    }
    
    return results;
  } catch (error) {
    console.error('Error clearing data:', error);
    results.errors.push(`General error: ${error.message}`);
    return results;
  }
};

/**
 * Clear a folder in Firebase Storage
 * @param {Object} folderRef - Firebase Storage reference to folder
 */
const clearStorageFolder = async (folderRef) => {
  try {
    // List all items in the folder
    const listResult = await listAll(folderRef);
    
    // Delete all files
    await Promise.all(listResult.items.map(fileRef => deleteObject(fileRef)));
    
    // Recursively delete subfolders
    await Promise.all(listResult.prefixes.map(prefixRef => clearStorageFolder(prefixRef)));
    
    console.log(`Cleared folder: ${folderRef.fullPath}`);
  } catch (error) {
    console.error(`Error clearing folder ${folderRef.fullPath}:`, error);
    throw error;
  }
};

/**
 * Migrate a profile image to Firebase Storage
 * @param {Object} profileData - Profile data object
 * @returns {Object} Image upload result
 */
export const migrateProfileImage = async (profileData) => {
  try {
    if (!profileData.image) {
      console.warn('No profile image found in profile data');
      return null;
    }
    
    // Skip if already a URL
    if (profileData.image.startsWith('http')) {
      return { downloadUrl: profileData.image, isExistingUrl: true };
    }
    
    // Set up image paths
    let imagePath = profileData.image;
    if (!imagePath.startsWith('/')) {
      imagePath = `/images/${imagePath}`;
    }
    
    // Upload to Firebase Storage
    const storagePath = `profile/profilepic.webp`;
    const uploadResult = await uploadImageWithMapping(imagePath, storagePath, 'profile');
    
    return uploadResult;
  } catch (error) {
    console.error('Error migrating profile image:', error);
    return { error: true };
  }
};

/**
 * Upload an image and create an image mapping record
 * @param {string} imagePath - Path to the image
 * @param {string} storagePath - Path in Firebase Storage
 * @param {string} imageType - Type of image ('project', 'certificate', 'profile')
 * @returns {Object} Image upload result with mapping ID
 */
const uploadImageWithMapping = async (imagePath, storagePath, imageType) => {
  try {
    // Skip if it's already an external URL
    if (imagePath.startsWith('http')) {
      return { downloadUrl: imagePath, isExistingUrl: true };
    }
    
    // Upload image
    const uploadResult = await uploadImage(imagePath, storagePath);
    
    // Save mapping
    const mappingId = await saveImageMapping({
      localPath: imagePath,
      storagePath: uploadResult.fullPath,
      downloadUrl: uploadResult.downloadUrl,
      type: imageType
    });
    
    return {
      ...uploadResult,
      mappingId,
      isExistingUrl: false
    };
  } catch (error) {
    console.error(`Failed to upload image ${imagePath}:`, error);
    throw error;
  }
};

/**
 * Migrate project images to Firebase Storage with the new structure
 * @param {Object} project - Project data
 * @returns {Object} Image upload results
 */
export const migrateProjectImages = async (project) => {
  try {
    const imageResults = {
      thumbnail: null,     // Thumbnail image
      detailImages: [],    // All detail/gallery images
      isVisualProject: false // Flag to indicate if it's a visual-only project (Meta projects)
    };
    
    // Determine if this is a visual-only project (Meta projects or URL pointing to an image)
    imageResults.isVisualProject = 
      project.category?.includes('Meta') || 
      (project.url && project.url.startsWith('images/'));
    
    // 1. Process thumbnail image (always the project.image)
    if (project.image) {
      try {
        // Get image path
        let imagePath = project.image;
        if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
          imagePath = `/images/portfolio/${imagePath}`;
        }
        
        // Skip if it's already an external URL
        if (!imagePath.startsWith('http')) {
          const filename = getFilenameFromPath(imagePath);
          const storagePath = `portfolio/thumbnails/${filename}`;
          
          // Upload image and save mapping
          const uploadResult = await uploadImageWithMapping(imagePath, storagePath, 'project');
          imageResults.thumbnail = uploadResult;
        } else {
          imageResults.thumbnail = { downloadUrl: imagePath, isExistingUrl: true };
        }
      } catch (error) {
        console.error(`Failed to migrate thumbnail image for project ${project.title}:`, error);
      }
    }
    
    // 2. Process all detail images (including the main detail image if URL points to an image)
    
    // 2.1 If url points to an image, add it as the first detail image
    if (project.url && project.url.startsWith('images/')) {
      try {
        const imagePath = `/${project.url}`;
        const filename = getFilenameFromPath(imagePath);
        const storagePath = `portfolio/details/${filename}`;
        
        // Upload image and save mapping
        const uploadResult = await uploadImageWithMapping(imagePath, storagePath, 'project');
        imageResults.detailImages.push(uploadResult);
      } catch (error) {
        console.error(`Failed to migrate detail image from URL for project ${project.title}:`, error);
      }
    }
    
    // 2.2 Process all images from the gallery array
    if (project.images && Array.isArray(project.images)) {
      for (const imageName of project.images) {
        try {
          // Skip if it's already an external URL
          if (imageName.startsWith('http')) {
            imageResults.detailImages.push({ downloadUrl: imageName, isExistingUrl: true });
            continue;
          }
          
          const imagePath = `/images/portfolio/${imageName}`;
          const storagePath = `portfolio/details/${imageName}`;
          
          // Upload image and save mapping
          const uploadResult = await uploadImageWithMapping(imagePath, storagePath, 'project');
          imageResults.detailImages.push(uploadResult);
        } catch (error) {
          console.error(`Failed to migrate gallery image ${imageName} for project ${project.title}:`, error);
          // Add a placeholder for failed uploads to maintain array order
          imageResults.detailImages.push({ error: true, originalPath: imageName });
        }
      }
    }
    
    // 2.3 If there are no detailImages yet and this isn't a visual-only project,
    // use the thumbnail as the detail image as well
    if (imageResults.detailImages.length === 0 && imageResults.thumbnail && !imageResults.isVisualProject) {
      // No need to re-upload, just reference the same URL
      imageResults.detailImages.push({
        downloadUrl: imageResults.thumbnail.downloadUrl,
        isExistingUrl: true,
        referencesThumb: true
      });
    }
    
    return imageResults;
  } catch (error) {
    console.error(`Error migrating images for project ${project.title}:`, error);
    throw error;
  }
};

/**
 * Migrate certificate image to Firebase Storage
 * @param {Object} certificate - Certificate data
 * @returns {Object} Image upload result
 */
export const migrateCertificateImage = async (certificate) => {
  try {
    // Skip if no image
    if (!certificate.image) {
      return null;
    }
    
    // Skip if already a URL
    if (certificate.image.startsWith('http')) {
      return { downloadUrl: certificate.image, isExistingUrl: true };
    }
    
    // Fix up the path if needed (remove ./ prefix)
    let imagePath = certificate.image;
    if (imagePath.startsWith('./')) {
      imagePath = imagePath.substring(1);
    }
    
    // Get just the filename for storage path
    const filename = getFilenameFromPath(imagePath);
    const storagePath = `certificates/${filename}`;
    
    // Upload image and save mapping
    const uploadResult = await uploadImageWithMapping(imagePath, storagePath, 'certificate');
    
    return uploadResult;
  } catch (error) {
    console.error(`Error migrating image for certificate ${certificate.course}:`, error);
    return { error: true, certificate };
  }
};

/**
 * Migrate JSON data to Firestore with image handling
 * @param {Object} jsonData - Portfolio JSON data
 * @returns {Object} Migration results
 */
export const migrateData = async (jsonData) => {
  const results = {
    main: false,
    education: { total: 0, success: 0 },
    work: { total: 0, success: 0 },
    skills: { total: 0, success: 0 },
    certificates: { total: 0, success: 0 },
    projects: { total: 0, success: 0 },
    testimonials: { total: 0, success: 0 }
  };
  
  try {
    // 1. Migrate main profile
    if (jsonData.main) {
      try {
        // Upload profile image first
        const profileImageResult = await migrateProfileImage(jsonData.main);
        
        // Add to Firestore with the image URL
        const profileData = {
          ...jsonData.main,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Update image URL if we have a result
        if (profileImageResult) {
          profileData.originalImage = jsonData.main.image;
          profileData.image = profileImageResult.downloadUrl;
          profileData.imageId = profileImageResult.mappingId;
        }
        
        await setDoc(doc(db, COLLECTIONS.main, 'profile'), profileData);
        
        results.main = true;
        console.log('Main profile data migrated successfully');
      } catch (error) {
        console.error('Error migrating main profile data:', error);
      }
    }
    
    // 2. Migrate education data
    if (jsonData.resume && jsonData.resume.education) {
      results.education.total = jsonData.resume.education.length;
      
      for (const education of jsonData.resume.education) {
        try {
          const educationRef = await addDoc(collection(db, COLLECTIONS.education), {
            ...education,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Update the document with its ID for easier reference
          await setDoc(educationRef, { id: educationRef.id }, { merge: true });
          
          results.education.success++;
          console.log(`Education data migrated: ${education.school} - ${education.degree}`);
        } catch (error) {
          console.error(`Error migrating education data for ${education.school}:`, error);
        }
      }
    }
    
    // 3. Migrate work experience
    if (jsonData.resume && jsonData.resume.work) {
      results.work.total = jsonData.resume.work.length;
      
      for (const work of jsonData.resume.work) {
        try {
          const workRef = await addDoc(collection(db, COLLECTIONS.work), {
            ...work,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Update the document with its ID for easier reference
          await setDoc(workRef, { id: workRef.id }, { merge: true });
          
          results.work.success++;
          console.log(`Work data migrated: ${work.company} - ${work.title}`);
        } catch (error) {
          console.error(`Error migrating work data for ${work.company}:`, error);
        }
      }
    }
    
    // 4. Migrate skills
    if (jsonData.resume && jsonData.resume.skills) {
      results.skills.total = jsonData.resume.skills.length;
      
      for (const skill of jsonData.resume.skills) {
        try {
          const skillRef = await addDoc(collection(db, COLLECTIONS.skills), {
            ...skill,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Update the document with its ID for easier reference
          await setDoc(skillRef, { id: skillRef.id }, { merge: true });
          
          results.skills.success++;
          console.log(`Skill data migrated: ${skill.name}`);
        } catch (error) {
          console.error(`Error migrating skill data for ${skill.name}:`, error);
        }
      }
    }
    
    // 5. Migrate certificates with images
    if (jsonData.resume && jsonData.resume.certificates) {
      results.certificates.total = jsonData.resume.certificates.length;
      
      for (const certificate of jsonData.resume.certificates) {
        try {
          // First upload the image
          const imageResult = await migrateCertificateImage(certificate);
          
          // Create certificate data object
          const certificateData = {
            ...certificate,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Update image URL if we have a result
          if (imageResult) {
            certificateData.originalImage = certificate.image;
            certificateData.image = imageResult.downloadUrl;
            certificateData.imageId = imageResult.mappingId;
          }
          
          // Add to Firestore
          const certificateRef = await addDoc(collection(db, COLLECTIONS.certificates), certificateData);
          
          // Update the certificate record with its ID for easier reference
          await setDoc(certificateRef, { id: certificateRef.id }, { merge: true });
          
          // Update the image mapping with the certificate ID if we have a result
          if (imageResult && imageResult.mappingId) {
            const mappingRef = doc(db, COLLECTIONS.imageMappings, imageResult.mappingId);
            await setDoc(mappingRef, { entityId: certificateRef.id }, { merge: true });
          }
          
          results.certificates.success++;
          console.log(`Certificate data migrated: ${certificate.course}`);
        } catch (error) {
          console.error(`Error migrating certificate data for ${certificate.course}:`, error);
        }
      }
    }
    
    // 6. Migrate projects with images
    if (jsonData.portfolio && jsonData.portfolio.projects) {
      results.projects.total = jsonData.portfolio.projects.length;
      
      for (const project of jsonData.portfolio.projects) {
        try {
          // First upload all images
          const imageResults = await migrateProjectImages(project);
          
          // Create project data object
          const projectData = {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Update with the new structure
          
          // 1. Thumbnail image
          if (imageResults.thumbnail) {
            projectData.originalThumbnail = project.image;
            projectData.thumbnail = imageResults.thumbnail.downloadUrl;
            projectData.thumbnailId = imageResults.thumbnail.mappingId;
          }
          
          // 2. Detail images array (always set this)
          projectData.images = imageResults.detailImages.map(img => img.downloadUrl || img.originalPath);
          projectData.imageIds = imageResults.detailImages
            .filter(img => img.mappingId)
            .map(img => img.mappingId);
          
          // 3. URL handling
          // If it's a visual project (Meta or image URL), set URL to the first detail image
          if (imageResults.isVisualProject && imageResults.detailImages.length > 0) {
            projectData.originalUrl = project.url;
            projectData.url = imageResults.detailImages[0].downloadUrl;
            // Don't need a special URL ID since it's just pointing to the first image
          } 
          // Otherwise keep the original URL if it's a web link
          
          // Add to Firestore
          const projectRef = await addDoc(collection(db, COLLECTIONS.projects), projectData);
          
          // Update the project record with its ID for easier reference
          await setDoc(projectRef, { id: projectRef.id }, { merge: true });
          
          // Update all image mappings with the project ID
          const updateMappings = [];
          
          // Update thumbnail mapping
          if (imageResults.thumbnail && imageResults.thumbnail.mappingId) {
            updateMappings.push(
              setDoc(doc(db, COLLECTIONS.imageMappings, imageResults.thumbnail.mappingId), 
                { 
                  entityId: projectRef.id,
                  isThumbnail: true 
                }, 
                { merge: true })
            );
          }
          
          // Update all detail images
          imageResults.detailImages.forEach((img, index) => {
            if (img.mappingId) {
              updateMappings.push(
                setDoc(doc(db, COLLECTIONS.imageMappings, img.mappingId), 
                  { 
                    entityId: projectRef.id,
                    displayOrder: index,
                    isFirstDetail: index === 0
                  }, 
                  { merge: true })
              );
            }
          });
          
          if (updateMappings.length > 0) {
            await Promise.all(updateMappings);
          }
          
          results.projects.success++;
          console.log(`Project data migrated: ${project.title}`);
        } catch (error) {
          console.error(`Error migrating project data for ${project.title}:`, error);
        }
      }
    }
    
    // 7. Migrate testimonials
    if (jsonData.testimonials && jsonData.testimonials.testimonials) {
      results.testimonials.total = jsonData.testimonials.testimonials.length;
      
      for (const testimonial of jsonData.testimonials.testimonials) {
        try {
          const testimonialRef = await addDoc(collection(db, COLLECTIONS.testimonials), {
            ...testimonial,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Update the document with its ID for easier reference
          await setDoc(testimonialRef, { id: testimonialRef.id }, { merge: true });
          
          results.testimonials.success++;
          console.log(`Testimonial data migrated: ${testimonial.user}`);
        } catch (error) {
          console.error(`Error migrating testimonial data for ${testimonial.user}:`, error);
        }
      }
    }
    
    console.log('Data migration completed:', results);
    return results;
  } catch (error) {
    console.error('Error during data migration:', error);
    return results;
  }
};

/**
 * Perform a complete fresh migration (clear existing data and migrate from JSON)
 * @param {Object} jsonData - Portfolio JSON data
 * @returns {Object} Migration results
 */
export const freshMigration = async (jsonData) => {
  try {
    // 1. Clear all existing data
    console.log('Clearing existing data...');
    const clearResults = await clearAllData();
    
    // 2. Migrate data
    console.log('Migrating data from JSON...');
    const migrationResults = await migrateData(jsonData);
    
    return {
      clearResults,
      migrationResults
    };
  } catch (error) {
    console.error('Error during fresh migration:', error);
    return {
      error: error.message
    };
  }
};