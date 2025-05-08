import { faChevronLeft, faChevronRight, faExternalLinkAlt, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Projects = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverProject, setHoverProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const projectsGridRef = useRef(null);
  
  if (!data || !data.projects || data.projects.length === 0) return null;

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
  
  // Filter projects based on activeFilter
  const filteredProjects = data.projects.filter(project => 
    activeFilter === 'all' || 
    (project.tags && Array.isArray(project.tags) && project.tags.includes(activeFilter))
  );
  
  // Limit initial display to 6 projects
  const displayProjects = expanded ? filteredProjects : filteredProjects.slice(0, 6);
  
  // Scroll to projects when tag is clicked
  const handleTagClick = (tag) => {
    setActiveFilter(tag);
    
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
  
  const openModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };
  
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
    <section id="projects" className="relative py-24 bg-lightBlue bg-opacity-20">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading font-mono text-3xl text-lightestSlate font-bold mb-8"
        >
          <span className="text-green">04.</span> My Projects
        </motion.h2>
        
        {/* Filter Buttons */}
        <motion.div 
          variants={fadeIn('down', 'spring', 0.2, 0.8)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {tags.map(([tag, count], index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`py-2 px-4 rounded-full font-mono text-base transition-all duration-300 ${
                activeFilter === tag 
                  ? 'bg-green text-darkBlue' 
                  : 'border border-green text-green hover:bg-green hover:bg-opacity-10'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
            </button>
          ))}
        </motion.div>
        
        {/* Filter Indicator */}
        {activeFilter !== 'all' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-2 bg-green bg-opacity-10 border-l-4 border-green rounded text-green max-w-fit mx-auto"
          >
            <span className="font-mono">Showing projects tagged with "{activeFilter}"</span>
          </motion.div>
        )}
        
        {/* Projects Grid */}
        <div ref={projectsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            
            // Prepare the display image
            
            return (
              <motion.div
                key={project.title + '-' + index}
                variants={fadeIn('up', 'tween', 0.2 + (index * 0.1), 0.6)}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className={`bg-lightestBlue bg-opacity-10 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${activeFilter !== 'all' ? 'project-highlight' : ''}`}
              >
                <div 
                  className="relative overflow-hidden h-48"
                  onMouseEnter={() => setHoverProject(project)}
                  onMouseLeave={() => setHoverProject(null)}
                >
                  {project.images ? (
                    <div className={`w-full h-full relative ${hoverProject?.title === project.title ? 'hovered' : ''}`}>
                      {project.images.slice(0, 3).map((img, imgIndex) => (
                        <img 
                          key={imgIndex}
                          src={getImagePath(img)}
                          alt={`${project.title} screenshot ${imgIndex + 1}`}
                          className={`
                            absolute w-full h-full object-cover project-image-transition
                            stacked-image-${imgIndex}
                          `}
                        />
                      ))}
                    </div>
                  ) : (
                    <img 
                      src={fullProjectImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {/* View details button for projects with images */}
                    {(project.url.startsWith('images/') || project.url.includes('firebasestorage') || project.images) && (
                      <button 
                        onClick={() => openModal(project)}
                        className="bg-green text-darkBlue rounded-full p-3 mx-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                        aria-label="View Details"
                      >
                        <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
                      </button>
                    )}
                    
                    {/* External link button for projects with URLs */}
                    {project.url && project.url !== '#' && !project.url.startsWith('images/') && !project.url.includes('firebasestorage') && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green text-darkBlue rounded-full p-3 mx-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                        aria-label="Visit Project"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lightestSlate text-2xl font-semibold mb-2">{project.title}</h3>
                  {project.tags && Array.isArray(project.tags) ? (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 text-xs bg-green bg-opacity-20 text-green rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs text-slate">+{project.tags.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate text-lg mb-3">{project.category}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Show More Button */}
        {filteredProjects.length > 6 && (
          <motion.div 
            variants={fadeIn('up', 'tween', 0.3, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-primary"
            >
              {expanded ? 'Show Less' : 'Show More Projects'}
            </button>
          </motion.div>
        )}
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
                    <div className="relative w-full flex justify-center items-center bg-black p-6">
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
                      
                      <motion.img 
                        key={selectedImage} // Key helps remount the component on image change
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={selectedImage.startsWith('http') ? selectedImage : `/images/portfolio/${selectedImage}`}
                        alt={selectedProject.title}
                        className="w-auto h-auto max-h-[70vh] object-contain bg-black"
                      />
                      
                      {/* Image counter */}
                      {selectedProject.images && selectedProject.images.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm">
                          {currentImageIndex + 1} / {selectedProject.images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-black bg-opacity-90">
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
                          className="overflow-hidden rounded-lg aspect-video bg-black cursor-pointer shadow-lg hover:shadow-xl transition-all"
                          onClick={(e) => openImageView(img, index, e)}
                        >
                          <img 
                            src={img.startsWith('http') ? img : `/images/portfolio/${img}`}
                            alt={`${selectedProject.title} screenshot ${index + 1}`}
                            className="w-full h-full object-cover transition-all hover:scale-105"
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
                        className="px-2 py-1 text-xs bg-green bg-opacity-20 text-green rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-green">{selectedProject.category}</p>
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