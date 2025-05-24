import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const Footer = ({ data }) => {
  if (!data) return null;
  
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e) => {
    if (e) e.preventDefault(); // Prevent any default behavior if event exists
    
    // Get the main section element of the current page
    // Every page has a section element as its main content container
    const mainSection = document.querySelector('section');
    
    if (mainSection) {
      // If we found a section, scroll to it with offset to account for navbar
      mainSection.scrollIntoView({ behavior: 'smooth' });
      
      // Adjust for fixed header with a slight timeout
      setTimeout(() => {
        // Apply a negative scroll to account for the navbar height (adjust as needed)
        window.scrollBy(0, -100);
      }, 100);
    } else {
      // Fallback to basic scroll if no section is found
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <footer className="bg-slate-200 text-black dark:bg-darkBlue dark:text-lightSlate py-4">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center">
          {/* Back to Top Button */}
          <div className="mb-4">
            <button
              onClick={scrollToTop}
              className="inline-block p-2 text-teal-700 dark:text-green hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-300 cursor-pointer focus:outline-none"
              aria-label="Back to Top"
            >
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center text-slate-500 dark:text-slate text-sm"
          >
            <p className="mb-2">Designed & Built by {data.name}</p>
            <p> {currentYear} All Rights Reserved</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;