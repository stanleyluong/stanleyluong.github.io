import React from 'react';

const EducationView = ({
  education,
  educationLoading,
  editingEducation,
  setEditingEducation,
  newEducation,
  setNewEducation,
  saveNewEducation,
  updateEducation,
  deleteEducation,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Manage Education</h3>
      
      {/* Create/Edit Education Form */}
      <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green mb-4">
          {editingEducation ? 'Edit Education' : 'Add New Education'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lightSlate mb-1">School / University</label>
            <input
              type="text"
              value={editingEducation ? editingEducation.school : newEducation.school}
              onChange={(e) => {
                if (editingEducation) {
                  setEditingEducation({...editingEducation, school: e.target.value});
                } else {
                  setNewEducation({...newEducation, school: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Degree / Certification</label>
            <input
              type="text"
              value={editingEducation ? editingEducation.degree : newEducation.degree}
              onChange={(e) => {
                if (editingEducation) {
                  setEditingEducation({...editingEducation, degree: e.target.value});
                } else {
                  setNewEducation({...newEducation, degree: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Graduation Year</label>
            <input
              type="text"
              value={editingEducation ? editingEducation.graduated : newEducation.graduated}
              onChange={(e) => {
                if (editingEducation) {
                  setEditingEducation({...editingEducation, graduated: e.target.value});
                } else {
                  setNewEducation({...newEducation, graduated: e.target.value});
                }
              }}
              placeholder="e.g., 2018"
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-lightSlate mb-1">Description (Optional)</label>
          <textarea
            value={editingEducation ? editingEducation.description : newEducation.description}
            onChange={(e) => {
              if (editingEducation) {
                setEditingEducation({...editingEducation, description: e.target.value});
              } else {
                setNewEducation({...newEducation, description: e.target.value});
              }
            }}
            rows={4}
            placeholder="Add any additional information about the education"
            className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          {editingEducation && (
            <button
              onClick={() => setEditingEducation(null)}
              className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={editingEducation ? updateEducation : saveNewEducation}
            disabled={loading}
            className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
          >
            {loading ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
          </button>
        </div>
      </div>
      
      {/* Education List */}
      <div>
        <h4 className="text-lg font-medium text-green mb-4">Education List</h4>
        
        {educationLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
            <p className="mt-2 text-lightSlate">Loading education...</p>
          </div>
        ) : education.length === 0 ? (
          <p className="text-center py-8 text-lightSlate">No education entries found. Add your first education entry above.</p>
        ) : (
          <div className="space-y-6">
            {education.map(edu => (
              <div key={edu.id} className="bg-lightBlue bg-opacity-20 p-4 rounded-lg">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div className="mb-2 md:mb-0">
                    <h5 className="text-lg font-medium text-lightestSlate">{edu.school}</h5>
                    <p className="text-green">{edu.degree}</p>
                    <p className="text-lightSlate text-sm">Graduated: {edu.graduated}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEducation(edu)}
                      className="py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="py-1 px-3 text-sm bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {edu.description && (
                  <div className="text-lightSlate">
                    <p>{edu.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationView;
