import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

// Global flag to disable Firebase fetching
let useLocalDataOnly = false;

export const setUseLocalDataOnly = (value) => {
  useLocalDataOnly = value;
  localStorage.setItem('useLocalDataOnly', value ? 'true' : 'false');
  // Force reload to apply the change
  window.location.reload();
};

// Check local storage on load and reset to false if needed
try {
  const localStorageValue = localStorage.getItem('useLocalDataOnly');
  useLocalDataOnly = localStorageValue === 'true';
  // Reset to false if it was true, to ensure data is fetched
  if (useLocalDataOnly) {
    console.log('Resetting useLocalDataOnly to false to enable Firebase data fetching');
    localStorage.setItem('useLocalDataOnly', 'false');
    useLocalDataOnly = false;
  }
} catch (e) {
  console.error('Error accessing localStorage:', e);
}

export const useFirebaseData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Skip Firebase if using local data only
      if (useLocalDataOnly) {
        console.log('Firebase data fetch skipped - using local data only');
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting to fetch data from Firebase...');
        
        // Remove the unused timeout promise that's causing errors
        const result = {};

        // Fetch main profile data
        try {
          const mainDoc = await getDoc(doc(db, 'main', 'profile'));
          if (mainDoc.exists()) {
            console.log('Main profile data fetched successfully');
            result.main = mainDoc.data();
          } else {
            console.log('Main profile document does not exist - trying fallback');
            
            // Try to get profile directly from the profile collection as fallback
            const profileSnapshot = await getDocs(collection(db, 'profile'));
            if (!profileSnapshot.empty) {
              console.log('Profile data fetched from profile collection');
              result.main = profileSnapshot.docs[0].data();
            } else {
              console.log('No profile data found in either location');
            }
          }
        } catch (err) {
          console.error('Error fetching main profile data:', err);
        }

        // Fetch resume data (work, education, skills)
        // For now, we'll put these in separate collections
        // but in the future you might want to reorganize

        try {
          // Fetch education data
          const educationSnapshot = await getDocs(collection(db, 'education'));
          result.resume = result.resume || {};
          result.resume.education = educationSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`Education data: ${educationSnapshot.docs.length} records`);
        } catch (err) {
          console.error('Error fetching education data:', err);
        }

        try {
          // Fetch work experience data
          const workSnapshot = await getDocs(collection(db, 'work'));
          result.resume = result.resume || {};
          result.resume.work = workSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`Work data: ${workSnapshot.docs.length} records`);
        } catch (err) {
          console.error('Error fetching work data:', err);
        }

        try {
          // Fetch skills data
          const skillsSnapshot = await getDocs(collection(db, 'skills'));
          result.resume = result.resume || {};
          result.resume.skills = skillsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`Skills data: ${skillsSnapshot.docs.length} records`);
        } catch (err) {
          console.error('Error fetching skills data:', err);
        }

        try {
          // Fetch certificates data
          const certificatesSnapshot = await getDocs(collection(db, 'certificates'));
          result.resume = result.resume || {};
          result.resume.certificates = certificatesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`Certificates data: ${certificatesSnapshot.docs.length} records`);
        } catch (err) {
          console.error('Error fetching certificates data:', err);
        }

        try {
          // Fetch portfolio projects
          const projectsCollection = collection(db, 'projects');
          const projectsSnapshot = await getDocs(projectsCollection);
          
          // Extract projects and sort them manually
          const projects = projectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort projects by displayOrder if available (lowest first), 
          // or by createdAt (newest first) as fallback
          projects.sort((a, b) => {
            // If both have displayOrder, use it (lowest first)
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
              return a.displayOrder - b.displayOrder;
            }
            
            // If only one has displayOrder, prioritize the one with displayOrder
            if (a.displayOrder !== undefined) return -1;
            if (b.displayOrder !== undefined) return 1;
            
            // Fallback to createdAt if neither has displayOrder
            if (a.createdAt && b.createdAt) {
              // Handle both Firestore timestamps and string timestamps
              const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
              const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0); 
              return timeB - timeA; // Sort descending (newest first)
            }
            
            // Final fallback - keep original order
            return 0;
          });
          
          result.portfolio = { projects };
          console.log(`Projects data: ${projects.length} records`);
        } catch (err) {
          console.error('Error fetching projects data:', err);
        }

        // Only set data if we have something useful
        if (Object.keys(result).length > 0 &&
            (result.main || (result.resume && Object.keys(result.resume).length > 0) || 
             (result.portfolio && result.portfolio.projects && result.portfolio.projects.length > 0))) {
          console.log('Setting Firebase data');
          setData(result);
        } else {
          console.log('Not enough Firebase data retrieved to use');
        }
      } catch (err) {
        console.error('Error fetching data from Firebase:', err);
        // Log specific Firebase error info
        if (err.code) {
          console.error(`Firebase error code: ${err.code}`);
        }
        setError(err);
        
        // Force fallback to JSON data by ensuring loading is complete
        console.log('Falling back to local JSON data due to Firebase error');
      } finally {
        setLoading(false);
      }
    };

    // Add a fallback timeout in case Firebase operations hang
    // Ensure we don't have a race condition with the loading state
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {  // Only set if component is mounted and still loading
        console.log('Firebase data fetch timeout - forcing fallback to JSON data');
        setLoading(false);
      }
    }, 8000);  // Reduced timeout to ensure it happens before App.js timeout

    fetchData().finally(() => {
      // Clear timeout to prevent memory leaks
      clearTimeout(timeoutId);
    });
    
    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return { data, loading, error };
};

export default useFirebaseData;