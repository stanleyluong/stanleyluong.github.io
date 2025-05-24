import React from 'react';

const CertificatesView = ({
  certificates,
  certificatesLoading,
  editingCertificate,
  setEditingCertificate,
  newCertificate,
  setNewCertificate,
  uploadingImages,
  uploadProgress,
  handleImageUpload,
  saveNewCertificate,
  updateCertificate,
  deleteCertificate,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Manage Certificates</h3>
      
      {/* Create/Edit Certificate Form */}
      <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green mb-4">
          {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lightSlate mb-1">School / Institution</label>
            <input
              type="text"
              value={editingCertificate ? editingCertificate.school : newCertificate.school}
              onChange={(e) => {
                if (editingCertificate) {
                  setEditingCertificate({...editingCertificate, school: e.target.value});
                } else {
                  setNewCertificate({...newCertificate, school: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Course / Certificate Name</label>
            <input
              type="text"
              value={editingCertificate ? editingCertificate.course : newCertificate.course}
              onChange={(e) => {
                if (editingCertificate) {
                  setEditingCertificate({...editingCertificate, course: e.target.value});
                } else {
                  setNewCertificate({...newCertificate, course: e.target.value});
                }
              }}
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
          
          <div>
            <label className="block text-lightSlate mb-1">Date (Optional)</label>
            <input
              type="text"
              value={editingCertificate ? editingCertificate.date || '' : newCertificate.date || ''}
              onChange={(e) => {
                if (editingCertificate) {
                  setEditingCertificate({...editingCertificate, date: e.target.value});
                } else {
                  setNewCertificate({...newCertificate, date: e.target.value});
                }
              }}
              placeholder="e.g., 2023 or May 2023"
              className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
            />
          </div>
        </div>
        
        {/* Certificate Image Upload */}
        <div className="mb-4">
          <label className="block text-lightSlate mb-1">Certificate Image</label>
          <div className="flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'certificate')}
              className="hidden"
              id="certificate-upload"
              disabled={uploadingImages}
            />
            <label
              htmlFor="certificate-upload"
              className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
            >
              Upload Certificate Image
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
            
            {(editingCertificate?.image || newCertificate.image) && (
              <div className="ml-4 flex items-center">
                <img 
                  src={editingCertificate?.image || newCertificate.image} 
                  alt="Certificate" 
                  className="h-10 w-16 object-cover rounded"
                />
                <span className="ml-2 text-lightSlate text-sm">Image uploaded</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          {editingCertificate && (
            <button
              onClick={() => setEditingCertificate(null)}
              className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={editingCertificate ? updateCertificate : saveNewCertificate}
            disabled={loading}
            className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
          >
            {loading ? 'Saving...' : (editingCertificate ? 'Update Certificate' : 'Add Certificate')}
          </button>
        </div>
      </div>
      
      {/* Certificates List */}
      <div>
        <h4 className="text-lg font-medium text-green mb-4">Certificates List</h4>
        
        {certificatesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
            <p className="mt-2 text-lightSlate">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <p className="text-center py-8 text-lightSlate">No certificates found. Add your first certificate above.</p>
        ) : (
          <div className="space-y-4">
            {certificates.map(certificate => (
              <div key={certificate.id} className="bg-lightBlue bg-opacity-20 p-4 rounded-lg flex flex-wrap md:flex-nowrap gap-4">
                {/* Certificate Image */}
                <div className="w-32 h-20 bg-darkBlue rounded overflow-hidden flex-shrink-0">
                  {certificate.image ? (
                    <img src={certificate.image} alt={certificate.course} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lightSlate text-xs">No image</div>
                  )}
                </div>
                
                {/* Certificate Info */}
                <div className="flex-grow">
                  <h5 className="text-lg font-medium text-lightestSlate">{certificate.course}</h5>
                  <p className="text-sm text-green mb-1">{certificate.school}</p>
                  {certificate.date && (
                    <p className="text-xs text-lightSlate">{certificate.date}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={() => setEditingCertificate(certificate)}
                    className="py-1 px-3 text-sm bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCertificate(certificate.id)}
                    className="py-1 px-3 text-sm bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesView;
