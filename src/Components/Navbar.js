import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { 
  faMoon, faSun, faFileArrowDown, 
  faHouse, faBriefcase, faToolbox, faFolderOpen, faAward, faEnvelope,
  faTimes, faBars
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';

const Navbar = ({ data }) => {
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const githubUrl = data?.social?.find(s => s.name.toLowerCase() === 'github')?.url;
  const linkedinUrl = data?.social?.find(s => s.name.toLowerCase() === 'linkedin')?.url;
  // Force English version with simplified language parameter
  const buyMeACoffeeUrl = "https://buymeacoffee.com/stanleyluong?l=en";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const resumeUrl = data?.resumedownload;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white dark:bg-darkBlue shadow-lg py-4' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between xl:justify-center">
        {/* Single group for all desktop-visible icons */}
        <div className="hidden xl:flex items-center gap-x-4">
          <Link 
            to="/" 
            className="text-3xl font-bold text-teal-700 dark:text-green hover:brightness-110 transition-all duration-300 flex-shrink-0"
          >
            &lt;SL /&gt;
          </Link>
          {/* Main Nav Icons */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center justify-center h-10 w-10 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300 flex-shrink-0"
              title={item.name}
              aria-label={item.name}
            >
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          ))}
          {/* Spacer to push subsequent items to the right, if needed, or let justify-between handle it if this group is the only one on the left */}
          {/* <div className="flex-grow"></div> */}

          {/* Right-side Icons now part of the same group */}
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center flex-shrink-0 h-10 px-3 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300" 
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
              <span className="ml-2 text-base">GitHub</span>
            </a>
          )}
          {linkedinUrl && (
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center flex-shrink-0 h-10 px-3 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300" 
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span className="ml-2 text-base">LinkedIn</span>
            </a>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center justify-center p-2 rounded text-xl focus:outline-none h-10 w-10 text-lightSlate hover:text-green transition-colors duration-300 flex-shrink-0"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={dark ? faSun : faMoon} />
          </button>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center flex-shrink-0 h-10 w-10 rounded text-xl text-lightSlate hover:text-green transition-colors duration-300`}
              aria-label="Download Resume"
              title="Download Resume"
            >
              <FontAwesomeIcon icon={faFileArrowDown} />
            </a>
          )}
          {buyMeACoffeeUrl && (
            <a
              href={buyMeACoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
              aria-label="Buy Me a Coffee"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                className="h-10"
              />
            </a>
          )}
        </div>

        {/* Mobile: Logo on the left, Toggles/Hamburger on the right */}
        <div className="xl:hidden flex items-center justify-between w-full">
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

        {/* Mobile Menu (dropdown) */}
        {menuOpen && (
          <div className="xl:hidden fixed inset-0 bg-darkBlue bg-opacity-95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-5">
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