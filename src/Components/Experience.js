import { faBriefcase, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Experience = ({ data }) => {
  // All hooks at the top
  const [sortedActiveTab, setSortedActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    // Check if scrolling is possible
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };
    
    // Initial check
    checkScroll();
    
    // Add event listener
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
    }
    
    // Auto-hide the scroll hint after 5 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
      clearTimeout(timer);
    };
  }, [data?.work?.length, inView]);

  // Early return after all hooks
  if (!data || !data.work || data.work.length === 0) {
    return null;
  }

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
    <section id="experience" className="relative pt-28 py-12 bg-slate-100 dark:bg-darkBlue font-sans scroll-mt-24">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-16 flex items-center"
        >
          <FontAwesomeIcon icon={faBriefcase} className="text-teal-700 dark:text-green mr-3" />
          <span>Experience</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          {/* Scroll controls - Only show on small screens */}
          <div className="relative md:hidden mb-2">
            {/* Left scroll button */}
            <button 
              onClick={() => scrollRef.current.scrollBy({left: -100, behavior: 'smooth'})} 
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-darkBlue p-2 rounded-full shadow-md text-teal-700 dark:text-green border border-teal-100 dark:border-green/20 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity`}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="xs" />
            </button>
            
            {/* Right scroll button */}
            <button 
              onClick={() => scrollRef.current.scrollBy({left: 100, behavior: 'smooth'})} 
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-darkBlue p-2 rounded-full shadow-md text-teal-700 dark:text-green border border-teal-100 dark:border-green/20 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity`}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </button>
            
            {/* Scroll hint */}
            <div className={`text-center text-xs text-teal-700 dark:text-green/70 font-mono transition-opacity duration-500 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
              Swipe to see more companies
            </div>
          </div>
          
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex md:flex-col overflow-x-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-green scrollbar-track-lightBlue relative md:pr-0 pr-4 pl-4 md:pl-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
            ref={scrollRef}
          >
            {/* Fade overlay for scroll cue - both sides on mobile */}
            <div className="absolute right-0 top-0 h-full w-10 pointer-events-none bg-gradient-to-l from-white dark:from-darkBlue to-transparent z-10 md:hidden" />
            <div className="absolute left-0 top-0 h-full w-10 pointer-events-none bg-gradient-to-r from-white dark:from-darkBlue to-transparent z-10 md:hidden" />
            
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
          
          {/* Removed right arrow cue */}
          
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