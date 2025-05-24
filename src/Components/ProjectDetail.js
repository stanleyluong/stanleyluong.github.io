import { faChevronLeft, faExternalLinkAlt, faCalendarAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fadeIn } from '../utils/motion';
import useFirebaseData from '../hooks/useFirebaseData';

const ProjectDetail = () => {
  const { id } = useParams();
  const { data: firebaseData } = useFirebaseData();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // No longer need separate state for tech/other tags since we're showing all tags

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (firebaseData?.portfolio?.projects) {
      // Find the project by title (converted to slug) or by index
      const foundProject = firebaseData.portfolio.projects.find(
        p => slugify(p.title) === id || p.id === id
      );
      
      if (foundProject) {
        setProject(foundProject);
        document.title = `${foundProject.title} | Project Details`;
      }
      setLoading(false);
    }
  }, [firebaseData, id]);

  // Helper function to convert title to slug
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\\s+/g, '-')     // Replace spaces with -
      .replace(/[^\\w\\-]+/g, '') // Remove all non-word chars
      .replace(/\\-\\-+/g, '-')   // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start of text
      .replace(/-+$/, '');        // Trim - from end of text
  };

  // Get image path based on whether it's a URL or local path
  const getImagePath = (img) => {
    if (!img) return '';
    // If it's already a full URL, use it as is
    if (img.startsWith('http')) {
      return img;
    }
    // If it's a relative path, add the proper prefix
    return img.startsWith('/') ? img : `/images/portfolio/${img}`;
  };

  // Open full-size image viewer
  const openImageView = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
  };

  // Close image viewer
  const closeImageView = () => {
    setSelectedImage(null);
  };

  // Navigate between images
  const navigateImage = (direction) => {
    if (!project || !project.images) return;
    
    const imagesCount = project.images.length;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % imagesCount;
    } else {
      newIndex = (currentImageIndex - 1 + imagesCount) % imagesCount;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(project.images[newIndex]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-700 dark:border-green"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <section className="pt-28 py-16 bg-slate-100 dark:bg-darkBlue">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-teal-700 dark:text-green">Project Not Found</h2>
          <p className="mb-8 text-gray-700 dark:text-slate">Sorry, the project you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/projects" 
            className="inline-flex items-center text-teal-700 dark:text-green hover:underline"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  // Prepare the feature image
  const featureImage = project.image || (project.images && project.images[0]);
  const fullFeatureImage = featureImage && getImagePath(featureImage);

  // Extract tech tags (usually programming languages or frameworks)
  const techTags = project.tags && Array.isArray(project.tags) 
    ? project.tags.filter(tag => 
        ['react', 'javascript', 'python', 'node', 'vue', 'angular', 'typescript', 'ruby',
         'rails', 'aws', 'firebase', 'mongodb', 'sql', 'postgres', 'html', 'css', 'tailwind',
         'bootstrap', 'material-ui', 'php', 'laravel', 'express', 'django', 'flask'].includes(tag.toLowerCase()))
    : [];

  // Other non-tech tags
  const otherTags = project.tags && Array.isArray(project.tags)
    ? project.tags.filter(tag => !techTags.includes(tag))
    : [];

  return (
    <section className="pt-28 py-16 bg-slate-100 dark:bg-darkBlue">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Back to projects link */}
        <motion.div
          variants={fadeIn('right', 'tween', 0.1, 0.8)}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <Link 
            to="/projects" 
            className="inline-flex items-center text-teal-700 dark:text-green hover:underline"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          variants={fadeIn('up', 'tween', 0.2, 0.8)}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-lightestSlate">{project.title}</h1>
          
          {/* Project Meta */}
          <div className="flex flex-wrap gap-6 mb-6 text-gray-600 dark:text-slate">
            {project.date && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>{project.date}</span>
              </div>
            )}
          </div>
          
          {project.url && project.url !== '#' && !project.url.startsWith('images/') && !project.url.includes('firebasestorage') && (
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-teal-700 hover:bg-teal-800 text-white dark:bg-green dark:text-darkBlue dark:hover:bg-teal-500 px-4 py-2 rounded-md transition-colors"
            >
              Visit Project
              <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
            </a>
          )}
        </motion.div>

        {/* Project Feature Image */}
        {fullFeatureImage && (
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 0.8)}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="bg-white dark:bg-lightestBlue dark:bg-opacity-5 p-2 rounded-lg shadow-md overflow-hidden">
              <img 
                src={fullFeatureImage} 
                alt={project.title} 
                className="w-full h-auto rounded-md"
              />
            </div>
          </motion.div>
        )}

        {/* Project Description */}
        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 0.8)}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-lightestSlate">About This Project</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-slate">
              {project.description || "A showcase of the " + project.title + " project featuring modern design and functionality."}
            </p>
          </div>
        </motion.div>

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.div
            variants={fadeIn('up', 'tween', 0.5, 0.8)}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-lightestSlate">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.images.map((img, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn('up', 'tween', 0.1 + (index * 0.05), 0.5)}
                  initial="hidden"
                  animate="show"
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-lightestBlue dark:bg-opacity-5 p-2 rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => openImageView(img, index)}
                >
                  <img 
                    src={getImagePath(img)} 
                    alt={`${project.title} screenshot ${index + 1}`} 
                    className="w-full h-40 object-cover rounded-md"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tags Section */}
        {(techTags.length > 0 || otherTags.length > 0) && (
          <motion.div
            variants={fadeIn('up', 'tween', 0.6, 0.8)}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-lightestSlate flex items-center">
              <FontAwesomeIcon icon={faTags} className="mr-3 text-teal-700 dark:text-green" />
              Tags
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {/* Combine all tags */}
              {[...techTags, ...otherTags].map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded-full dark:bg-green/10 dark:text-green"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Full-size Image Viewer */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeImageView}
        >
          <button
            className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
            onClick={closeImageView}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Navigation arrows - only show if there are multiple images */}
          {project.images && project.images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <img 
            src={getImagePath(selectedImage)} 
            alt={`${project.title} full view`} 
            className="max-w-full max-h-[85vh] object-contain"
          />
          
          {/* Image counter */}
          {project.images && project.images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm">
              {currentImageIndex + 1} / {project.images.length}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default ProjectDetail;
