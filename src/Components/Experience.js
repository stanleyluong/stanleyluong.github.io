import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUniversity, FaLaptopCode } from 'react-icons/fa'; // Keep these for fallback
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Experience = ({ data }) => {
  // All hooks at the top
  const [sortedActiveTab, setSortedActiveTab] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });


  useEffect(() => {
    // Effect for any future scroll-related functionality
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
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Company List with Icons */}
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-col space-y-2"
          >
            {sortedWork.map((job, index) => {
              // Map company names to their respective icons
              const getCompanyIcon = (company) => {
                const companyLower = company.toLowerCase();
                
                // Map company names to their logo files
                const logoMap = {
                  'amazon': 'amazon_logo.jpeg',
                  'meta': 'facebook_logo.jpeg',
                  'facebook': 'facebook_logo.jpeg',
                  'nike': 'nike_logo.jpeg',
                  'crystal commerce': 'crystalcommerce_logo.jpeg',
                  'democracy live': 'democracy_live_logo.jpeg',
                  'flex fantasy': 'flexfantasy_logo.jpeg',
                  'forsla': 'forsla_logo.jpeg'
                };
                
                // Find matching logo
                const logoKey = Object.keys(logoMap).find(key => companyLower.includes(key));
                
                if (logoKey) {
                  return (
                    <img 
                      src={`/${logoMap[logoKey]}`} 
                      alt={`${company} logo`}
                      className="w-5 h-5 object-contain"
                    />
                  );
                }
                
                // Fallback for universities/colleges
                if (companyLower.includes('university') || companyLower.includes('college')) {
                  return <FaUniversity className="text-blue-600" />;
                }
                
                // Default icon
                return <FaLaptopCode className="text-teal-500" />;
              };

              return (
                <button
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`w-full flex items-center space-x-3 py-3 px-4 font-mono text-sm rounded transition-all duration-300 ${
                    sortedActiveTab === index 
                      ? 'text-teal-700 dark:text-green bg-teal-50 dark:bg-green/10 border border-teal-200 dark:border-green/20' 
                      : 'text-gray-800 dark:text-lightSlate hover:bg-gray-100 dark:hover:bg-darkBlue/50 border border-transparent hover:border-gray-200 dark:hover:border-lightBlue/30'
                  }`}
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    {getCompanyIcon(job.company)}
                  </div>
                  <span className="truncate ml-2">{job.company}</span>
                </button>
              );
            })}
          </motion.div>
          
          {/* Content */}
          
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