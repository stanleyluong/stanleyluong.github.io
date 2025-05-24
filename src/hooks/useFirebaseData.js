import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

export const useFirebaseData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = {};

        // Fetch main profile data
        try {
          const mainDoc = await getDoc(doc(db, 'main', 'profile'));
          if (mainDoc.exists()) {
            result.main = mainDoc.data();
          } else {
            // Try to get profile directly from the profile collection as fallback
            const profileSnapshot = await getDocs(collection(db, 'profile'));
            if (!profileSnapshot.empty) {
              result.main = profileSnapshot.docs[0].data();
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
        } catch (err) {
          console.error('Error fetching projects data:', err);
        }

        // Only set data if we have something useful
        if (Object.keys(result).length > 0 &&
            (result.main || (result.resume && Object.keys(result.resume).length > 0) || 
             (result.portfolio && result.portfolio.projects && result.portfolio.projects.length > 0))) {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching data from Firebase:', err);
        if (err.code) {
          console.error(`Firebase error code: ${err.code}`);
        }
        setError(err);
        console.log('Falling back to local JSON data due to Firebase error');
      } finally {
        setLoading(false);
      }
    };
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log('Firebase data fetch timeout - forcing fallback to JSON data');
        setLoading(false);
      }
    }, 8000);
    fetchData().finally(() => {
      clearTimeout(timeoutId);
    });
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, loading, error };
};

export default useFirebaseData;