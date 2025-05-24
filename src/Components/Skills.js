import { faToolbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Skills = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  if (!data || !data.skills) {
    return null;
  }
  
  // First organize by the provided category if it exists
  let organizedCategories = {};
  
  data.skills.forEach(skill => {
    // Use the category from Firebase if available
    const category = skill.category || determineCategory(skill.name);
    
    if (!organizedCategories[category]) {
      organizedCategories[category] = [];
    }
    
    organizedCategories[category].push(skill);
  });
  
  // Define the desired order of categories
  const categoryOrder = ["Frontend", "Backend", "Tools & DevOps", "Other Skills"];
  
  // Convert to array format for rendering in the specific order
  const filteredCategories = categoryOrder
    .filter(category => organizedCategories[category]) // Only include categories that have skills
    .map(category => ({
      title: category,
      skills: organizedCategories[category]
    }));
  
  // Helper function to determine category based on skill name
  function determineCategory(skillName) {
    const frontendSkills = ["JavaScript", "React", "HTML5", "CSS", "TypeScript", "Angular", "GraphQL", "Svelte"];
    const backendSkills = ["Node.js", "Python", "PHP/Hack", "SQL/MySQL", "MongoDB", "Firebase"];
    const devOpsSkills = ["Git", "Mercurial", "CI/CD", "Docker", "Vercel", "AWS", "GCP"];
    
    if (frontendSkills.includes(skillName)) return "Frontend";
    if (backendSkills.includes(skillName)) return "Backend";
    if (devOpsSkills.includes(skillName)) return "Tools & DevOps";
    
    return "Other Skills";
  }

  // Icon mapping for categories
  const categoryIcons = {
    "Frontend": "🖥️",
    "Backend": "🗄️",
    "Tools & DevOps": "⚙️",
    "Other Skills": "🌟"
  };

  return (
    <section id="skills" className="relative pt-28 py-12 bg-slate-100 dark:bg-darkBlue font-sans scroll-mt-24">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-8 flex items-center"
        >
          <FontAwesomeIcon icon={faToolbox} className="text-teal-700 dark:text-green mr-3" />
          <span>Skills</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={fadeIn('up', 'spring', 0.2 + (categoryIndex * 0.1), 0.8)}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="bg-white dark:bg-lightestBlue dark:bg-opacity-10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-lightestSlate border-b border-teal-700 dark:border-green pb-3 mb-6 flex items-center gap-2">
                <span className="text-2xl">{categoryIcons[category.title]}</span>
                {category.title}
              </h3>
              
              <div className="space-y-6">
                <ul className="space-y-2">
                  {category.skills.map((skill, index) => (
                    <li key={index} className="text-gray-800 dark:text-lightestSlate font-sans text-base">{skill.name}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;