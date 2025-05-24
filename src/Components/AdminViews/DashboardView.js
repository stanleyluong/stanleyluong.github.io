import React from 'react';

const DashboardView = ({
  projects,
  certificates,
  skills,
  workExperience,
  education,
  setActiveView,
  loadAllData,
  testDatabaseWrite,
  showMessage, // Added showMessage for potential use within the component
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Dashboard</h3>
      
      {/* Admin controls */}
      <div className="mb-6 bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green">
        <h4 className="text-lg font-medium text-green mb-2">Admin Controls</h4>
        <div className="flex flex-wrap gap-3 mb-3">
          <button
            onClick={loadAllData}
            className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md"
          >
            🔄 Reload All Data
          </button>
        </div>
      </div>
      
      {/* Database connection test */}
      <div className="mb-6 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green mb-2">Database Tools</h4>
        <p className="text-lightSlate mb-3">
          If you're seeing 0 entries across all categories, there might be a database connection issue.
        </p>

        <div className="bg-yellow-800 bg-opacity-20 p-3 rounded-md mb-4 border border-yellow-500">
          <h5 className="text-yellow-400 font-medium mb-2">Troubleshooting Steps</h5>
          <ol className="list-decimal list-inside text-lightSlate space-y-1">
            <li>Click the "Test Database Connection" button below to verify Firebase connectivity</li>
            <li>Check the browser console (F12) for any error messages</li>
            <li>If connection is successful but no data appears, use "Migrate ALL Data from JSON"</li>
            <li>If you navigate back and forth and data disappears, click "Reload All Data" at the top</li>
            <li>If problems persist, try clearing your browser's cache and cookies</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          <button
            onClick={testDatabaseWrite}
            className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md"
          >
            🔄 Test Database Connection
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-2">Projects</h4>
          <p className="text-lightSlate">{projects.length} projects in database</p>
          <button
            onClick={() => setActiveView('projects')}
            className="mt-4 py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
          >
            Manage Projects
          </button>
        </div>
        
        <div className="bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-2">Certificates</h4>
          <p className="text-lightSlate">{certificates.length} certificates in database</p>
          <button
            onClick={() => setActiveView('certificates')}
            className="mt-4 py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
          >
            Manage Certificates
          </button>
        </div>
        
        <div className="bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-2">Skills</h4>
          <p className="text-lightSlate">{skills.length} skills in database</p>
          <button
            onClick={() => setActiveView('skills')}
            className="mt-4 py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
          >
            Manage Skills
          </button>
        </div>
        
        <div className="bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-2">Work Experience</h4>
          <p className="text-lightSlate">{workExperience.length} work entries in database</p>
          <button
            onClick={() => setActiveView('work')}
            className="mt-4 py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
          >
            Manage Work Experience
          </button>
        </div>
        
        <div className="bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-2">Education</h4>
          <p className="text-lightSlate">{education.length} education entries in database</p>
          <button
            onClick={() => setActiveView('education')}
            className="mt-4 py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
          >
            Manage Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
