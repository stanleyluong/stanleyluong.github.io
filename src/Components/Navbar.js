import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-scroll';

const Navbar = ({ data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', target: 'hero' },
    { name: 'About', target: 'about' },
    { name: 'Experience', target: 'experience' },
    { name: 'Skills', target: 'skills' },
    { name: 'Projects', target: 'projects' },
    { name: 'Certificates', target: 'certificates' },
    { name: 'Contact', target: 'contact' },
  ];

  const resumeUrl = data?.resumedownload;

  return (
    <nav 
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-darkBlue bg-opacity-95 shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="text-green font-bold text-xl">
          <Link 
            to="hero" 
            spy={true} 
            smooth={true} 
            duration={500} 
            className="cursor-pointer"
          >
            <span className="font-mono">&lt;SL /&gt;</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <ul className="flex">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  activeClass="text-green"
                  to={item.target}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="nav-link cursor-pointer font-mono text-base"
                >
                  <span className="text-green mr-1">{index + 1}.</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {resumeUrl && (
            <a 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary ml-2 px-4 py-2 font-mono text-sm text-center"
            >
              Download Resume
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-green focus:outline-none"
            aria-label="Toggle Menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-darkBlue bg-opacity-95 z-40 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out flex flex-col justify-center`}
      >
        <div className="flex flex-col items-center">
          <ul className="flex flex-col items-center space-y-6 mb-8">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  activeClass="text-green"
                  to={item.target}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="nav-link text-2xl font-mono"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-green mr-2">{index + 1}.</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {resumeUrl && (
            <a 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center font-mono px-4 py-3"
            >
              Download Resume
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;