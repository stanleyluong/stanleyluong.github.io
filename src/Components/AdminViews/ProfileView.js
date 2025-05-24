import React from 'react';

const ProfileView = ({
  profile,
  profileLoading,
  editingProfile,
  setEditingProfile,
  setProfile, // Added setProfile to update profile state
  uploadingImages, // Added for image upload status
  uploadProgress, // Added for image upload progress
  handleImageUpload, // Added for image upload functionality
  updateProfile,
  loading,
  // Added showMessage for potential use within the component
  showMessage, 
}) => {
  return (
    <div className="bg-lightBlue bg-opacity-30 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-lightestSlate mb-6">Profile Information</h3>
      
      {profileLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green mx-auto"></div>
          <p className="mt-2 text-lightSlate">Loading profile...</p>
        </div>
      ) : !profile ? (
        <p className="text-center py-8 text-lightSlate">No profile information found.</p>
      ) : (
        <div className="mb-8 bg-lightBlue bg-opacity-50 p-4 rounded-lg">
          {!editingProfile ? (
            // Profile display view
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-medium text-lightestSlate">{profile.name}</h4>
                  <p className="text-green">
                    {Array.isArray(profile.occupation) 
                      ? profile.occupation.join(', ') 
                      : typeof profile.occupation === 'string' 
                        ? profile.occupation 
                        : ''}
                  </p>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                >
                  Edit Profile
                </button>
              </div>
              
              {profile.image && (
                <div className="flex items-center mb-4">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-green"
                  />
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                <div>
                  <h5 className="text-lg font-medium text-green mb-1">About</h5>
                  <p className="text-lightSlate">{profile.bio}</p>
                </div>
                
                <div>
                  <h5 className="text-lg font-medium text-green mb-1">Contact Information</h5>
                  <p className="text-lightSlate mb-1"><span className="text-lightestSlate">Email:</span> {profile.email}</p>
                  {profile.phone && <p className="text-lightSlate mb-1"><span className="text-lightestSlate">Phone:</span> {profile.phone}</p>}
                  {profile.website && <p className="text-lightSlate mb-1"><span className="text-lightestSlate">Website:</span> {profile.website}</p>}
                  {profile.address && (
                    <p className="text-lightSlate">
                      <span className="text-lightestSlate">Location:</span> 
                      {profile.address.city}{profile.address.state ? `, ${profile.address.state}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Profile edit form
            <div>
              <h4 className="text-lg font-medium text-green mb-4">Edit Profile</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lightSlate mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-lightSlate mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-lightSlate mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={5}
                    className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-lightSlate mb-1">City</label>
                  <input
                    type="text"
                    value={profile.address?.city || ''}
                    onChange={(e) => setProfile({
                      ...profile, 
                      address: {...(profile.address || {}), city: e.target.value}
                    })}
                    className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-lightSlate mb-1">State</label>
                  <input
                    type="text"
                    value={profile.address?.state || ''}
                    onChange={(e) => setProfile({
                      ...profile, 
                      address: {...(profile.address || {}), state: e.target.value}
                    })}
                    className="w-full p-2 bg-darkBlue border border-lightBlue rounded"
                  />
                </div>
              </div>
              
              {/* Profile image upload button */}
              <div className="mb-6">
                <label className="block text-lightSlate mb-1">Profile Image</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="hidden"
                    id="profile-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer py-2 px-4 bg-green bg-opacity-20 text-green rounded hover:bg-opacity-30"
                  >
                    Upload Profile Image
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
                  
                  {profile.image && (
                    <div className="ml-4 flex items-center">
                      <img 
                        src={profile.image} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="ml-2 text-lightSlate text-sm">Profile image</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="py-2 px-4 border border-lightSlate text-lightSlate rounded hover:bg-lightBlue hover:bg-opacity-30"
                >
                  Cancel
                </button>
                
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="py-2 px-4 bg-green text-darkBlue rounded hover:bg-opacity-90"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
