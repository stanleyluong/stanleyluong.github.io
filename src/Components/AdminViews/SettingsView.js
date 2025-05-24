import React from 'react';

const SettingsView = ({
  showConfigForm,
  setShowConfigForm,
  configText,
  setConfigText,
  handleUpdateFirebaseConfig,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Settings</h3>
      
      {/* Firebase Configuration Settings */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-green mb-4">Firebase Configuration</h4>
        
        <button 
          onClick={() => setShowConfigForm(!showConfigForm)}
          className="text-green underline mb-4"
        >
          {showConfigForm ? 'Hide Firebase Config Form' : 'Show Firebase Config Form'}
        </button>
        
        {showConfigForm && (
          <div className="mt-4">
            <p className="text-lightSlate mb-4">
              Enter your Firebase configuration in JSON format below:
            </p>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder={`{
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "your-messaging-id",
  "appId": "your-app-id"
}`}
              className="w-full h-48 p-2 bg-darkBlue text-lightestSlate rounded-md mb-4 font-mono text-sm"
            />
            <button
              onClick={handleUpdateFirebaseConfig}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-darkBlue bg-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Update Firebase Config
            </button>
          </div>
        )}
      </div>
      
      {/* CORS Configuration Help */}
      <div>
        <h4 className="text-lg font-medium text-green mb-4">CORS Configuration Help</h4>
        
        <p className="text-lightSlate mb-2">
          If you're experiencing CORS issues with Firebase Storage, follow these steps:
        </p>
        
        <ol className="list-decimal pl-5 space-y-1 mt-2 text-lightSlate">
          <li>Go to <a href="https://console.firebase.google.com/project/stanleyluong-1377a/storage" target="_blank" rel="noopener noreferrer" className="text-green underline">Firebase Console → Storage</a></li>
          <li>Click on the "Rules" tab</li>
          <li>Update the rules to allow public read access:</li>
          <code className="bg-darkBlue p-2 rounded mt-1 block overflow-x-auto text-xs whitespace-pre">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}`}
          </code>
          <li>Configure CORS (very important for uploads):</li>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>Create a file named <code className="bg-darkBlue p-1 rounded">cors.json</code> with this content:</li>
            <code className="bg-darkBlue p-2 rounded mt-1 block overflow-x-auto text-xs whitespace-pre">
{`[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    "responseHeader": ["Content-Type", "Content-Length", "Content-Encoding", "Content-Disposition", "Authorization", "X-Requested-With"],
    "maxAgeSeconds": 3600
  }
]`}
            </code>
            <li>If you have the Google Cloud SDK installed, run:</li>
            <code className="bg-darkBlue p-2 rounded mt-1 block overflow-x-auto text-xs">
              gcloud storage buckets update gs://stanleyluong-1377a.firebasestorage.app --cors-file=cors.json
            </code>
            <li>To verify the configuration:</li>
            <code className="bg-darkBlue p-2 rounded mt-1 block overflow-x-auto text-xs">
              gcloud storage buckets describe gs://stanleyluong-1377a.firebasestorage.app --format=json
            </code>
          </ol>
        </ol>
      </div>
    </div>
  );
};

export default SettingsView;
