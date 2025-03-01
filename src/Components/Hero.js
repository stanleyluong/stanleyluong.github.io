import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-scroll';
import { textVariant, fadeIn } from '../utils/motion';

const Hero = ({ data }) => {
  if (!data) return null;

  // Convert occupation string to array for animation
  const occupationString = data.occupation || "[softwareEngineer]";
  const occupationArray = occupationString
    .replace(/[[\]]/g, '')
    .split(', ')
    .map(item => item.trim());

  // Create the sequence for TypeAnimation
  const typeSequence = [];
  occupationArray.forEach(occupation => {
    typeSequence.push(occupation, 1500);
  });

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-darkBlue bg-gradient-to-b from-darkBlue to-lightBlue opacity-80"></div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          variants={textVariant(0.1)}
          initial="hidden"
          animate="show"
        >
          <h4 className="font-mono text-green mb-5 md:text-lg">Hi, my name is</h4>
        </motion.div>
        
        <motion.div
          variants={textVariant(0.2)}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-lightestSlate font-bold text-5xl sm:text-6xl lg:text-7xl mb-2">
            {data.name}
          </h1>
        </motion.div>
        
        <motion.div
          variants={textVariant(0.3)}
          initial="hidden"
          animate="show"
          className="h-16"
        >
          <h2 className="text-slate text-3xl sm:text-4xl lg:text-5xl mb-8">
            I'm a{' '}
            <span className="text-green">
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
          className="mt-16"
        >
          <p className="text-slate max-w-2xl mx-auto mb-12 text-lg">
            {data.bio}
          </p>
          
          <div className="flex justify-center space-x-6">
            {data.social && data.social.map((network, index) => (
              <a 
                key={index} 
                href={network.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon text-2xl hover:scale-110 transition-transform"
                aria-label={network.name}
              >
                <i className={network.className}></i>
              </a>
            ))}
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
      </div>
      
      <motion.div
        variants={fadeIn('up', 'tween', 0.6, 1)}
        initial="hidden"
        animate="show"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer text-green animate-bounce"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-8 w-8" />
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;