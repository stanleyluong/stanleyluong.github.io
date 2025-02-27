import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactGA from 'react-ga';

// Components
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About';
import Experience from './Components/Experience';
import Skills from './Components/Skills'; 
import Projects from './Components/Projects';
import Certificates from './Components/Certificates';
import Contact from './Components/Contact';
import Footer from './Components/Footer';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);
    
    // Fetch resume data
    fetch('/resumeData.json')
      .then(response => response.json())
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resume data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkBlue">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green"></div>
      </div>
    );
  }

  return (
    <div className="bg-darkBlue text-lightSlate">
      <Navbar data={resumeData?.main} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero data={resumeData?.main} />
        <About data={resumeData?.main} />
        <Experience data={resumeData?.resume} />
        <Skills data={resumeData?.resume} />
        <Projects data={resumeData?.portfolio} />
        <Certificates data={resumeData?.resume} />
        <Contact data={resumeData?.main} />
        <Footer data={resumeData?.main} />
      </motion.div>
    </div>
  );
}

export default App;