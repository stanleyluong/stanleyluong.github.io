import React from 'react';

const SkillsView = ({
  skills,
  skillsLoading,
  editingSkill,
  setEditingSkill,
  showCreateForm,
  setShowCreateForm,
  newSkill,
  setNewSkill,
  saveNewSkill,
  updateSkill,
  deleteSkill,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-lightestSlate">Manage Skills</h3>
        <button
          onClick={() => {
            if (showCreateForm) {
              setShowCreateForm(false);
              setEditingSkill(null);
              setNewSkill({
                name: '',
                category: 'Frontend'
              });
            } else {
              setShowCreateForm(true);
              setEditingSkill(null);
              setNewSkill({
                name: '',
                category: 'Frontend'
              });
            }
          }}
          className="p-2 bg-green bg-opacity-20 text-green rounded-full hover:bg-opacity-30"
        >
          {showCreateForm ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Create New Skill Form */}
      {showCreateForm && (
        <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-4">Create New Skill</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="block text-lightSlate mb-2">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="e.g., JavaScript, React, Python"
                className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-lightSlate mb-2">Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Tools & DevOps">Tools & DevOps</option>
                <option value="Other Skills">Other Skills</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewSkill({
                  name: '',
                  category: 'Frontend'
                });
              }}
              className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
            >
              Cancel
            </button>
            
            <button
              onClick={saveNewSkill}
              disabled={loading}
              className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
            >
              {loading ? 'Saving...' : 'Create Skill'}
            </button>
          </div>
        </div>
      )}
      
      {/* Skills List */}
      <div>
        {/* Removed redundant Skills List heading */}
        {skillsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
            <p className="mt-2 text-lightSlate">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <p className="text-center py-8 text-lightSlate">No skills found. Create your first skill above.</p>
        ) : (
          <div className="space-y-4">
            {/* Group skills by category */}
            {['Frontend', 'Backend', 'Tools & DevOps', 'Other Skills'].map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="mb-6">
                  <h5 className="text-lg font-medium text-green mb-3 border-b border-lightBlue pb-2">{category}</h5>
                  <div className="space-y-3">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="bg-lightBlue bg-opacity-20 p-4 rounded-lg">
                        {editingSkill?.id === skill.id ? (
                          // Edit Form
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-lightSlate mb-1">Skill Name</label>
                                <input
                                  type="text"
                                  value={editingSkill.name}
                                  onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                                  className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-lightSlate mb-1">Category</label>
                                <select
                                  value={editingSkill.category}
                                  onChange={(e) => setEditingSkill({...editingSkill, category: e.target.value})}
                                  className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                                >
                                  <option value="Frontend">Frontend</option>
                                  <option value="Backend">Backend</option>
                                  <option value="Tools & DevOps">Tools & DevOps</option>
                                  <option value="Other Skills">Other Skills</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setEditingSkill(null)}
                                className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={updateSkill}
                                disabled={loading}
                                className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
                              >
                                {loading ? 'Saving...' : 'Update Skill'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Skill Display
                          <div className="flex items-center justify-between">
                            <span className="text-lightestSlate">{skill.name}</span>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingSkill(skill)}
                                className="py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteSkill(skill.id)}
                                className="py-1 px-3 text-sm bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsView;
