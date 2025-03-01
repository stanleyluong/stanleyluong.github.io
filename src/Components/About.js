import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';

const About = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  if (!data) return null;

  // Handle both Firebase and local image paths
  console.log('About component - profile image data:', data.image);
  
  const profilePic = data.image && data.image.startsWith('http') 
    ? data.image 
    : data.image && data.image.startsWith('/') 
      ? data.image 
      : '/images/' + (data.image || 'profilepic.webp');
  
  console.log('About component - using profile image path:', profilePic);
  
  return (
    <section id="about" className="relative py-24">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading font-mono text-3xl text-lightestSlate font-bold mb-16"
        >
          <span className="text-green">01.</span> About Me
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="md:col-span-2"
          >
            <p className="mb-4">
              {data.bio}
            </p>
            
            <p className="mb-4">
              I'm a versatile and innovative software engineer based in {data.address?.city}, {data.address?.state}, 
              passionate about building exceptional digital experiences that live at the 
              intersection of design and technology.
            </p>
            
            <p>
              Whether I'm working on frontend interfaces or backend systems, I apply 
              the same level of attention to detail and commitment to quality. I believe 
              that well-crafted code is not only functional and efficient but also elegant 
              and maintainable.
            </p>
            
            <div className="mt-8">
              <a
                href={data.resumedownload}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
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
              <div className="absolute inset-0 bg-green opacity-20 z-10 rounded-md"></div>
              <img 
                src={profilePic} 
                alt={data.name} 
                className="absolute inset-0 w-full h-full object-cover z-0 rounded-md filter grayscale hover:filter-none transition-all duration-500"
              />
              <div className="absolute inset-0 border-2 border-green rounded-md transform translate-x-4 translate-y-4 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;