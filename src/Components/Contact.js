import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Contact = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  if (!data) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 bg-lightBlue bg-opacity-20">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto px-6 md:px-12"
      >
        <motion.h2 
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading font-mono text-3xl text-lightestSlate font-bold mb-4"
        >
          <span className="text-green">06.</span> Get In Touch
        </motion.h2>
        
        <motion.p
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center text-lightSlate mb-12 max-w-2xl mx-auto"
        >
          I'm currently looking for new opportunities and my inbox is always open. 
          Whether you have a question, a project proposal, or just want to say hi,
          I'll do my best to get back to you!
        </motion.p>
        
        <motion.div
          variants={fadeIn('up', 'tween', 0.3, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="bg-lightestBlue bg-opacity-10 rounded-lg p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-lightestSlate font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-lightBlue bg-opacity-50 border border-lightBlue rounded focus:border-green focus:outline-none text-lightestSlate"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lightestSlate font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-lightBlue bg-opacity-50 border border-lightBlue rounded focus:border-green focus:outline-none text-lightestSlate"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="subject" className="block text-lightestSlate font-medium mb-2">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                required
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-lightBlue bg-opacity-50 border border-lightBlue rounded focus:border-green focus:outline-none text-lightestSlate"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-lightestSlate font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                required
                value={formState.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-lightBlue bg-opacity-50 border border-lightBlue rounded focus:border-green focus:outline-none text-lightestSlate resize-none"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Send Message</span>
                {isSubmitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
            </div>
            
            {submitStatus === 'success' && (
              <div className="mt-4 p-3 bg-green bg-opacity-20 border border-green rounded text-green">
                Your message has been sent successfully! I'll get back to you soon.
              </div>
            )}
          </form>
        </motion.div>
        
        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mt-12"
        >
          <p className="text-lightSlate">
            Alternatively, you can email me directly at <a href={`mailto:${data.email}`} className="text-green">{data.email}</a>
          </p>
          <div className="mt-6">
            <a
              href="https://www.buymeacoffee.com/stanleyluong"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img 
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                alt="Buy Me A Coffee" 
                className="h-12 hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;