import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default Firebase config - using environment variables when available
const firebaseConfig = {
  // In production, use environment variables
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_NEW_API_KEY_HERE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_NEW_AUTH_DOMAIN_HERE",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_NEW_PROJECT_ID_HERE",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_NEW_STORAGE_BUCKET_HERE",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_NEW_MESSAGING_SENDER_ID_HERE",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "YOUR_NEW_APP_ID_HERE",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "YOUR_NEW_MEASUREMENT_ID_HERE" // Optional
};

// Check for stored config in localStorage (for development purposes)
let configToUse = firebaseConfig;
try {
  const storedConfig = localStorage.getItem('firebase_config');
  if (storedConfig) {
    const parsedConfig = JSON.parse(storedConfig);
    if (parsedConfig && parsedConfig.apiKey && parsedConfig.projectId) {
      configToUse = parsedConfig;
    }
  }
} catch (e) {
  // Reset the config if there was an error
  localStorage.removeItem('firebase_config');
}

// Initialize Firebase with some safety checks first
let app;
try {
  // Check if we have the minimum required configuration
  if (!configToUse.apiKey || configToUse.apiKey === "YOUR_API_KEY" || 
      !configToUse.projectId || configToUse.projectId === "YOUR_PROJECT_ID") {
    throw new Error('Invalid Firebase configuration');
  }
  
  // Try to initialize the app
  app = initializeApp(configToUse);
} catch (error) {
  // Create a dummy app to prevent crashes
  app = { name: 'dummy-app-placeholder' };
}

// Initialize services with additional error handling
let db, storage, auth;

try {
  db = getFirestore(app);
} catch (error) {
  // Create a dummy Firestore object that will fail gracefully
  db = {
    collection: () => ({ get: () => Promise.reject(new Error('Firestore not available')) }),
    doc: () => ({ get: () => Promise.reject(new Error('Firestore not available')) })
  };
}

try {
  storage = getStorage(app);
} catch (error) {
  storage = {};
}

try {
  auth = getAuth(app);
} catch (error) {
  auth = {};
}

// Connect to emulators in development environment if needed
// Uncomment these lines to use Firebase emulators for local development
// if (window.location.hostname === 'localhost') {
//   const { connectStorageEmulator } = require('firebase/storage');
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

// Helper function to allow manually setting the config (for development)
export const setFirebaseConfig = (config) => {
  try {
    localStorage.setItem('firebase_config', JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
    alert('Failed to save Firebase config: ' + e.message);
  }
};

export { auth, db, storage };
