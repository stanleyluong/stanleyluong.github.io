import emailjs from '@emailjs/browser';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
  const calendlyRef = useRef(null);

  useEffect(() => {
    if (calendlyRef.current) {
      // Clear any existing content
      calendlyRef.current.innerHTML = '';
      
      // Create a container for the iframe
      const container = document.createElement('div');
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.minHeight = '650px';
      container.style.borderRadius = '0.5rem';
      container.style.overflow = 'hidden';
      
      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.src = 'https://calendly.com/stanleyluong/30min';
      iframe.width = '100%';
      iframe.height = '810px';  // Increased fixed height
      iframe.frameBorder = '0';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0.5rem';
      iframe.style.overflow = 'hidden';
      iframe.allowFullscreen = true;
      iframe.allow = 'encrypted-media';
      iframe.scrolling = 'no';  // Prevent inner scrollbar
      
      container.appendChild(iframe);
      calendlyRef.current.appendChild(container);
      
      // Cleanup function
      return () => {
        if (calendlyRef.current) {
          calendlyRef.current.innerHTML = '';
        }
      };
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID_NOTIFICATION,
      e.target,
      PUBLIC_KEY
    )
    .then(() => {
      return emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID_CONFIRMATION,
        e.target,
        PUBLIC_KEY
      );
    })
    .then(() => {
      setStatus('success');
      formRef.current.reset();
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      setStatus('error');
    });
  };

  if (!data) return null;

  return (
    <section id="contact" className="relative w-full py-20 bg-gray-50 dark:bg-darkBlue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeIn('up', 'tween', 0.2, 1)}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-lightBlue rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Send a Message
              </h3>
              
              {status === 'success' && (
                <div className="mb-4 p-3 bg-teal-100 border border-teal-700 rounded text-teal-700 dark:bg-green dark:bg-opacity-20 dark:border-green dark:text-green">
                  Your message has been sent successfully! Thank you.
                </div>
              )}
              
              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-100 border border-red-700 rounded text-red-700 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-500 dark:text-red-400">
                    Something went wrong. Please try again.
                </div>
              )}
              
              {status !== 'loading' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      id="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="reply_to"
                      id="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your message"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-green dark:hover:bg-teal-600 dark:text-darkBlue"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Send Message
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-700 dark:border-green"></div>
                </div>
              )}
            </div>

            {/* Calendly Widget */}
            <div className="bg-white dark:bg-lightBlue rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Schedule a Call
              </h3>
              <div className="w-full bg-white dark:bg-lightBlue rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '800px' }}>
                <div 
                  ref={calendlyRef}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-800 dark:text-lightestSlate">
              Or email me directly at{' '}
              <a href={`mailto:${data.email}`} className="text-teal-700 dark:text-green underline">
                {data.email}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
