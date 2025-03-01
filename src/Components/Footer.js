import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-scroll';

const Footer = ({ data }) => {
  if (!data || !data.social) return null;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-darkBlue py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center">
          {/* Social Links */}
          <ul className="flex space-x-6 mb-8">
            {data.social.map((network, index) => (
              <li key={index}>
                <a 
                  href={network.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon text-xl hover:scale-110 transition-transform"
                  aria-label={network.name}
                >
                  <i className={network.className}></i>
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://www.buymeacoffee.com/stanleyluong"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon hover:scale-110 transition-transform"
                aria-label="Buy Me a Coffee"
              >
                <img 
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                  alt="Buy Me A Coffee" 
                  className="h-6"
                />
              </a>
            </li>
          </ul>
          
          {/* Back to Top Button */}
          <div className="mb-8">
            <Link
              to="hero"
              smooth={true}
              duration={500}
              className="inline-block bg-lightBlue bg-opacity-30 p-3 rounded-full text-green hover:text-white hover:bg-lightBlue transition-all duration-300 cursor-pointer"
              aria-label="Back to Top"
            >
              <FontAwesomeIcon icon={faChevronUp} />
            </Link>
          </div>
          
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center text-lightSlate text-sm"
          >
            <p className="mb-2">Designed & Built by {data.name}</p>
            <p>© {currentYear} All Rights Reserved</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;