import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TypeAnimation } from 'react-type-animation';
import { fadeIn, textVariant } from '../utils/motion';

const Home = ({ data }) => {
  useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const aboutData = data?.main;
  if (!aboutData) return null;

  const typeSequence = ['Software Engineer', 250, 'Full Stack Developer', 250, 'Data Scientist', 250, 'Cloud Architect', 250];
  const profilePic = '/images/ghibli_profile_pic.png';

  return (
    <section id="hero" className="relative flex flex-col items-center justify-center bg-white text-black dark:bg-darkBlue dark:text-lightestSlate pt-24 sm:pt-28 pb-12">
      <div className="w-full max-w-4xl px-6 text-center flex flex-col items-center justify-center">
        <motion.div
          variants={textVariant(0.1)}
          initial="hidden"
          animate="show"
        >
          <h4 className="font-mono mb-2 md:text-lg text-teal-700 dark:text-green">Hi, my name is</h4>
        </motion.div>
        <motion.div
          variants={textVariant(0.2)}
          initial="hidden"
          animate="show"
        >
          <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl mb-2 text-black dark:text-lightestSlate">
            {aboutData.name}
          </h1>
        </motion.div>
        <motion.div
          variants={textVariant(0.3)}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-gray-800 dark:text-slate text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">
            <span className="whitespace-nowrap">I'm a&nbsp;</span>
            <span className="text-teal-700 dark:text-green inline-block">
              <TypeAnimation
                sequence={typeSequence}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                className="inline-block"
              />
            </span>
          </h2>
        </motion.div>
        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 1)}
          initial="hidden"
          animate="show"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-md overflow-hidden mx-auto mb-4 sm:mb-6">
            <img
              src={profilePic}
              alt={aboutData.name}
              className="absolute inset-0 w-full h-full object-contain z-0 rounded-md transition-all duration-500"
            />
          </div>
          <p className="text-slate-700 dark:text-slate max-w-2xl mx-auto mb-4 sm:mb-6 text-lg">
            {/* Combined and simplified intro */}
            Software engineer and cloud architect based in {aboutData.address?.city}, {aboutData.address?.state}. I design, build, and maintain modern software systems and digital experiences at the intersection of design and technology. Skilled across a wide range of platforms and languages, I thrive in both independent and collaborative environments, always striving for elegant, maintainable, and high-quality solutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Home; 