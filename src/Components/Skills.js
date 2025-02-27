import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';

const Skills = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  if (!data || !data.skills) return null;
  
  // Group skills into categories for a more organized display
  const skillCategories = [
    {
      title: "Frontend",
      skills: data.skills.filter(skill => 
        ["JavaScript", "React", "HTML5", "CSS", "TypeScript", "Angular"].includes(skill.name)
      )
    },
    {
      title: "Backend",
      skills: data.skills.filter(skill => 
        ["Node.js", "Python", "AWS"].includes(skill.name)
      )
    },
    {
      title: "Tools & Others",
      skills: data.skills.filter(skill => 
        ["Git"].includes(skill.name)
      )
    }
  ];
  
  // Filter out any empty categories
  const filteredCategories = skillCategories.filter(category => category.skills.length > 0);
  
  // Add any uncategorized skills to the "Others" section
  const categorizedSkillNames = skillCategories.flatMap(category => 
    category.skills.map(skill => skill.name)
  );
  
  const uncategorizedSkills = data.skills.filter(
    skill => !categorizedSkillNames.includes(skill.name)
  );
  
  if (uncategorizedSkills.length > 0) {
    filteredCategories.push({
      title: "Other Skills",
      skills: uncategorizedSkills
    });
  }

  return (
    <section id="skills" className="relative py-24">
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