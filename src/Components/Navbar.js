import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { 
  faMoon, faSun, faFileArrowDown, 
  faHouse, faBriefcase, faToolbox, faFolderOpen, faAward, faEnvelope,
  faTimes, faBars
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react'; 
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ data }) => {
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const tooltipTimeout = useRef(null);
  
  const showTooltip = (index) => {
    clearTimeout(tooltipTimeout.current);
    setActiveTooltip(index);
  };
  
  const hideTooltip = () => {
    tooltipTimeout.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 200);
  };

  const githubUrl = data?.social?.find(s => s.name.toLowerCase() === 'github')?.url;
  const linkedinUrl = data?.social?.find(s => s.name.toLowerCase() === 'linkedin')?.url;
  // Force English version with simplified language parameter
  const buyMeACoffeeUrl = "https://buymeacoffee.com/stanleyluong?l=en";

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const navItems = [
    { name: 'Home', path: '/', icon: faHouse },
    { name: 'Experience', path: '/experience', icon: faBriefcase },
    { name: 'Skills', path: '/skills', icon: faToolbox },
    { name: 'Projects', path: '/projects', icon: faFolderOpen },
    { name: 'Certificates', path: '/certificates', icon: faAward },
    { name: 'Contact', path: '/contact', icon: faEnvelope },
  ];
  
  // Check if current path matches nav item
  const isActive = (path) => {
    return location.pathname === path;
  };
  const resumeUrl = data?.resumedownload;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 z-50 ${
        dark ? 'bg-darkBlue' : 'bg-darkGreen'
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Single group for all desktop-visible icons */}
        <div className="hidden lg:flex items-center gap-x-4">
          <Link 
            to="/" 
            className="text-3xl font-bold text-teal-700 dark:text-green hover:brightness-110 transition-all duration-300 flex-shrink-0"
          >
            &lt;SL /&gt;
          </Link>
          {/* Main Nav Icons */}
          {navItems.map((item, index) => (
            <div key={item.name} className="relative group" onMouseEnter={() => showTooltip(index)} onMouseLeave={hideTooltip}>
              <Link
                to={item.path}
                className={`flex items-center justify-center h-10 w-10 rounded text-xl transition-colors duration-300 flex-shrink-0 ${
                  isActive(item.path) 
                    ? (dark ? 'text-green' : 'text-[rgb(15_118_110)]')
                    : 'text-lightSlate hover:text-green'
                }`}
                aria-label={item.name}
              >
                <FontAwesomeIcon icon={item.icon} />
              </Link>
              {/* Tooltip */}
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                  activeTooltip === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                {item.name}
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
              </div>
            </div>
          ))}
          {/* Spacer to push subsequent items to the right, if needed, or let justify-between handle it if this group is the only one on the left */}
          {/* <div className="flex-grow"></div> */}

          {/* Right-side Icons now part of the same group */}
          {githubUrl && (
            <div className="relative group" onMouseEnter={() => setActiveTooltip('github')} onMouseLeave={hideTooltip}>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center h-10 w-10 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300 flex-shrink-0" 
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                  activeTooltip === 'github' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                GitHub
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
              </div>
            </div>
          )}
          {linkedinUrl && (
            <div className="relative group" onMouseEnter={() => setActiveTooltip('linkedin')} onMouseLeave={hideTooltip}>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center h-10 w-10 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300 flex-shrink-0" 
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                  activeTooltip === 'linkedin' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                LinkedIn
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
              </div>
            </div>
          )}
          <div className="relative group" onMouseEnter={() => setActiveTooltip('theme')} onMouseLeave={hideTooltip}>
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center justify-center p-2 rounded text-xl focus:outline-none h-10 w-10 text-lightSlate hover:text-green transition-colors duration-300 flex-shrink-0"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>
            <div 
              className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                activeTooltip === 'theme' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              {dark ? 'Light Mode' : 'Dark Mode'}
              <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
            </div>
          </div>
          {resumeUrl && (
            <div className="relative group" onMouseEnter={() => setActiveTooltip('resume')} onMouseLeave={hideTooltip}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center flex-shrink-0 h-10 w-10 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300`}
                aria-label="Download Resume"
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
              </a>
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                  activeTooltip === 'resume' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Download Resume
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
              </div>
            </div>
          )}
          {buyMeACoffeeUrl && (
            <div className="relative group" onMouseEnter={() => setActiveTooltip('coffee')} onMouseLeave={hideTooltip}>
              <a 
                href={buyMeACoffeeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                aria-label="Buy Me a Coffee"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="Buy Me A Coffee"
                  className="h-10"
                />
              </a>
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 text-xs font-mono text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 ${
                  activeTooltip === 'coffee' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Buy Me a Coffee
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 -rotate-45"></div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Logo on the left, Toggles/Hamburger on the right */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <Link 
            to="/" 
            className="text-3xl font-bold text-teal-700 dark:text-green hover:brightness-110 transition-all duration-300 flex-shrink-0"
            onClick={() => setMenuOpen(false)} // Close menu if open and logo is clicked
          >
            &lt;SL /&gt;
          </Link>
          <div className="flex items-center gap-x-2"> {/* Reduced gap for mobile toggles */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded text-xl flex items-center justify-center focus:outline-none h-10 w-10 text-lightSlate hover:text-green transition-colors duration-300"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>
            <button
              className="p-2 rounded text-xl focus:outline-none h-10 w-10 text-lightSlate hover:text-green transition-colors duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Menu (dropdown) - Shows below lg breakpoint (1024px) */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 bg-darkBlue bg-opacity-95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-5">
            <button
              className="absolute top-6 right-6 text-3xl text-lightSlate"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <ul className="flex flex-col items-center gap-y-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="font-mono text-2xl text-lightSlate hover:text-green transition-colors duration-200 flex items-center"
                    onClick={() => setMenuOpen(false)}
                    aria-label={item.name}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-3" /> 
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Social and External Links for Mobile Menu */}
            <div className="mt-8 flex flex-col items-center gap-y-6">
              {githubUrl && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-2xl text-lightSlate hover:text-green transition-colors duration-300 flex items-center"
                  aria-label="GitHub" 
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span className="ml-3 font-mono text-2xl">GitHub</span>
                </a>
              )}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-2xl text-lightSlate hover:text-green transition-colors duration-300 flex items-center"
                  aria-label="LinkedIn" 
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                  <span className="ml-3 font-mono text-2xl">LinkedIn</span>
                </a>
              )}
              {/* Download Resume BEFORE BMC in Mobile Menu */}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-lightSlate hover:text-green transition-colors duration-300 flex items-center justify-center"
                  aria-label="Download Resume"
                  title="Download Resume"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faFileArrowDown} />
                  <span className="ml-3 font-mono text-2xl">Resume</span> 
                </a>
              )}
              {buyMeACoffeeUrl && ( 
                <a 
                  href={buyMeACoffeeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform duration-300 flex items-center justify-center mt-2" // Added mt-2 for slight separation
                  aria-label="Buy me a coffee" 
                  onClick={() => setMenuOpen(false)}
                >
                  <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    alt="Buy Me A Coffee"
                    className="h-8" 
                  />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;