import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Footer = ({ data }) => {
  if (!data || !data.social) return null;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-200 text-black dark:bg-darkBlue dark:text-lightSlate py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center">
          {/* Social Links */}
          <ul className="flex space-x-6 mb-8">
            {data.social.map((network, index) => {
              let icon;
              if (network.name.toLowerCase().includes('github')) icon = faGithub;
              else if (network.name.toLowerCase().includes('linkedin')) icon = faLinkedin;
              else icon = null;
              return (
                <li key={index}>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon text-2xl hover:scale-110 transition-transform text-gray-800 dark:text-green hover:text-teal-700 dark:hover:text-green"
                    aria-label={network.name}
                  >
                    {icon ? <FontAwesomeIcon icon={icon} /> : null}
                  </a>
                </li>
              );
            })}
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
              className="inline-block bg-lightBlue bg-opacity-30 p-3 rounded-full text-teal-700 dark:text-green hover:text-white hover:bg-lightBlue transition-all duration-300 cursor-pointer"
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
            className="text-center text-slate-500 dark:text-slate text-sm"
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