import emailjs from '@emailjs/browser';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fadeIn } from '../utils/motion';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const TEMPLATE_ID_NOTIFICATION = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_NOTIFICATION;
const TEMPLATE_ID_CONFIRMATION = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_CONFIRMATION;

const Contact = ({ data }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const formRef = useRef();
  const [status, setStatus] = useState(null);
  if (!data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Send notification to you
    emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID_NOTIFICATION,
      formRef.current,
      PUBLIC_KEY
    ).then(() => {
      // Send confirmation to submitter
      emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID_CONFIRMATION,
        formRef.current,
        PUBLIC_KEY
      ).then(() => {
        setStatus('success');
        formRef.current.reset();
      }).catch(() => setStatus('error'));
    }).catch(() => setStatus('error'));
  };

  return (
    <section id="contact" className="relative pt-28 py-12 bg-slate-100 dark:bg-darkBlue font-sans scroll-mt-24">
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
          <FontAwesomeIcon icon={faEnvelope} className="text-teal-700 dark:text-green mr-3" />
          <span>Contact</span>
        </motion.h2>
        <motion.p
          variants={fadeIn('up', 'tween', 0.2, 1)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mb-10 max-w-4xl text-lg text-gray-800 dark:text-lightestSlate font-sans"
        >
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question, a project proposal, or just want to say hi, I'll do my best to get back to you!
        </motion.p>
        <motion.form
          ref={formRef}
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
              className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-lightBlue dark:border-slate-600 rounded focus:border-teal-700 focus:outline-none text-gray-800 dark:text-lightestSlate placeholder-gray-400 dark:placeholder-lightestSlate resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 border-teal-700 text-teal-700 hover:bg-teal-50 dark:border-green dark:text-green dark:hover:bg-green/10"
              disabled={status === 'loading'}
            >
              <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          {status === 'success' && (
            <div className="mt-4 p-3 bg-teal-100 border border-teal-700 rounded text-teal-700 dark:bg-green dark:bg-opacity-20 dark:border-green dark:text-green">
              Your message has been sent successfully! Thank you.
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 p-3 bg-red-100 border border-red-700 rounded text-red-700 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-500 dark:text-red-400">
              Something went wrong. Please try again.
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