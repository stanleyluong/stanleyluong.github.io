import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const About = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  if (!data) return null;

  // Hardcode the profile picture to the new image
  const profilePic = '/images/ghibli_profile_pic.png';
  
  return (
    <section id="about" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading text-3xl md:text-5xl mb-16"
        >
          <span className="text-teal-700 dark:text-green">02.</span> About Me
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="md:col-span-2"
          >
            <p className="mb-4 text-gray-800 dark:text-lightestSlate font-sans">
              Software engineer with proven expertise in the design, installation, testing, and maintenance of software systems. Skilled across a wide range of platforms and languages, and experienced with modern development tools and best practices. Adept at both independent work and effective collaboration within high-performing teams.
            </p>
            
            <p className="mb-4 text-gray-800 dark:text-lightestSlate font-sans">
              I'm a versatile and innovative software engineer based in {data.address?.city}, {data.address?.state}, 
              passionate about building exceptional digital experiences that live at the 
              intersection of design and technology.
            </p>
            
            <p className="text-gray-800 dark:text-lightestSlate font-sans">
              Whether I'm working on frontend interfaces or backend systems, I apply 
              the same level of attention to detail and commitment to quality. I believe 
              that well-crafted code is not only functional and efficient but also elegant 
              and maintainable.
            </p>
            
            <div className="mt-8 flex justify-center w-full">
              <a
                href={data.resumedownload}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block text-teal-700 border-teal-700 dark:text-green dark:border-green"
              >
                Download Resume
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('left', 'tween', 0.3, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="relative mx-auto"
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-md overflow-hidden">
              <div className="absolute inset-0 z-10 rounded-md dark:bg-green dark:opacity-20"></div>
              <img 
                src={profilePic} 
                alt={data.name} 
                className="absolute inset-0 w-full h-full object-contain z-0 rounded-md dark:filter dark:grayscale dark:hover:filter-none transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;