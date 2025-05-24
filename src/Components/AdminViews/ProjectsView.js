import React from 'react';

const ProjectsView = ({
  projects,
  projectsLoading,
  editingProject,
  setEditingProject,
  showCreateForm,
  setShowCreateForm,
  newProject,
  setNewProject,
  uploadingImages,
  uploadProgress,
  handleProjectImageUpload,
  saveNewProject,
  updateProject,
  deleteProject,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-lightestSlate">Manage Projects</h3>
        <button
          onClick={() => {
            if (showCreateForm) {
              setShowCreateForm(false);
              setEditingProject(null);
              setNewProject({
                title: '',
                category: '',
                url: '',
                images: []
              });
            } else {
              setShowCreateForm(true);
              setEditingProject(null);
              setNewProject({
                title: '',
                category: '',
                url: '',
                images: []
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
      
      {/* Create/Edit Project Form - Only show when creating new project */}
      {showCreateForm && (
        <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green mb-4">Create New Project</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-lightSlate mb-1">Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
              />
            </div>
            
            <div>
              <label className="block text-lightSlate mb-1">Category</label>
              <input
                type="text"
                value={newProject.category}
                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
              />
            </div>
            
            <div>
              <label className="block text-lightSlate mb-1">URL (Website or leave empty)</label>
              <input
                type="text"
                value={newProject.url}
                onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
              />
            </div>
          </div>
          
          {/* Thumbnail Upload */}
          <div className="mb-4">
            <label className="block text-lightSlate mb-1">Thumbnail Image</label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProjectImageUpload(e, true)}
                className="hidden"
                id="thumbnail-upload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
              >
                Upload Thumbnail
              </label>
              
              {newProject.thumbnail && (
                <div className="ml-4 flex items-center">
                  <img 
                    src={newProject.thumbnail} 
                    alt="Thumbnail" 
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="ml-2 text-lightSlate text-sm">Thumbnail uploaded</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Gallery Images Upload */}
          <div className="mb-4">
            <label className="block text-lightSlate mb-1">Gallery Images</label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleProjectImageUpload(e, false)}
                className="hidden"
                id="gallery-upload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="gallery-upload"
                className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
              >
                Upload Gallery Images
              </label>
              
              {uploadingImages && (
                <div className="ml-4 flex items-center">
                  <div className="w-40 h-2 bg-darkBlue rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-lightSlate text-sm">{uploadProgress}%</span>
                </div>
              )}
            </div>
            
            {/* Gallery Preview */}
            {newProject.images && newProject.images.length > 0 && (
              <div className="mt-4">
                <h5 className="text-lightSlate text-sm mb-2">Gallery Images ({newProject.images.length})</h5>
                <div className="flex flex-wrap gap-2">
                  {newProject.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img} 
                        alt={`Gallery ${index}`} 
                        className="h-16 w-16 object-cover rounded"
                      />
                      <button
                        onClick={() => {
                          const newImages = [...newProject.images];
                          newImages.splice(index, 1);
                          setNewProject({...newProject, images: newImages});
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewProject({
                  title: '',
                  category: '',
                  url: '',
                  images: []
                });
              }}
              className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
            >
              Cancel
            </button>
            
            <button
              onClick={saveNewProject}
              disabled={loading}
              className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
            >
              {loading ? 'Saving...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
      
      {/* Projects List */}
      <div>
        <h4 className="text-lg font-medium text-green mb-4">Projects List</h4>
        
        {projectsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
            <p className="mt-2 text-lightSlate">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center py-8 text-lightSlate">No projects found. Create your first project above.</p>
        ) : (
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="bg-lightBlue bg-opacity-20 p-4 rounded-lg">
                {editingProject?.id === project.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-lightSlate mb-1">Title</label>
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                          className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lightSlate mb-1">Category</label>
                        <input
                          type="text"
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                          className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lightSlate mb-1">URL (Website or leave empty)</label>
                        <input
                          type="text"
                          value={editingProject.url}
                          onChange={(e) => setEditingProject({...editingProject, url: e.target.value})}
                          className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-lightSlate mb-1">Thumbnail Image</label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProjectImageUpload(e, true)}
                          className="hidden"
                          id={`thumbnail-upload-${project.id}`}
                          disabled={uploadingImages}
                        />
                        <label
                          htmlFor={`thumbnail-upload-${project.id}`}
                          className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                        >
                          Upload Thumbnail
                        </label>
                        
                        {editingProject.thumbnail && (
                          <div className="ml-4 flex items-center">
                            <img 
                              src={editingProject.thumbnail} 
                              alt="Thumbnail" 
                              className="h-10 w-10 object-cover rounded"
                            />
                            <span className="ml-2 text-lightSlate text-sm">Thumbnail uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery Images Upload */}
                    <div>
                      <label className="block text-lightSlate mb-1">Gallery Images</label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleProjectImageUpload(e, false)}
                          className="hidden"
                          id={`gallery-upload-${project.id}`}
                          disabled={uploadingImages}
                        />
                        <label
                          htmlFor={`gallery-upload-${project.id}`}
                          className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                        >
                          Upload Gallery Images
                        </label>
                        
                        {uploadingImages && (
                          <div className="ml-4 flex items-center">
                            <div className="w-40 h-2 bg-darkBlue rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-lightSlate text-sm">{uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Gallery Preview */}
                      {editingProject.images && editingProject.images.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-lightSlate text-sm mb-2">Gallery Images ({editingProject.images.length})</h5>
                          <div className="flex flex-wrap gap-2">
                            {editingProject.images.map((img, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={img} 
                                  alt={`Gallery ${index}`} 
                                  className="h-16 w-16 object-cover rounded"
                                />
                                <button
                                  onClick={() => {
                                    const newImages = [...editingProject.images];
                                    newImages.splice(index, 1);
                                    setEditingProject({...editingProject, images: newImages});
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateProject}
                        disabled={loading}
                        className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
                      >
                        {loading ? 'Saving...' : 'Update Project'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Project Display
                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-darkBlue rounded overflow-hidden flex-shrink-0">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                      ) : project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lightSlate text-xs">No image</div>
                      )}
                    </div>
                    
                    {/* Project Info */}
                    <div className="flex-grow">
                      <h5 className="text-lg font-medium text-lightestSlate">{project.title}</h5>
                      <p className="text-sm text-green mb-2">{project.category}</p>
                      {project.url && (
                        <p className="text-xs text-lightSlate mb-1 truncate">
                          URL: {project.url.substring(0, 50)}{project.url.length > 50 ? '...' : ''}
                        </p>
                      )}
                      <p className="text-xs text-lightSlate">
                        {project.images && project.images.length > 0 ? 
                          `${project.images.length} gallery images` : 
                          'No gallery images'}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col justify-center gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
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
        )}
      </div>
    </div>
  );
};

export default ProjectsView;
