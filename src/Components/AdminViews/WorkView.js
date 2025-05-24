import React from 'react';

const WorkView = ({
  workExperience,
  workLoading,
  editingWork,
  setEditingWork,
  newWork,
  setNewWork,
  saveNewWork,
  updateWork,
  deleteWork,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Manage Work Experience</h3>
      
      {/* Create/Edit Work Form */}
      <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green mb-4">
          {editingWork ? 'Edit Work Experience' : 'Add New Work Experience'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lightSlate mb-1">Company Name</label>
            <input
              type="text"
              value={editingWork ? editingWork.company : newWork.company}
              onChange={(e) => {
                if (editingWork) {
                  setEditingWork({...editingWork, company: e.target.value});
                } else {
                  setNewWork({...newWork, company: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Job Title</label>
            <input
              type="text"
              value={editingWork ? editingWork.title : newWork.title}
              onChange={(e) => {
                if (editingWork) {
                  setEditingWork({...editingWork, title: e.target.value});
                } else {
                  setNewWork({...newWork, title: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Years</label>
            <input
              type="text"
              value={editingWork ? editingWork.years : newWork.years}
              onChange={(e) => {
                if (editingWork) {
                  setEditingWork({...editingWork, years: e.target.value});
                } else {
                  setNewWork({...newWork, years: e.target.value});
                }
              }}
              placeholder="e.g., 2019 - Present"
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-lightSlate mb-1">Description (use bullet points with •)</label>
          <textarea
            value={editingWork ? editingWork.description : newWork.description}
            onChange={(e) => {
              if (editingWork) {
                setEditingWork({...editingWork, description: e.target.value});
              } else {
                setNewWork({...newWork, description: e.target.value});
              }
            }}
            rows={6}
            placeholder="• Developed responsive web applications using React&#10;• Implemented user authentication with Firebase&#10;• Optimized site performance by 40%"
            className="w-full p-2 bg-darkBlue border border-lightBlue rounded font-mono text-sm"
          />
          <p className="text-xs text-lightSlate mt-1">Each bullet point should start with • and be on a new line</p>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          {editingWork && (
            <button
              onClick={() => setEditingWork(null)}
              className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={editingWork ? updateWork : saveNewWork}
            disabled={loading}
            className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
          >
            {loading ? 'Saving...' : (editingWork ? 'Update Work Experience' : 'Add Work Experience')}
          </button>
        </div>
      </div>
      
      {/* Work Experience List */}
      <div>
        <h4 className="text-lg font-medium text-green mb-4">Work Experience List</h4>
        
        {workLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
            <p className="mt-2 text-lightSlate">Loading work experience...</p>
          </div>
        ) : workExperience.length === 0 ? (
          <p className="text-center py-8 text-lightSlate">No work experience found. Add your first work experience above.</p>
        ) : (
          <div className="space-y-6">
            {workExperience.map(work => (
              <div key={work.id} className="bg-lightBlue bg-opacity-20 p-4 rounded-lg">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div className="mb-2 md:mb-0">
                    <h5 className="text-lg font-medium text-lightestSlate">{work.title}</h5>
                    <p className="text-green">{work.company}</p>
                    <p className="text-lightSlate text-sm">{work.years}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingWork(work)}
                      className="py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWork(work.id)}
                      className="py-1 px-3 text-sm bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="text-lightSlate">
                  {work.description && typeof work.description === 'string' 
                    ? work.description.split('\n').map((item, i) => (
                        <p key={i} className="mb-1">{item}</p>
                      ))
                    : Array.isArray(work.description)
                      ? work.description.map((item, i) => (
                          <p key={i} className="mb-1">{item}</p>
                        ))
                      : <p className="mb-1">No description available</p>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkView;
