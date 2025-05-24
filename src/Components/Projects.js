import { faChevronLeft, faChevronRight, faExternalLinkAlt, faFolderOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'; // Removed
import { fadeIn } from '../utils/motion';

const Projects = ({ data }) => {
  // Use a simple ref for the container
  const gridRef = useRef(null);
  
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState(['all']); // Now an array for multiple selection
  const [filtersVisible, setFiltersVisible] = useState(false); // Track if filters are visible
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const projectsGridRef = useRef(null);
  
  if (!data || !data.projects || data.projects.length === 0) return null;
  
  // Helper function to convert title to slug for URLs
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')       // Trim - from start of text
      .replace(/-+$/, '');
  };
  
  // Navigate to project detail page
  const goToProjectDetail = (project, event) => {
    // Don't navigate if the click was on a button or link within the row
    if (event.target.closest('button') || event.target.closest('a')) {
      return;
    }
    
    // Generate project URL - use ID if available, otherwise slug from title
    const projectId = project.id || slugify(project.title);
    navigate(`/project/${projectId}`);
  };

  // Get unique tags and count their occurrences
  const tagCounts = new Map();
  tagCounts.set('all', data.projects.length); // All projects count
  
  // Count occurrences of each tag
  data.projects.forEach(project => {
    if (project.tags && Array.isArray(project.tags)) {
      project.tags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
    }
  });
  
  // Convert Map to Array and sort by frequency (descending)
  // Keep 'all' at the beginning regardless of count
  const tags = Array.from(tagCounts.entries())
    .sort((a, b) => {
      // Always keep 'all' first
      if (a[0] === 'all') return -1;
      if (b[0] === 'all') return 1;
      // Sort others by count (descending)
      return b[1] - a[1];
    });
  
  // Filter projects based on activeFilters (multiple selection)
  const filteredProjects = data.projects.filter(project => {
    // If 'all' is selected, show everything
    if (activeFilters.includes('all')) return true;
    
    // Only show projects that have ALL selected tags (AND logic)
    return project.tags && Array.isArray(project.tags) && 
      activeFilters.every(filterTag => project.tags.includes(filterTag));
  });
  
  // All filtered projects are displayed
  const displayProjects = filteredProjects;
  
  // Toggle tag selection when clicked
  const handleTagClick = (tag) => {
    // Special handling for 'all' tag
    if (tag === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        // Remove 'all' if it's in the selection
        const withoutAll = prev.filter(t => t !== 'all');
        
        // If tag is already selected, remove it
        if (withoutAll.includes(tag)) {
          const result = withoutAll.filter(t => t !== tag);
          // If we removed the last tag, go back to 'all'
          return result.length === 0 ? ['all'] : result;
        } 
        // Otherwise add the tag
        else {
          return [...withoutAll, tag];
        }
      });
    }
    
    // Small delay to ensure state updates before scrolling
    setTimeout(() => {
      if (projectsGridRef.current) {
        // Scroll to significantly above the element to account for fixed header and filter indicator
        window.scrollTo({
          top: projectsGridRef.current.getBoundingClientRect().top + window.pageYOffset - 180,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  // These functions are for the modal that's still in the component
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(0);
    setTimeout(() => setSelectedProject(null), 300);
  };
  
  const openImageView = (imageSrc, index, event) => {
    event.stopPropagation();
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
  };
  
  const closeImageView = (event) => {
    event.stopPropagation();
    setSelectedImage(null);
  };
  
  const navigateImage = (direction, event) => {
    if (!selectedProject || !selectedProject.images) return;
    event.stopPropagation();
    
    const imagesCount = selectedProject.images.length;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % imagesCount;
    } else {
      newIndex = (currentImageIndex - 1 + imagesCount) % imagesCount;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(selectedProject.images[newIndex]);
  };

  return (
    <section id="projects" className="relative pt-28 py-12 bg-slate-100 dark:bg-darkBlue font-sans scroll-mt-24">
      <motion.div
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate="show"
          className="section-heading mb-8 flex items-center"
        >
          <FontAwesomeIcon icon={faFolderOpen} className="text-teal-700 dark:text-green mr-3" />
          <span>Projects</span>
        </motion.h2>
        
        {/* Filter Tags UI */}
        <motion.div 
          variants={fadeIn('down', 'spring', 0.2, 0.8)}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          {/* Filter toggle button */}
          <div className="text-center mb-4">
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="inline-flex items-center px-4 py-2 bg-teal-700 dark:bg-green text-white dark:text-darkBlue rounded-md shadow-sm hover:bg-teal-800 dark:hover:bg-teal-600 focus:outline-none transition-colors duration-300"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {filtersVisible ? 'Hide Filters' : 'Filter Projects'}
              {!activeFilters.includes('all') && (
                <span className="ml-2 bg-white dark:bg-darkBlue text-teal-700 dark:text-green text-xs rounded-full px-1.5 py-0.5">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Filter checkboxes - hidden by default */}
          {filtersVisible && (
            <div className="max-w-3xl mx-auto px-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-darkBlue/30 shadow-sm">
              {/* All checkbox always at the top */}
              <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes('all')}
                    onChange={() => handleTagClick('all')}
                    className="h-4 w-4 text-teal-700 dark:text-green rounded focus:ring-teal-500 dark:focus:ring-green"
                  />
                  <span className="font-mono text-sm font-medium text-gray-800 dark:text-slate">
                    All Projects ({tags.find(tag => tag[0] === 'all')[1]})
                  </span>
                </label>
              </div>
              
              {/* Grid of checkboxes for most popular tags */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-left mb-2">
                {tags.slice(1, 13).map(([tag, count]) => (
                  <label key={tag} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 dark:hover:bg-lightestBlue/10 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(tag)}
                      onChange={() => handleTagClick(tag)}
                      className="h-4 w-4 text-teal-700 dark:text-green rounded focus:ring-teal-500 dark:focus:ring-green"
                    />
                    <span className="font-mono text-sm text-gray-800 dark:text-slate">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
                    </span>
                  </label>
                ))}
              </div>
              
              {/* Show/hide more tags button */}
              {tags.length > 13 && (
                <div className="mt-2 text-center">
                  <button 
                    className="text-teal-700 dark:text-green text-sm hover:underline focus:outline-none inline-flex items-center"
                    onClick={() => {
                      const moreTagsSection = document.getElementById('more-tags-section');
                      if (moreTagsSection) {
                        const isHidden = moreTagsSection.classList.contains('hidden');
                        moreTagsSection.classList.toggle('hidden');
                        
                        // Change button text based on visibility
                        const button = document.getElementById('more-tags-button');
                        if (button) {
                          const icon = button.querySelector('svg');
                          if (isHidden) {
                            button.querySelector('span').textContent = 'Show Less';
                            if (icon) icon.style.transform = 'rotate(180deg)';
                          } else {
                            button.querySelector('span').textContent = `Show More (${tags.length - 13})`;
                            if (icon) icon.style.transform = 'rotate(0deg)';
                          }
                        }
                      }
                    }}
                    id="more-tags-button"
                  >
                    <span>Show More ({tags.length - 13})</span>
                    <svg className="ml-1 w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Additional tags section (hidden by default) */}
                  <div id="more-tags-section" className="hidden mt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-left border-t border-gray-200 dark:border-gray-700 pt-3">
                      {tags.slice(13).map(([tag, count]) => (
                        <label key={tag} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 dark:hover:bg-lightestBlue/10 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={activeFilters.includes(tag)}
                            onChange={() => handleTagClick(tag)}
                            className="h-4 w-4 text-teal-700 dark:text-green rounded focus:ring-teal-500 dark:focus:ring-green"
                          />
                          <span className="font-mono text-sm text-gray-800 dark:text-slate">
                            {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Apply/Clear buttons */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => {
                    // Clear all filters (set to just 'all')
                    setActiveFilters(['all']);
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium focus:outline-none"
                  disabled={activeFilters.length === 1 && activeFilters.includes('all')}
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => {
                    // Close the filter panel
                    setFiltersVisible(false);
                  }}
                  className="text-teal-700 dark:text-green hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium focus:outline-none"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Filter Indicator for Multiple Selection */}
        {!activeFilters.includes('all') && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-2 bg-teal-50 border-l-4 border-teal-700 rounded text-teal-700 max-w-fit mx-auto dark:bg-green/10 dark:border-green dark:text-green"
          >
            <span className="font-mono">
              Showing <span className="font-semibold">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'} tagged with: {activeFilters.map(tag => 
                <span key={tag} className="inline-block mx-1 px-1.5 py-0.5 bg-white dark:bg-darkBlue rounded text-xs">
                  {tag}
                </span>
              )}
            </span>
          </motion.div>
        )}
        
        {/* Projects Table */}
        {/* Desktop Table View (hidden on small screens) */}
        <div ref={gridRef} className="hidden md:block overflow-hidden rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-lightestBlue dark:bg-opacity-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-lightestBlue dark:bg-opacity-5 dark:divide-gray-700">
                {displayProjects.map((project, index) => {
                  // Use thumbnail if available, fallback to image
                  const projectImage = project.thumbnail || project.image;
                  const fullProjectImage = projectImage && projectImage.startsWith('http') 
                    ? projectImage 
                    : '/images/portfolio/' + projectImage;

                  // Handle both Firebase Storage URLs and local paths
                  const getImagePath = (img) => {
                    // If it's already a full URL (Firebase Storage or other), use it as is
                    if (img && img.startsWith('http')) {
                      return img;
                    }
                    // If it's a relative path, add the proper prefix
                    return img.startsWith('/') ? img : `/images/portfolio/${img}`;
                  };

                  // All project tags
                  const projectTags = project.tags && Array.isArray(project.tags) ? project.tags : [];

                  return (
                    <tr 
                      key={project.title + '-' + index + '-desktop'}
                      className={`hover:bg-gray-50 dark:hover:bg-lightestBlue dark:hover:bg-opacity-10 transition-colors ${!activeFilters.includes('all') ? 'bg-teal-50/20 dark:bg-green/5' : ''} cursor-pointer`}
                      onClick={(e) => goToProjectDetail(project, e)}
                    >
                      {/* Project Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 mr-4">
                            {project.images ? (
                              <div className="w-full h-full relative rounded-md overflow-hidden">
                                <img 
                                  src={getImagePath(project.images[0])}
                                  alt={`${project.title} screenshot`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <img 
                                src={fullProjectImage} 
                                alt={project.title} 
                                className="h-16 w-16 rounded-md object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-800 dark:text-lightestSlate">
                              {project.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tags Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {projectTags.slice(0, 3).map((tag, tagIndex) => (
                            <span 
                              key={tagIndex} 
                              className="px-1.5 py-0.5 text-xs bg-teal-50 text-teal-700 rounded-full dark:bg-green/10 dark:text-green"
                            >
                              {tag}
                            </span>
                          ))}
                          {projectTags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-slate">+{projectTags.length - 3}</span>
                          )}
                          {!projectTags.length && (
                            <span className="text-xs text-gray-500 dark:text-slate">-</span>
                          )}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end">
                          {project.url && project.url !== '#' && !project.url.startsWith('images/') && !project.url.includes('firebasestorage') && (
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:text-teal-500 dark:text-green dark:hover:text-teal-300 transition-colors"
                              aria-label="Visit Project"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5" />
                            </a>
                          )}
                          {(!project.url || project.url === '#' || project.url.startsWith('images/') || project.url.includes('firebasestorage')) && (
                            <span className="text-gray-400 dark:text-gray-600">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Mobile Card View (shown only on small screens) */}
        <div className="md:hidden px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayProjects.map((project, index) => {
              // Use thumbnail if available, fallback to image
              const projectImage = project.thumbnail || project.image;
              const fullProjectImage = projectImage && projectImage.startsWith('http') 
                ? projectImage 
                : '/images/portfolio/' + projectImage;

              // Handle both Firebase Storage URLs and local paths
              const getImagePath = (img) => {
                if (img && img.startsWith('http')) return img;
                return img.startsWith('/') ? img : `/images/portfolio/${img}`;
              };

              return (
                <div 
                  key={project.title + '-' + index + '-mobile'}
                  className={`bg-white dark:bg-lightestBlue dark:bg-opacity-10 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-72 group w-full mx-auto ${!activeFilters.includes('all') ? 'border-l-4 border-teal-700 dark:border-green' : ''}`}
                  onClick={(e) => goToProjectDetail(project, e)}
                >
                  {/* Project Image - Large, at the top */}
                  <div className="relative h-48 overflow-hidden cursor-pointer">
                    {project.images ? (
                      <img 
                        src={getImagePath(project.images[0])}
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <img 
                        src={fullProjectImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">View Details</span>
                    </div>
                  </div>
                  
                  {/* Project Info - Below the image */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate text-gray-800 dark:text-lightestSlate font-sans">{project.title}</h3>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-teal-700 dark:text-green text-base font-medium">
                        {project.category || project.type || 'Project'}
                      </p>
                      
                      {project.url && project.url !== '#' && !project.url.startsWith('images/') && !project.url.includes('firebasestorage') && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-500 dark:text-green dark:hover:text-teal-300 transition-colors text-sm inline-flex items-center"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Visit Project"
                        >
                          <span className="mr-1">Visit</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
      
      {/* Project Modal */}
      <AnimatePresence>
        {modalOpen && selectedProject && (
          <motion.div 
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 transition-opacity duration-300"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-lightBlue rounded-lg overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <button 
                  className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
                  onClick={closeModal}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
              </div>

              {/* Handle image path for both local and Firebase Storage URLs */}
              {selectedProject.images ? (
                <div>
                  {selectedImage ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                      <button
                        className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
                        onClick={closeImageView}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                      </button>
                      {/* Navigation arrows - only show if there are multiple images */}
                      {selectedProject.images && selectedProject.images.length > 1 && (
                        <>
                          <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all z-20"
                            onClick={(e) => navigateImage('prev', e)}
                            aria-label="Previous image"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
                          </button>
                          <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all z-20"
                            onClick={(e) => navigateImage('next', e)}
                            aria-label="Next image"
                          >
                            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {/* <TransformWrapper
                        doubleClick={{ mode: 'zoomIn' }}
                        pinch={{ disabled: false }}
                        wheel={{ step: 0.2 }}
                        panning={{ velocityDisabled: true }}
                      >
                        <TransformComponent> */}
                          <img
                            key={selectedImage}
                            src={selectedImage.startsWith('http') ? selectedImage : `/images/portfolio/${selectedImage}`}
                            alt={selectedProject.title}
                            className="w-full h-full object-contain"
                            style={{ maxHeight: '100vh', maxWidth: '100vw' }}
                          />
                        {/* </TransformComponent>
                      </TransformWrapper> */}
                      {/* Image counter */}
                      {selectedProject.images && selectedProject.images.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm">
                          {currentImageIndex + 1} / {selectedProject.images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-row flex-wrap md:flex-nowrap gap-2 p-6 bg-black bg-opacity-90 md:overflow-x-auto">
                      {selectedProject.images.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 260,
                              damping: 20
                            }
                          }}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          className="overflow-hidden rounded-lg bg-black cursor-pointer shadow-lg hover:shadow-xl transition-all flex-shrink-0 flex items-center justify-center w-20 h-24 md:w-24 md:h-32"
                          onClick={(e) => openImageView(img, index, e)}
                        >
                          <img
                            src={img.startsWith('http') ? img : `/images/portfolio/${img}`}
                            alt={`${selectedProject.title} screenshot ${index + 1}`}
                            className="object-contain w-full h-full"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <img 
                  src={selectedProject.url.startsWith('http') 
                    ? selectedProject.url 
                    : `/images/portfolio/${selectedProject.url.split('/').pop()}`} 
                  alt={selectedProject.title} 
                  className="w-full h-auto max-h-[50vh] object-contain bg-black"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-lightestSlate mb-2">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.tags && Array.isArray(selectedProject.tags) ? (
                    selectedProject.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-full dark:bg-green/10 dark:text-green"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-teal-700 dark:text-green">{selectedProject.category}</p>
                  )}
                </div>
                <p className="text-lightSlate mb-6">
                  A showcase of the {selectedProject.title} project featuring modern design and functionality.
                </p>
                {selectedProject.url && selectedProject.url !== '#' && !selectedProject.url.startsWith('images/') && !selectedProject.url.includes('firebasestorage') && (
                  <div className="flex justify-end">
                    <a 
                      href={selectedProject.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Visit Project
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
