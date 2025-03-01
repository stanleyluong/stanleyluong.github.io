import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  connectFirestoreEmulator,
  getDoc
} from 'firebase/firestore';

/**
 * Utility to migrate resumeData.json to Firebase Firestore
 * Run this function when you're ready to move your data
 */
export const migrateDataToFirebase = async (resumeData) => {
  if (!resumeData) {
    console.error('No resume data provided for migration');
    return false;
  }

  // First check if Firestore is accessible
  try {
    // Check if we can access Firestore
    const testDoc = await getDoc(doc(db, 'test', 'connectivity'));
    console.log('Firestore connection test:', testDoc ? 'success' : 'no test doc but connected');
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }

  try {
    console.log('Starting data migration to Firebase...');
    console.log('Resume data structure:', 
      Object.keys(resumeData).join(', '),
      resumeData.main ? 'Main data: OK' : 'Main data: Missing',
      resumeData.resume ? 'Resume data: OK' : 'Resume data: Missing',
      resumeData.portfolio ? 'Portfolio data: OK' : 'Portfolio data: Missing'
    );
    
    // Migrate main profile data
    if (resumeData.main) {
      console.log('Migrating main profile data...');
      await setDoc(doc(db, 'main', 'profile'), resumeData.main);
    }
    
    // Migrate education data
    if (resumeData.resume && resumeData.resume.education) {
      console.log('Migrating education data...');
      
      // Clear existing education collection
      const educationSnapshot = await getDocs(collection(db, 'education'));
      const batch = writeBatch(db);
      educationSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Add new education data
      for (const item of resumeData.resume.education) {
        await addDoc(collection(db, 'education'), item);
      }
    }
    
    // Migrate work experience data
    if (resumeData.resume && resumeData.resume.work) {
      console.log('Migrating work experience data...');
      
      // Clear existing work collection
      const workSnapshot = await getDocs(collection(db, 'work'));
      const batch = writeBatch(db);
      workSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Add new work data
      for (const item of resumeData.resume.work) {
        await addDoc(collection(db, 'work'), item);
      }
    }
    
    // Migrate skills data
    if (resumeData.resume && resumeData.resume.skills) {
      console.log('Migrating skills data...');
      
      // Clear existing skills collection
      const skillsSnapshot = await getDocs(collection(db, 'skills'));
      const batch = writeBatch(db);
      skillsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Add new skills data
      for (const item of resumeData.resume.skills) {
        await addDoc(collection(db, 'skills'), item);
      }
    }
    
    // Migrate certificates data
    if (resumeData.resume && resumeData.resume.certificates) {
      console.log('Migrating certificates data...');
      
      // Clear existing certificates collection
      const certificatesSnapshot = await getDocs(collection(db, 'certificates'));
      const batch = writeBatch(db);
      certificatesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Add new certificates data
      for (const item of resumeData.resume.certificates) {
        await addDoc(collection(db, 'certificates'), item);
      }
    }
    
    // Migrate portfolio projects data
    if (resumeData.portfolio && resumeData.portfolio.projects) {
      console.log('Migrating portfolio projects data...');
      
      // Clear existing projects collection
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const batch = writeBatch(db);
      projectsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Add new projects data
      for (const item of resumeData.portfolio.projects) {
        await addDoc(collection(db, 'projects'), item);
      }
    }
    
    console.log('Data migration to Firebase completed successfully!');
    return true;
  } catch (error) {
    console.error('Error migrating data to Firebase:', error);
    return false;
  }
};

export default migrateDataToFirebase;