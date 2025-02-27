import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';

const Experience = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [activeTab, setActiveTab] = useState(0);
  
  if (!data || !data.work || data.work.length === 0) return null;
  
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <section id="experience" className="relative py-24 bg-lightBlue bg-opacity-20">
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
          <span className="text-green">02.</span> Where I've Worked
        </motion.h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex md:flex-col overflow-x-auto md:overflow-x-visible scrollbar-hide"
          >
            {data.work.map((job, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`whitespace-nowrap md:whitespace-normal py-3 px-4 font-mono text-sm text-left border-b-2 md:border-b-0 md:border-l-2 transition-all duration-300 ${
                  activeTab === index 
                    ? 'text-green border-green bg-green bg-opacity-5' 
                    : 'text-lightSlate border-lightBlue hover:text-green hover:border-green'
                }`}
              >
                {job.company}
              </button>
            ))}
          </motion.div>
          
          {/* Tab Content */}
          <motion.div 
            variants={fadeIn('left', 'tween', 0.3, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="md:col-span-3"
          >
            {data.work.map((job, index) => (
              <div 
                key={index} 
                className={`transition-opacity duration-300 ${
                  activeTab === index ? 'opacity-100' : 'hidden'
                }`}
              >
                <h3 className="text-2xl font-semibold text-lightestSlate">
                  {job.title} <span className="text-green">@ {job.company}</span>
                </h3>
                <p className="font-mono text-sm text-lightSlate mb-6">{job.years}</p>
                
                <ul className="space-y-4">
                  {typeof job.description === 'string' ? (
                    <li className="flex items-start">
                      <span className="text-green mr-2 mt-1.5">▹</span>
                      <span>{job.description}</span>
                    </li>
                  ) : (
                    job.description.map((desc, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green mr-2 mt-1.5">▹</span>
                        <span>{desc}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;