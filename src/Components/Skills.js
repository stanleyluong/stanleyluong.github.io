import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';

const Skills = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  console.log("Skills data received:", data);
  if (!data || !data.skills) {
    console.log("No skills data found");
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
  
  // Convert to array format for rendering
  const filteredCategories = Object.keys(organizedCategories).map(category => ({
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

  return (
    <section id="skills" className="relative py-24">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading font-mono text-3xl text-lightestSlate font-bold mb-16"
        >
          <span className="text-green">03.</span> Skills
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={fadeIn('up', 'spring', 0.2 + (categoryIndex * 0.1), 0.8)}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="bg-lightBlue bg-opacity-30 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-lightestSlate border-b border-green pb-3 mb-6">
                {category.title}
              </h3>
              
              <div className="space-y-6">
                {category.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lightestSlate">{skill.name}</span>
                      <span className="text-green text-sm">{skill.level}</span>
                    </div>
                    <div className="w-full bg-lightBlue h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green h-full rounded-full"
                        style={{ width: skill.level }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;