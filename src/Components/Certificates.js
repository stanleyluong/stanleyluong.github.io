import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Certificates = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  if (!data || !data.certificates || data.certificates.length === 0) return null;

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300);
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
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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

  return (
    <section id="certificates" className="relative py-24">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12"
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
          className="px-8"
        >
          <Slider {...settings}>
            {data.certificates.map((certificate, index) => (
              <div key={index} className="px-2">
                <div 
                  className="bg-lightBlue bg-opacity-30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-72 group"
                  onClick={() => openModal(certificate)}
                >
                  <div className="relative h-56 overflow-hidden cursor-pointer">
                    <img 
                      src={certificate.image} 
                      alt={`${certificate.school} - ${certificate.course}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FontAwesomeIcon icon={faSearch} className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lightestSlate text-lg font-semibold truncate">
                      {certificate.course}
                    </h3>
                    <p className="text-green text-sm">{certificate.school}</p>
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
            className="bg-lightBlue rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedCertificate.image} 
                alt={`${selectedCertificate.school} - ${selectedCertificate.course}`}
                className="w-full h-auto"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-lightestSlate mb-2">{selectedCertificate.course}</h2>
              <p className="text-green text-lg mb-4">{selectedCertificate.school}</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Certificates;