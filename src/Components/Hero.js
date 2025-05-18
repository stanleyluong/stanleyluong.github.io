import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { TypeAnimation } from 'react-type-animation';
import { fadeIn, textVariant } from '../utils/motion';

const Hero = ({ data }) => {
  const typeSequence = ['Software Engineer', 250, 'Full Stack Developer', 250, 'Data Scientist', 250, 'Cloud Architect', 250];
  
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-darkBlue dark:text-lightestSlate pt-24">
      <div className="w-full max-w-4xl px-6 text-center flex flex-col items-center justify-center">
        <motion.div
          variants={textVariant(0.1)}
          initial="hidden"
          animate="show"
        >
          <h4 className="font-mono mb-5 md:text-lg text-teal-700 dark:text-green">Hi, my name is</h4>
        </motion.div>
        <motion.div
          variants={textVariant(0.2)}
          initial="hidden"
          animate="show"
        >
          <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl mb-2 text-black dark:text-lightestSlate">
            {data.name}
          </h1>
        </motion.div>
        <motion.div
          variants={textVariant(0.3)}
          initial="hidden"
          animate="show"
          className="h-16"
        >
          <h2 className="text-gray-800 dark:text-slate text-3xl sm:text-4xl lg:text-5xl mb-8">
            I'm a{' '}
            <span className="text-teal-700 dark:text-green">
              <TypeAnimation
                sequence={typeSequence}
                wrapper="span"
                speed={40}
                repeat={Infinity}
              />
            </span>
          </h2>
        </motion.div>
        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 1)}
          initial="hidden"
          animate="show"
          className="mt-2"
        >
          <p className="text-slate-700 dark:text-slate max-w-2xl mx-auto mb-12 text-lg">
            {data.bio}
          </p>
          <div className="flex justify-center space-x-6">
            {data.social && data.social.map((network, index) => {
              let icon;
              if (network.name.toLowerCase().includes('github')) icon = faGithub;
              else if (network.name.toLowerCase().includes('linkedin')) icon = faLinkedin;
              else icon = null;
              return (
                <a
                  key={index}
                  href={network.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon text-2xl hover:scale-110 transition-transform text-gray-700 dark:text-green hover:text-teal-700 dark:hover:text-green"
                  aria-label={network.name}
                >
                  {icon ? <FontAwesomeIcon icon={icon} /> : null}
                </a>
              );
            })}
            <a
              href="https://www.buymeacoffee.com/stanleyluong"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Buy Me a Coffee"
            >
              <img 
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                alt="Buy Me A Coffee" 
                className="h-8 hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </motion.div>
        <div className="flex flex-col items-center mt-8">
          <Link
            to="about"
            smooth={true}
            duration={500}
            className="cursor-pointer text-teal-700 dark:text-green animate-bounce"
          >
            <FontAwesomeIcon icon={faChevronDown} className="h-8 w-8" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;