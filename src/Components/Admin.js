import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import CertificatesView from './AdminViews/CertificatesView'; // Added import
import DashboardView from './AdminViews/DashboardView'; // Added import
import EducationView from './AdminViews/EducationView'; // Added import
import ProfileView from './AdminViews/ProfileView'; // Added import
import ProjectsView from './AdminViews/ProjectsView'; // Added import
import SettingsView from './AdminViews/SettingsView'; // Added import
import SkillsView from './AdminViews/SkillsView'; // Added import
import WorkView from './AdminViews/WorkView'; // Added import
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { db, setFirebaseConfig, storage } from '../firebase/config';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or 'info'
  
  // Admin view state
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, projects, certificates, skills, work, education, profile
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    url: '',
    images: []
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Certificates state
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [newCertificate, setNewCertificate] = useState({
    school: '',
    course: '',
    date: '',
    image: ''
  });
  
  // Skills state
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend'
  });
  
  // Work experience state
  const [workExperience, setWorkExperience] = useState([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [newWork, setNewWork] = useState({
    company: '',
    title: '',
    years: '',
    description: ''
  });
  
  // Education state
  const [education, setEducation] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    graduated: '',
    description: ''
  });
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Form display state
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [configText, setConfigText] = useState('');

  // Get auth instance with persistence
  const auth = getAuth();
  
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  }, []);
 // Fetch projects from Firestore
 const fetchProjects = useCallback(async () => {
  setProjectsLoading(true);
  try {
    // Verify database connection
    try {
      const testDoc = await addDoc(collection(db, "connection_test"), {
        timestamp: new Date(),
        message: "Testing connection"
      });
      // Delete test doc to keep database clean
      await deleteDoc(doc(db, "connection_test", testDoc.id));
    } catch (connError) {
      console.error("Database connection test failed:", connError);
      throw new Error(`Database connection failed: ${connError.message}`);
    }
    
    const projectsCollection = collection(db, 'projects');
    
    // First try to get all projects without ordering
    const simpleSnapshot = await getDocs(projectsCollection);
    
    let projectsList = [];
    
    // Now try with ordering if we have data
    if (!simpleSnapshot.empty) {
      try {
        const projectsQuery = query(projectsCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(projectsQuery);
        projectsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (orderError) {
        projectsList = simpleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
    } else {
      console.warn('No projects found in the collection. Collection might be empty or permissions issue.');
    }
    
    setProjects(projectsList);
    return projectsList; // Return the data for chaining
  } catch (error) {
    console.error('Error fetching projects:', error);
    showMessage('Error loading projects: ' + error.message, 'error');
    throw error; // Re-throw to be caught by the caller
  } finally {
    setProjectsLoading(false);
  }
},[showMessage]);

// Fetch certificates from Firestore
const fetchCertificates = useCallback(async () => {
  setCertificatesLoading(true);
  try {
    const certificatesQuery = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(certificatesQuery);
    const certificatesList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCertificates(certificatesList);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    showMessage('Error loading certificates: ' + error.message, 'error');
  } finally {
    setCertificatesLoading(false);
  }
}, [showMessage]);

// Fetch profile from Firestore
const fetchProfile = useCallback(async () => {
  setProfileLoading(true);
  try {
    const profileDoc = await getDoc(doc(db, 'main', 'profile'));
    if (profileDoc.exists()) {
      setProfile(profileDoc.data());
    } else {
      console.log('No profile document found');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    showMessage('Error loading profile: ' + error.message, 'error');
  } finally {
    setProfileLoading(false);
  }
},[showMessage]);

// Fetch skills from Firestore
const fetchSkills = useCallback(async () => {
  setSkillsLoading(true);
  try {
    const skillsQuery = query(collection(db, 'skills'), orderBy('category', 'asc'));
    const snapshot = await getDocs(skillsQuery);
    const skillsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSkills(skillsList);
  } catch (error) {
    console.error('Error fetching skills:', error);
    showMessage('Error loading skills: ' + error.message, 'error');
  } finally {
    setSkillsLoading(false);
  }
},[showMessage]);

// Fetch work experience from Firestore
const fetchWorkExperience = useCallback(async () => {
  setWorkLoading(true);
  try {
    const workQuery = query(collection(db, 'work'), orderBy('years', 'desc'));
    const snapshot = await getDocs(workQuery);
    const workList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setWorkExperience(workList);
  } catch (error) {
    console.error('Error fetching work experience:', error);
    showMessage('Error loading work experience: ' + error.message, 'error');
  } finally {
    setWorkLoading(false);
  }
},[showMessage]);

// Fetch education from Firestore
const fetchEducation = useCallback(async () => {
  setEducationLoading(true);
  try {
    // Try with 'graduated' field first
    let educationQuery;
    try {
      educationQuery = query(collection(db, 'education'), orderBy('graduated', 'desc'));
    } catch (e) {
      // If ordering by 'graduated' fails, fetch without ordering
      educationQuery = collection(db, 'education');
    }
    
    const snapshot = await getDocs(educationQuery);
    if (snapshot.empty) {
      console.log('No education documents found');
      setEducation([]);
    } else {
      const educationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort client-side if we couldn't sort in the query
      const sortedList = educationList.sort((a, b) => {
        // If both have 'graduated' field
        if (a.graduated && b.graduated) {
          return String(b.graduated).localeCompare(String(a.graduated));
        }
        // Ensure items with missing 'graduated' field appear at the end
        if (!a.graduated) return 1;
        if (!b.graduated) return -1;
        return 0;
      });
      
      setEducation(sortedList);
    }
  } catch (error) {
    console.error('Error fetching education:', error);
    showMessage('Error loading education: ' + error.message, 'error');
    setEducation([]); // Set to empty array to avoid undefined errors
  } finally {
    setEducationLoading(false);
  }
},[showMessage]);
  // Function to load all data types with proper error handling
  const loadAllData = useCallback(async () => {
    if (!user) {
      console.log("No user, can't load data");
      return;
    }
    
    console.log("User authenticated, loading data...");
    showMessage("Loading data...", "info");
    
    try {
      // Track loading state
      let successCount = 0;
      const totalDataTypes = 5; // Number of data types to load
      
      // Load projects
      try {
        await fetchProjects();
        console.log("Projects loaded successfully");
        successCount++;
      } catch (err) {
        console.error("Projects fetch failed:", err);
        showMessage("Error loading projects: " + err.message, "error");
        // Track error but variable not needed elsewhere
      }
      
      // Load certificates
      try {
        await fetchCertificates();
        console.log("Certificates loaded successfully");
        successCount++;
      } catch (err) {
        console.error("Certificates fetch failed:", err);
        showMessage("Error loading certificates: " + err.message, "error");
        // Track error but variable not needed elsewhere
      }
      
      // Load profile
      try {
        await fetchProfile();
        console.log("Profile loaded successfully");
        successCount++;
      } catch (err) {
        console.error("Profile fetch failed:", err);
        showMessage("Error loading profile: " + err.message, "error");
        // Track error but variable not needed elsewhere
      }
      
      // Load skills
      try {
        await fetchSkills();
        console.log("Skills loaded successfully");
        successCount++;
      } catch (err) {
        console.error("Skills fetch failed:", err);
        showMessage("Error loading skills: " + err.message, "error");
        // Track error but variable not needed elsewhere
      }
      
      // Load work experience
      try {
        await fetchWorkExperience();
        console.log("Work experience loaded successfully");
        successCount++;
      } catch (err) {
        console.error("Work experience fetch failed:", err);
        showMessage("Error loading work experience: " + err.message, "error");
        // Track error but variable not needed elsewhere
      }
      
      // Load education if function exists
      if (typeof fetchEducation === 'function') {
        try {
          await fetchEducation();
          console.log("Education loaded successfully");
          // Not counting this in the success count because it's optional
        } catch (err) {
          console.error("Education fetch failed:", err);
          showMessage("Error loading education: " + err.message, "error");
          // Not counting this in the fail count because it's optional
        }
      } else {
        console.warn("fetchEducation function not defined yet");
      }
      
      // Show final status
      if (successCount === totalDataTypes) {
        console.log("All data loaded successfully");
        showMessage("All data loaded successfully", "success");
      } else {
        console.log(`Loaded ${successCount}/${totalDataTypes} data types`);
        showMessage(`Loaded ${successCount}/${totalDataTypes} data types`, "info");
      }
      
    } catch (error) {
      console.error("Global error loading data:", error);
      showMessage("Error loading data: " + error.message, "error");
    }
  }, [user, fetchProjects, fetchCertificates, fetchProfile, fetchSkills, fetchWorkExperience, fetchEducation, showMessage]);

  // Handle authentication and initial data loading
  useEffect(() => {
    console.log("Admin component mounted, setting up auth listener");
    
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("User authenticated:", authUser.email);
        setUser(authUser);
        // Load data after authentication
        loadAllData();
      } else {
        setUser(null);
        console.log("No authenticated user");
      }
    });

    return () => {
      console.log("Admin component unmounting, unsubscribing from auth");
      unsubscribe();
    };
  }, [auth, loadAllData]);
  
 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      showMessage('Logged in successfully!', 'success');
      
      // Explicitly load data after login
      setTimeout(() => {
        console.log("Initiating data load after login");
        loadAllData();
      }, 500); // Small delay to ensure auth state is fully processed
    } catch (error) {
      console.error('Error logging in:', error);
      showMessage('Error logging in: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      showMessage('Logged out successfully!', 'success');
    } catch (error) {
      console.error('Error logging out:', error);
      showMessage('Error logging out: ' + error.message, 'error');
    }
  };

  // Upload a file to Firebase Storage
  const uploadFileToStorage = async (file, folder) => {
    try {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file);
      
      // Wait for upload to complete
      const snapshot = await uploadTask;
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        name: file.name,
        path: snapshot.ref.fullPath,
        url: downloadURL
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  // Generic image upload handler for any type of content
  const handleImageUpload = async (event, entityType, isThumb = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    setUploadProgress(0);
    
    try {
      let folder;
      let updatedEntity;
      
      // Determine folder and entity based on type
      switch (entityType) {
        case 'project':
          folder = isThumb ? 'portfolio/thumbnails' : 'portfolio/details';
          updatedEntity = editingProject ? { ...editingProject } : { ...newProject };
          // Create or update images array if it doesn't exist
          if (!updatedEntity.images) {
            updatedEntity.images = [];
          }
          break;
        case 'certificate':
          folder = 'certificates';
          updatedEntity = editingCertificate ? { ...editingCertificate } : { ...newCertificate };
          break;
        case 'profile':
          folder = 'profile';
          updatedEntity = { ...profile };
          break;
        default:
          folder = 'misc';
          break;
      }
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const fileInfo = await uploadFileToStorage(file, folder);
          
          // Update progress
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
          
          // Update entity based on type
          switch (entityType) {
            case 'project':
              if (isThumb) {
                // Set as thumbnail
                updatedEntity.thumbnail = fileInfo.url;
              } else {
                // Add to images array
                updatedEntity.images.push(fileInfo.url);
              }
              break;
            case 'certificate':
              // For certificates, just set the image URL
              updatedEntity.image = fileInfo.url;
              break;
            case 'profile':
              // For profile, set the image URL
              updatedEntity.image = fileInfo.url;
              console.log('Setting profile image to:', fileInfo.url);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(`Failed to upload file ${file.name}:`, error);
          showMessage(`Failed to upload ${file.name}: ${error.message}`, 'error');
        }
      }
      
      // Update state based on entity type
      switch (entityType) {
        case 'project':
          if (editingProject) {
            setEditingProject(updatedEntity);
          } else {
            setNewProject(updatedEntity);
          }
          break;
        case 'certificate':
          if (editingCertificate) {
            setEditingCertificate(updatedEntity);
          } else {
            setNewCertificate(updatedEntity);
          }
          break;
        case 'profile':
          setProfile(updatedEntity);
          break;
        default:
          break;
      }
      
      showMessage('Images uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error handling image upload:', error);
      showMessage('Error uploading images: ' + error.message, 'error');
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };
  
  // For backward compatibility - project specific handler
  const handleProjectImageUpload = (event, isThumb = false) => {
    handleImageUpload(event, 'project', isThumb);
  };
  
  // Save a new project to Firestore
  const saveNewProject = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newProject.title || !newProject.category) {
        showMessage('Title and category are required', 'error');
        setLoading(false);
        return;
      }
      
      // Add timestamps
      const projectData = {
        ...newProject,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      // Update with ID
      await updateDoc(docRef, { id: docRef.id });
      
      // Reset form and reload projects
      setNewProject({
        title: '',
        category: '',
        url: '',
        images: []
      });
      
      await fetchProjects();
      showMessage('Project created successfully!', 'success');
    } catch (error) {
      console.error('Error creating project:', error);
      showMessage('Error creating project: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing project
  const updateProject = async () => {
    if (!editingProject || !editingProject.id) {
      showMessage('No project selected for update', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!editingProject.title || !editingProject.category) {
        showMessage('Title and category are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const projectData = {
        ...editingProject,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      
      // Reset editing state and reload projects
      setEditingProject(null);
      await fetchProjects();
      showMessage('Project updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating project:', error);
      showMessage('Error updating project: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a project
  const deleteProject = async (projectId) => {
    if (!projectId) return;
    
    // Confirm with user
    const confirmed = window.confirm('Are you sure you want to delete this project? This cannot be undone.');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'projects', projectId));
      
      // Reload projects
      await fetchProjects();
      showMessage('Project deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting project:', error);
      showMessage('Error deleting project: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateFirebaseConfig = () => {
    try {
      if (!configText.trim()) {
        showMessage('Please enter a valid Firebase configuration', 'error');
        return;
      }
      
      const config = JSON.parse(configText);
      if (!config.apiKey || !config.projectId || !config.storageBucket) {
        showMessage('Configuration is missing required fields', 'error');
        return;
      }
      
      setFirebaseConfig(config);
      showMessage('Firebase configuration updated. Please refresh the page.', 'success');
    } catch (error) {
      console.error('Error parsing Firebase config:', error);
      showMessage('Invalid JSON format: ' + error.message, 'error');
    }
  };

  // If not logged in, show login form
  if (!user) {
    return (
      <section className="min-h-screen bg-darkBlue flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-lightBlue bg-opacity-20 p-8 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-lightestSlate">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-lightSlate">
              Enter your credentials to access admin features
            </p>
          </div>
          
          {message && (
            <div className={`p-4 rounded ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 
              messageType === 'info' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-darkBlue bg-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {loading ? 'Loading...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // Sidebar menu with nav options
  const renderSidebar = () => (
    <div className="w-64 bg-lightBlue bg-opacity-30 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-lightestSlate mb-4">Navigation</h3>
      <nav className="space-y-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'dashboard' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('profile')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'profile' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveView('projects')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'projects' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveView('certificates')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'certificates' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveView('skills')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'skills' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveView('work')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'work' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Work Experience
        </button>
        <button
          onClick={() => setActiveView('education')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'education' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Education
        </button>
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full text-left py-2 px-3 rounded ${activeView === 'settings' ? 'bg-green text-darkBlue' : 'hover:bg-lightBlue hover:bg-opacity-50'}`}
        >
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-3 rounded text-red-400 hover:bg-red-900 hover:bg-opacity-50 mt-8"
        >
          Logout
        </button>
      </nav>
    </div>
  );
  
  // Function to test database connection and verify configuration
  const testDatabaseWrite = async () => {
    try {
      console.log("Testing database write capability...");
      showMessage("Testing database write and connection...", "info");
      
      // Check Firebase config
      const config = db._app.options;
      if (!config || !config.projectId) {
        throw new Error("Firebase configuration is missing or invalid. Check your config.js file.");
      }
      
      // Try to write a test document
      await addDoc(collection(db, "test"), {
        message: "Test write successful",
        timestamp: new Date()
      });
      
      showMessage("Database write successful! Try adding content now.", "success");
      
      // Show collections info
      const collections = ['projects', 'certificates', 'skills', 'work', 'education'];
      showMessage("Checking collections...", "info");
      
      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          showMessage(`${collectionName}: ${snapshot.size} documents found`, "info");
        } catch (err) {
          showMessage(`Error checking ${collectionName}: ${err.message}`, "error");
        }
      }
      
    } catch (error) {
      showMessage("Database test failed: " + error.message, "error");
    }
  };
  
  // Save a new certificate to Firestore
  const saveNewCertificate = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newCertificate.course || !newCertificate.school) {
        showMessage('Course and school are required', 'error');
        setLoading(false);
        return;
      }
      
      // Add timestamps
      const certificateData = {
        ...newCertificate,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'certificates'), certificateData);
      
      // Update with ID
      await updateDoc(docRef, { id: docRef.id });
      
      // Reset form and reload certificates
      setNewCertificate({
        school: '',
        course: '',
        date: '',
        image: ''
      });
      
      await fetchCertificates();
      showMessage('Certificate created successfully!', 'success');
    } catch (error) {
      console.error('Error creating certificate:', error);
      showMessage('Error creating certificate: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing certificate
  const updateCertificate = async () => {
    if (!editingCertificate || !editingCertificate.id) {
      showMessage('No certificate selected for update', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!editingCertificate.course || !editingCertificate.school) {
        showMessage('Course and school are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const certificateData = {
        ...editingCertificate,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'certificates', editingCertificate.id), certificateData);
      
      // Reset editing state and reload certificates
      setEditingCertificate(null);
      await fetchCertificates();
      showMessage('Certificate updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating certificate:', error);
      showMessage('Error updating certificate: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile information
  const updateProfile = async () => {
    if (!profile) {
      showMessage('No profile data available', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!profile.name || !profile.bio) {
        showMessage('Name and bio are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const profileData = {
        ...profile,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await setDoc(doc(db, 'main', 'profile'), profileData);
      
      // Reset editing state
      setEditingProfile(false);
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('Error updating profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Save a new skill to Firestore
  const saveNewSkill = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newSkill.name || !newSkill.category) {
        showMessage('Name and category are required', 'error');
        setLoading(false);
        return;
      }
      
      // Add timestamps
      const skillData = {
        ...newSkill,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'skills'), skillData);
      
      // Update with ID
      await updateDoc(docRef, { id: docRef.id });
      
      // Reset form and reload skills
      setNewSkill({
        name: '',
        category: 'Frontend'
      });
      
      await fetchSkills();
      showMessage('Skill created successfully!', 'success');
    } catch (error) {
      console.error('Error creating skill:', error);
      showMessage('Error creating skill: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing skill
  const updateSkill = async () => {
    if (!editingSkill || !editingSkill.id) {
      showMessage('No skill selected for update', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!editingSkill.name || !editingSkill.category) {
        showMessage('Name and category are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const skillData = {
        ...editingSkill,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'skills', editingSkill.id), skillData);
      
      // Reset editing state and reload skills
      setEditingSkill(null);
      await fetchSkills();
      showMessage('Skill updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating skill:', error);
      showMessage('Error updating skill: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a skill
  const deleteSkill = async (skillId) => {
    if (!skillId) return;
    
    // Confirm with user
    const confirmed = window.confirm('Are you sure you want to delete this skill? This cannot be undone.');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'skills', skillId));
      
      // Reload skills
      await fetchSkills();
      showMessage('Skill deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting skill:', error);
      showMessage('Error deleting skill: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Save a new work experience entry to Firestore
  const saveNewWork = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newWork.company || !newWork.title || !newWork.years) {
        showMessage('Company, title, and years are required', 'error');
        setLoading(false);
        return;
      }
      
      // Add timestamps
      const workData = {
        ...newWork,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'work'), workData);
      
      // Update with ID
      await updateDoc(docRef, { id: docRef.id });
      
      // Reset form and reload work
      setNewWork({
        company: '',
        title: '',
        years: '',
        description: ''
      });
      
      await fetchWorkExperience();
      showMessage('Work experience created successfully!', 'success');
    } catch (error) {
      console.error('Error creating work experience:', error);
      showMessage('Error creating work experience: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing work experience entry
  const updateWork = async () => {
    if (!editingWork || !editingWork.id) {
      showMessage('No work experience selected for update', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!editingWork.company || !editingWork.title || !editingWork.years) {
        showMessage('Company, title, and years are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const workData = {
        ...editingWork,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'work', editingWork.id), workData);
      
      // Reset editing state and reload work
      setEditingWork(null);
      await fetchWorkExperience();
      showMessage('Work experience updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating work experience:', error);
      showMessage('Error updating work experience: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a work experience entry
  const deleteWork = async (workId) => {
    if (!workId) return;
    
    // Confirm with user
    const confirmed = window.confirm('Are you sure you want to delete this work experience? This cannot be undone.');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'work', workId));
      
      // Reload work
      await fetchWorkExperience();
      showMessage('Work experience deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting work experience:', error);
      showMessage('Error deleting work experience: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Save a new education entry to Firestore
  const saveNewEducation = async () => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newEducation.school || !newEducation.degree || !newEducation.graduated) {
        showMessage('School, degree, and graduation year are required', 'error');
        setLoading(false);
        return;
      }
      
      // Add timestamps
      const educationData = {
        ...newEducation,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'education'), educationData);
      
      // Update with ID
      await updateDoc(docRef, { id: docRef.id });
      
      // Reset form and reload education
      setNewEducation({
        school: '',
        degree: '',
        graduated: '',
        description: ''
      });
      
      await fetchEducation();
      showMessage('Education created successfully!', 'success');
    } catch (error) {
      console.error('Error creating education:', error);
      showMessage('Error creating education: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing education entry
  const updateEducation = async () => {
    if (!editingEducation || !editingEducation.id) {
      showMessage('No education selected for update', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!editingEducation.school || !editingEducation.degree || !editingEducation.graduated) {
        showMessage('School, degree, and graduation year are required', 'error');
        setLoading(false);
        return;
      }
      
      // Update timestamp
      const educationData = {
        ...editingEducation,
        updatedAt: new Date()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'education', editingEducation.id), educationData);
      
      // Reset editing state and reload education
      setEditingEducation(null);
      await fetchEducation();
      showMessage('Education updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating education:', error);
      showMessage('Error updating education: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an education entry
  const deleteEducation = async (educationId) => {
    if (!educationId) return;
    
    // Confirm with user
    const confirmed = window.confirm('Are you sure you want to delete this education? This cannot be undone.');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'education', educationId));
      
      // Reload education
      await fetchEducation();
      showMessage('Education deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting education:', error);
      showMessage('Error deleting education: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a certificate
  const deleteCertificate = async (certificateId) => {
    if (!certificateId) return;
    
    // Confirm with user
    const confirmed = window.confirm('Are you sure you want to delete this certificate? This cannot be undone.');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'certificates', certificateId));
      
      // Reload certificates
      await fetchCertificates();
      showMessage('Certificate deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showMessage('Error deleting certificate: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render the active view content
  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <ProfileView
            profile={profile}
            profileLoading={profileLoading}
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            setProfile={setProfile}
            uploadingImages={uploadingImages}
            uploadProgress={uploadProgress}
            handleImageUpload={handleImageUpload}
            updateProfile={updateProfile}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            projectsLoading={projectsLoading}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            newProject={newProject}
            setNewProject={setNewProject}
            uploadingImages={uploadingImages}
            uploadProgress={uploadProgress}
            handleProjectImageUpload={handleProjectImageUpload}
            saveNewProject={saveNewProject}
            updateProject={updateProject}
            deleteProject={deleteProject}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'certificates':
        return (
          <CertificatesView
            certificates={certificates}
            certificatesLoading={certificatesLoading}
            editingCertificate={editingCertificate}
            setEditingCertificate={setEditingCertificate}
            newCertificate={newCertificate}
            setNewCertificate={setNewCertificate}
            uploadingImages={uploadingImages}
            uploadProgress={uploadProgress}
            handleImageUpload={handleImageUpload}
            saveNewCertificate={saveNewCertificate}
            updateCertificate={updateCertificate}
            deleteCertificate={deleteCertificate}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'skills':
        return (
          <SkillsView
            skills={skills}
            skillsLoading={skillsLoading}
            editingSkill={editingSkill}
            setEditingSkill={setEditingSkill}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            saveNewSkill={saveNewSkill}
            updateSkill={updateSkill}
            deleteSkill={deleteSkill}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'work':
        return (
          <WorkView
            workExperience={workExperience}
            workLoading={workLoading}
            editingWork={editingWork}
            setEditingWork={setEditingWork}
            newWork={newWork}
            setNewWork={setNewWork}
            saveNewWork={saveNewWork}
            updateWork={updateWork}
            deleteWork={deleteWork}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'education':
        return (
          <EducationView
            education={education}
            educationLoading={educationLoading}
            editingEducation={editingEducation}
            setEditingEducation={setEditingEducation}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            saveNewEducation={saveNewEducation}
            updateEducation={updateEducation}
            deleteEducation={deleteEducation}
            loading={loading}
            showMessage={showMessage}
          />
        );
      case 'settings':
        return (
          <SettingsView
            showConfigForm={showConfigForm}
            setShowConfigForm={setShowConfigForm}
            configText={configText}
            setConfigText={setConfigText}
            handleUpdateFirebaseConfig={handleUpdateFirebaseConfig}
            showMessage={showMessage}
          />
        );
      default:
        return (
          <DashboardView
            projects={projects}
            certificates={certificates}
            skills={skills}
            workExperience={workExperience}
            education={education}
            setActiveView={setActiveView}
            loadAllData={loadAllData}
            testDatabaseWrite={testDatabaseWrite}
            showMessage={showMessage}
          />
        );
    }
  };
  
  // If logged in, show admin dashboard
  return (
    <section className="min-h-screen bg-darkBlue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Messages shown at the top on mobile */}
          {message && (
            <div className={`md:hidden w-full p-4 mb-2 rounded-lg ${
              messageType === 'success' ? 'bg-green bg-opacity-20 text-green-300' : 
              messageType === 'info' ? 'bg-blue-900 bg-opacity-30 text-blue-300' :
              'bg-red-900 bg-opacity-30 text-red-300'
            }`}>
              {message}
            </div>
          )}
          
          {/* Sidebar */}
          {renderSidebar()}
          
          {/* Main Content */}
          <div className="flex-grow">
            {/* Messages shown on the right on desktop */}
            {message && (
              <div className={`hidden md:block p-4 mb-6 rounded-lg ${
                messageType === 'success' ? 'bg-green bg-opacity-20 text-green-300' : 
                messageType === 'info' ? 'bg-blue-900 bg-opacity-30 text-blue-300' :
                'bg-red-900 bg-opacity-30 text-red-300'
              }`}>
                {message}
              </div>
            )}
            
            {/* Active View Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
