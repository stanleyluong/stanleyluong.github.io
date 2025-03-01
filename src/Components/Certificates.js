import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  
  // Custom arrow components for the slider
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-lightBlue bg-opacity-50 text-green p-3 rounded-full -ml-5"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    );
  };
  
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-lightBlue bg-opacity-50 text-green p-3 rounded-full -mr-5"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    );
  };
  
  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 items for better balance
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots", // Custom class for dots
    appendDots: dots => (
      <div style={{ 
        position: "relative",
        padding: "30px 0", // Increased padding to move dots down
        zIndex: 10
      }}>
        <ul style={{ margin: "0" }}>{dots}</ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
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
    <section id="certificates" className="relative py-24">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading font-mono text-3xl text-lightestSlate font-bold mb-16"
        >
          <span className="text-green">05.</span> Certifications
        </motion.h2>
        
        <motion.div
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="px-4 md:px-12 lg:px-16 pb-10" // Added more horizontal padding
        >
          <Slider {...settings}>
            {data.certificates.map((certificate, index) => (
              <div key={index} className="px-3 pb-8"> {/* Adjusted horizontal padding */}
                <div 
                  className="bg-lightBlue bg-opacity-30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-72 group w-full mx-auto" // Slightly reduced height
                  onClick={() => openModal(certificate, index)}
                >
                  <div className="relative h-48 overflow-hidden cursor-pointer"> {/* Slightly reduced height */}
                    <img 
                      src={getImagePath(certificate.image)} 
                      alt={`${certificate.school} - ${certificate.course}`}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FontAwesomeIcon icon={faSearch} className="text-white text-3xl" /> {/* Larger icon */}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lightestSlate text-xl font-semibold truncate"> {/* Increased font size */}
                      {certificate.course}
                    </h3>
                    <p className="text-green text-base">{certificate.school}</p> {/* Increased font size */}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
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
            className="bg-lightBlue rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
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
                <h2 className="text-3xl font-bold text-lightestSlate mb-2">{selectedCertificate.course}</h2>
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