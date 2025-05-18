import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Experience = ({ data }) => {
  // All hooks at the top
  const [sortedActiveTab, setSortedActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    };
    checkScroll();
    const refEl = scrollRef.current;
    if (refEl) {
      refEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (refEl) refEl.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [data?.work?.length]);

  // Early return after all hooks
  if (!data || !data.work || data.work.length === 0) {
    return null;
  }

  console.log("Experience data received:", data);
  
  // Helper function to extract date score for sorting from years string
  const getDateScore = (yearsString) => {
    if (!yearsString) return 0;
    
    // Define month mapping (for parsing month names)
    const months = {
      'jan': 1, 'january': 1,
      'feb': 2, 'february': 2,
      'mar': 3, 'march': 3,
      'apr': 4, 'april': 4,
      'may': 5,
      'jun': 6, 'june': 6,
      'jul': 7, 'july': 7,
      'aug': 8, 'august': 8,
      'sep': 9, 'september': 9,
      'oct': 10, 'october': 10,
      'nov': 11, 'november': 11,
      'dec': 12, 'december': 12
    };
    
    // Get numeric representation for "Present"
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Check for various date formats
    
    // 1. Check for format like "May 2023 - Present" or "May 2023 - Dec 2023"
    const monthYearFormat = yearsString.toLowerCase().match(/([a-z]+)\s+(\d{4})/i);
    if (monthYearFormat) {
      const month = months[monthYearFormat[1].toLowerCase()] || 1;
      const year = parseInt(monthYearFormat[2], 10);
      // Create a score that puts more recent dates higher (year * 100 + month)
      return year * 100 + month;
    }
    
    // 2. Handle formats like "2019 - Present" or "2015 - 2018"
    const yearFormat = yearsString.match(/(\d{4})/g);
    if (yearFormat && yearFormat.length > 0) {
      // If there's only a year, assume January of that year
      return parseInt(yearFormat[0], 10) * 100 + 1;
    }
    
    // 3. Check if the job is current ("Present")
    if (yearsString.toLowerCase().includes('present')) {
      return currentYear * 100 + currentMonth + 1; // Add 1 to ensure "Present" is most recent
    }
    
    return 0;
  };
  
  // Sort work experiences by date (most recent first)
  const sortedWork = [...data.work].sort((a, b) => {
    // Get date scores (year*100 + month)
    const dateScoreA = getDateScore(a.years);
    const dateScoreB = getDateScore(b.years);
    
    // Sort in descending order (most recent first)
    return dateScoreB - dateScoreA;
  });
  
  const handleTabClick = (index) => {
    setSortedActiveTab(index);
  };

  return (
    <section id="experience" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-16"
        >
          <span className="text-teal-700 dark:text-green">03.</span> Where I've Worked
        </motion.h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex md:flex-col overflow-x-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-green scrollbar-track-lightBlue relative pr-10"
            style={{ WebkitOverflowScrolling: 'touch' }}
            ref={scrollRef}
          >
            {/* Fade overlay for scroll cue */}
            <div className="absolute right-0 top-0 h-full w-8 pointer-events-none bg-gradient-to-l from-white/80 dark:from-darkBlue/80 to-transparent z-10 hidden sm:block" />
            {/* Company buttons */}
            {sortedWork.map((job, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`whitespace-nowrap md:whitespace-normal py-3 px-4 font-mono text-sm text-left border-b-2 md:border-b-0 md:border-l-2 transition-all duration-300 ${
                  sortedActiveTab === index 
                    ? 'text-teal-700 dark:text-green border-teal-700 dark:border-green bg-teal-50 dark:bg-green/10' 
                    : 'text-gray-800 dark:text-lightSlate border-gray-200 dark:border-lightBlue hover:text-teal-700 dark:hover:text-green hover:border-teal-700 dark:hover:border-green'
                }`}
              >
                {job.company}
              </button>
            ))}
          </motion.div>
          
          {/* Right arrow cue for mobile, outside scroll area */}
          {showRightArrow && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 block md:hidden pointer-events-none">
              <svg className="w-6 h-6 text-green animate-bounce-x" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          )}
          
          {/* Tab Content */}
          <motion.div 
            variants={fadeIn('left', 'tween', 0.3, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="md:col-span-3"
          >
            {sortedWork.map((job, index) => (
              <div 
                key={index} 
                className={`transition-opacity duration-300 ${
                  sortedActiveTab === index ? 'opacity-100' : 'hidden'
                }`}
              >
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-lightestSlate font-sans">
                  {job.title} <span className="text-teal-700 dark:text-green">@ {job.company}</span>
                </h3>
                <p className="font-mono text-sm text-gray-600 dark:text-lightSlate mb-6">{job.years}</p>
                
                <ul className="space-y-4">
                  {typeof job.description === 'string' ? (
                    // If it's a string, split by newlines or bullet points
                    job.description.split(/\n|•/).filter(item => item.trim()).map((desc, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-teal-700 dark:text-green mr-2">▹</span>
                        <span>{desc.trim().startsWith('•') ? desc.trim().substring(1).trim() : desc.trim()}</span>
                      </li>
                    ))
                  ) : Array.isArray(job.description) ? (
                    // If it's an array, map each item
                    job.description.map((desc, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-teal-700 dark:text-green mr-2">▹</span>
                        <span>{typeof desc === 'string' && desc.trim().startsWith('•') ? desc.trim().substring(1).trim() : desc}</span>
                      </li>
                    ))
                  ) : (
                    // Fallback for any other case
                    <li className="flex items-center">
                      <span className="text-teal-700 dark:text-green mr-2">▹</span>
                      <span>No description available</span>
                    </li>
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