import { faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Certificates = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  
  if (!data || !data.certificates || data.certificates.length === 0) return null;

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
    <section id="certificates" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-16"
        >
          <span className="text-teal-700 dark:text-green">06.</span> Certifications
        </motion.h2>
        
        <motion.div
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="px-4 md:px-12 lg:px-16 pb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.certificates.map((certificate, index) => (
              <div key={index} className="bg-white dark:bg-lightBlue dark:bg-opacity-30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-72 group w-full mx-auto cursor-pointer" onClick={() => openModal(certificate, index)}>
                <div className="relative h-48 overflow-hidden">
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
                  <h3 className="text-xl font-semibold truncate text-gray-800 dark:text-lightestSlate font-sans">{certificate.course}</h3>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 transition-opacity duration-300"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-lightBlue rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Navigation arrows */}
            <button 
              onClick={goToPrevCertificate}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300"
              aria-label="Previous Certificate"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
            </button>
            
            <button 
              onClick={goToNextCertificate}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300"
              aria-label="Next Certificate"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <img 
                src={getImagePath(selectedCertificate.image)} 
                alt={`${selectedCertificate.school} - ${selectedCertificate.course}`}
                className="w-full h-auto"
              />
              
              {/* Close button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-green hover:text-darkBlue transition-all duration-300"
                aria-label="Close Modal"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-black dark:text-lightestSlate">{selectedCertificate.course}</h2>
                <p className="text-green text-xl mb-4">{selectedCertificate.school}</p>
              </div>
              <div className="text-lightSlate">
                {selectedCertificateIndex + 1} of {data.certificates.length}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Certificates;