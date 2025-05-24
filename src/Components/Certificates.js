import { faChevronLeft, faChevronRight, faSearch, faTimes, faAward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { fadeIn } from '../utils/motion';

const Certificates = ({ data }) => {
  const [dark, setDark] = useState(false);
  
  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    
    // Listen for changes to system color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDark(e.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);
  const [ref, inView] = useInView({
    threshold: 0.01,
    triggerOnce: true
  });
  
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  
  if (!data || !data.certificates) {
    return (
      <section id="certificates" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
        <div className="flex items-center justify-center h-40 bg-slate-100 dark:bg-darkBlue w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
        </div>
      </section>
    );
  }
  if (data.certificates.length === 0) {
    return (
      <section id="certificates" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
        <div className="flex items-center justify-center h-40">
          <p className="text-lightSlate">No certificates found.</p>
        </div>
      </section>
    );
  }

  const openModal = (certificate, index) => {
    setSelectedCertificate(certificate);
    setSelectedCertificateIndex(index);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300);
  };
  
  // Navigate to the next certificate while in modal
  const goToNextCertificate = (e) => {
    e.stopPropagation(); // Prevent closing the modal
    const nextIndex = (selectedCertificateIndex + 1) % data.certificates.length;
    setSelectedCertificate(data.certificates[nextIndex]);
    setSelectedCertificateIndex(nextIndex);
  };
  
  // Navigate to the previous certificate while in modal
  const goToPrevCertificate = (e) => {
    e.stopPropagation(); // Prevent closing the modal
    const prevIndex = (selectedCertificateIndex - 1 + data.certificates.length) % data.certificates.length;
    setSelectedCertificate(data.certificates[prevIndex]);
    setSelectedCertificateIndex(prevIndex);
  };
  
  // Handle both Firebase Storage URLs and local paths
  const getImagePath = (img) => {
    // If it's already a full URL (Firebase Storage or other), use it as is
    if (img && img.startsWith('http')) {
      return img;
    }
    // If it's a relative path, use it as is
    return img;
  };

  return (
    <section id="certificates" className="relative pt-28 py-12 bg-slate-100 dark:bg-darkBlue font-sans scroll-mt-24">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-16 flex items-center"
        >
          <FontAwesomeIcon icon={faAward} className="text-teal-700 dark:text-green mr-3" />
          <span>Certificates</span>
        </motion.h2>
        <motion.div
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="px-4 md:px-12 lg:px-16 pb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.certificates.map((certificate, index) => (
              <div key={index} className="bg-white dark:bg-lightBlue dark:bg-opacity-30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-72 group w-full mx-auto">
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openModal(certificate, index)}>
                  <img 
                    src={getImagePath(certificate.image)} 
                    alt={`${certificate.school} - ${certificate.course}`}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FontAwesomeIcon icon={faSearch} className="text-white text-3xl" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold truncate text-gray-800 dark:text-lightestSlate font-sans">
                    {certificate.course}
                  </h3>
                  <p className="text-teal-700 dark:text-green text-base font-semibold">{certificate.school}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Certificate Modal */}
      {modalOpen && selectedCertificate && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300 cursor-pointer"
          onClick={closeModal}
        >
          {/* Close button - Top right */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="fixed top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm border border-white/20 hover:border-green transition-all duration-300 shadow-lg"
            aria-label="Close Modal"
            title="Close (or click anywhere to close)"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
          
          {/* Click anywhere hint */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 text-sm py-2 px-4 rounded-full border border-white/20 backdrop-blur-sm">
            Click anywhere to close
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="w-full h-full flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative flex-1 flex items-center justify-center overflow-auto">
              {/* Desktop Navigation - Side Buttons */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevCertificate(e);
                }}
                className="hidden md:flex absolute left-4 z-20 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300 items-center justify-center"
                aria-label="Previous Certificate"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
              </button>
              
              <div className="w-full h-full flex flex-col">
                {/* Certificate Image */}
                <div className="flex-1 flex items-center justify-center p-2 md:p-4">
                  <img 
                    src={getImagePath(selectedCertificate.image)} 
                    alt={`${selectedCertificate.school} - ${selectedCertificate.course}`}
                    className="max-w-full max-h-[calc(100vh-180px)] md:max-h-[70vh] object-contain"
                  />
                </div>

                {/* Certificate Info */}
                <div className="bg-white dark:bg-lightBlue p-4 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl md:text-2xl font-bold mb-1 text-black dark:text-lightestSlate truncate">
                    {selectedCertificate.course}
                  </h2>
                  <p className={`text-base md:text-lg mb-2 ${dark ? 'text-green' : 'text-teal-700'}`}>
                    {selectedCertificate.school}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-lightSlate text-sm">
                      {selectedCertificateIndex + 1} of {data.certificates.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation - Side Buttons */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextCertificate(e);
                }}
                className="hidden md:flex absolute right-4 z-20 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300 items-center justify-center"
                aria-label="Next Certificate"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation - Bottom Bar */}
            <div className="md:hidden bg-black bg-opacity-80 py-3 px-4 flex justify-between items-center w-full">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevCertificate(e);
                }}
                className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300 flex items-center justify-center"
                aria-label="Previous Certificate"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextCertificate(e);
                }}
                className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300 flex items-center justify-center"
                aria-label="Next Certificate"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Certificates;