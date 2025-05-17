import { useEffect, useState } from 'react';
import { Link } from 'react-scroll';

const Navbar = ({ data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [menuOpen, setMenuOpen] = useState(false);

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
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? (dark ? 'bg-darkBlue bg-opacity-95 shadow-lg py-2' : 'bg-white shadow-lg py-2')
          : (dark ? 'bg-transparent py-4' : 'bg-transparent py-4')
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center h-16">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0 mr-8">
          <Link
            to="hero"
            spy={true}
            smooth={true}
            duration={500}
            className="font-mono text-2xl font-bold text-teal-700 dark:text-green cursor-pointer select-none"
          >
            &lt;SL /&gt;
          </Link>
        </div>

        {/* Center: Nav Links */}
        <div className="flex-1 flex justify-center">
          <ul className="hidden md:flex gap-x-8 items-center">
            {navItems.map((item, idx) => (
              <li key={item.name}>
                <Link
                  to={item.target}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={`font-mono text-base cursor-pointer transition-colors duration-200 px-2 py-1 rounded ${dark ? 'text-lightSlate hover:text-green' : 'text-gray-800 hover:text-teal-700'}`}
                  activeClass={dark ? 'text-green' : 'text-teal-700'}
                >
                  <span className={dark ? 'text-green mr-1' : 'text-teal-700 mr-1'}>{String(idx + 1).padStart(2, '0')}.</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Theme Toggle + Resume + Hamburger */}
        <div className="flex items-center gap-x-6">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded text-xl flex items-center justify-center focus:outline-none h-10 w-10"
            aria-label="Toggle dark mode"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex btn-primary px-5 py-2 font-mono text-base items-center h-10 ${dark ? '' : 'border-teal-700 text-teal-700 hover:bg-teal-50'}`}
            >
              Download Resume
            </a>
          )}
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-darkBlue bg-opacity-95 z-40 flex flex-col items-center justify-center transition-all duration-300">
          <button
            className="absolute top-6 right-6 text-3xl text-lightSlate"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          <ul className="flex flex-col items-center gap-y-8">
            {navItems.map((item, idx) => (
              <li key={item.name}>
                <Link
                  to={item.target}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="font-mono text-2xl text-lightSlate hover:text-green transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                  activeClass="text-green"
                >
                  <span className="text-green mr-2">{String(idx + 1).padStart(2, '0')}.</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center font-mono px-4 py-3 mt-8"
            >
              Download Resume
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;