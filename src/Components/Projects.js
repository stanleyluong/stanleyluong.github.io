import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  
  if (!data || !data.projects || data.projects.length === 0) return null;

  // Get unique categories for filtering
  const categories = ['all', ...new Set(data.projects.map(project => 
    project.category.toLowerCase().split(' ')[0])
  )];
  
  // Filter projects based on activeFilter
  const filteredProjects = data.projects.filter(project => 
    activeFilter === 'all' || 
    project.category.toLowerCase().includes(activeFilter.toLowerCase())
  );
  
  // Limit initial display to 6 projects
  const displayProjects = expanded ? filteredProjects : filteredProjects.slice(0, 6);
  
  const openModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    setSelectedImage(null);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setTimeout(() => setSelectedProject(null), 300);
  };
  
  const openImageView = (imageSrc, event) => {
    event.stopPropagation();
    setSelectedImage(imageSrc);
  };
  
  const closeImageView = (event) => {
    event.stopPropagation();
    setSelectedImage(null);
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
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(category)}
              className={`py-2 px-4 rounded-full font-mono text-base transition-all duration-300 ${
                activeFilter === category 
                  ? 'bg-green text-darkBlue' 
                  : 'border border-green text-green hover:bg-green hover:bg-opacity-10'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            
            // Get the main image path
            const mainImagePath = getImagePath(projectImage);
            
            return (
              <motion.div
                key={project.title}
                variants={fadeIn('up', 'tween', 0.2 + (index * 0.1), 0.6)}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="bg-lightestBlue bg-opacity-10 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
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
                  <p className="text-slate text-lg mb-3">{project.category}</p>
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
                    <div className="relative w-full flex justify-center bg-black p-6">
                      <button
                        className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
                        onClick={closeImageView}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                      </button>
                      <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={selectedImage.startsWith('http') ? selectedImage : `/images/portfolio/${selectedImage}`}
                        alt={selectedProject.title}
                        className="w-auto h-auto max-h-[70vh] object-contain bg-black"
                      />
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
                          onClick={(e) => openImageView(img, e)}
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
                <p className="text-green mb-4">{selectedProject.category}</p>
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