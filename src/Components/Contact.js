import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const Contact = ({ data }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
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
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 bg-slate-100 dark:bg-darkBlue font-sans">
      <motion.div
        ref={ref}
        className="max-w-3xl mx-auto px-6 md:px-12"
      >
        <motion.h2
          variants={fadeIn('', '', 0.1, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-heading mb-6"
        >
          <span className="text-teal-700 dark:text-green">07.</span> Get In Touch
        </motion.h2>
        <motion.p
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-10 max-w-2xl mx-auto text-lg text-gray-800 dark:text-lightestSlate font-sans"
        >
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question, a project proposal, or just want to say hi, I'll do my best to get back to you!
        </motion.p>
        <motion.form
          variants={fadeIn('up', 'tween', 0.3, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-lightBlue rounded-lg p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block font-bold mb-2 text-gray-800 dark:text-lightestSlate">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formState.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-lightBlue dark:border-slate-600 rounded focus:border-teal-700 focus:outline-none text-gray-800 dark:text-lightestSlate placeholder-gray-400 dark:placeholder-lightestSlate"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-bold mb-2 text-gray-800 dark:text-lightestSlate">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-lightBlue dark:border-slate-600 rounded focus:border-teal-700 focus:outline-none text-gray-800 dark:text-lightestSlate placeholder-gray-400 dark:placeholder-lightestSlate"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="subject" className="block font-bold mb-2 text-gray-800 dark:text-lightestSlate">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formState.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-lightBlue dark:border-slate-600 rounded focus:border-teal-700 focus:outline-none text-gray-800 dark:text-lightestSlate placeholder-gray-400 dark:placeholder-lightestSlate"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block font-bold mb-2 text-gray-800 dark:text-lightestSlate">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={formState.message}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-lightBlue dark:border-slate-600 rounded focus:border-teal-700 focus:outline-none text-gray-800 dark:text-lightestSlate placeholder-gray-400 dark:placeholder-lightestSlate resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 border-teal-700 text-teal-700 hover:bg-teal-50 dark:border-green dark:text-green dark:hover:bg-green/10"
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
            <div className="mt-4 p-3 bg-teal-100 border border-teal-700 rounded text-teal-700 dark:bg-green dark:bg-opacity-20 dark:border-green dark:text-green">
              Your message has been sent successfully! I'll get back to you soon.
            </div>
          )}
        </motion.form>
        <div className="text-center mt-10">
          <p className="text-gray-800 dark:text-lightestSlate">
            Alternatively, you can email me directly at{' '}
            <a href={`mailto:${data.email}`} className="text-teal-700 dark:text-green underline">{data.email}</a>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;