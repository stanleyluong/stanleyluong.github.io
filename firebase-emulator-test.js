// This script demonstrates using Firebase Storage with emulators
// to avoid CORS issues during development

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, connectStorageEmulator } = require('firebase/storage');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXKEaLS8MVjh4MBDz9_gJqw0kkRw3Jkrw",
  authDomain: "stanleyluong-1377a.firebaseapp.com",
  projectId: "stanleyluong-1377a",
  storageBucket: "stanleyluong-1377a.appspot.com",
  messagingSenderId: "1023271405835",
  appId: "1:1023271405835:web:55acd3450273f52f29fa0e",
  measurementId: "G-22CJHFDFZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Connect to the emulator when in development
// This assumes you're running the Firebase emulator suite
// To start emulators: firebase emulators:start
if (process.env.NODE_ENV === 'development') {
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('Connected to Firebase Storage emulator');
}

// Test function to upload an image
async function testImageUpload() {
  try {
    // Create a test blob
    const blob = new Blob(['test image data'], { type: 'text/plain' });
    
    // Reference to the storage location
    const storageRef = ref(storage, 'test/test-file.txt');
    
    // Upload the blob
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('Upload successful');
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error during upload test:', error);
    throw error;
  }
}

// Run the test
testImageUpload()
  .then(url => {
    console.log('Test completed successfully:', url);
  })
  .catch(error => {
    console.error('Test failed:', error);
  });
