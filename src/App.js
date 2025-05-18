import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import useFirebaseData from './hooks/useFirebaseData';
import About from './Components/About';
import Certificates from './Components/Certificates';
import Contact from './Components/Contact';
import Experience from './Components/Experience';
import Projects from './Components/Projects';
import Skills from './Components/Skills';
import Footer from './Components/Footer';
import Hero from './Components/Hero';
import Navbar from './Components/Navbar';

function App() {
  const { data: firebaseData, loading: firebaseLoading } = useFirebaseData();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseLoading) {
      if (firebaseData && (firebaseData.main || firebaseData.resume || firebaseData.portfolio)) {
        console.log('firebaseData:', firebaseData);
        setResumeData(firebaseData);
      }
      setLoading(false);
    }
  }, [firebaseData, firebaseLoading]);

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('UA-110570651-1');
    // ReactGA.pageview(window.location.pathname); // This might need adjustment depending on how HashRouter tracks page views
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkBlue">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green"></div>
      </div>
    );
  }

  // App component now just returns its content, without Router or Routes
  console.log('resumeData:', resumeData);
  console.log('resumeData.resume:', resumeData?.resume);
  console.log('resumeData.resume.certificates:', resumeData?.resume?.certificates);
  return (
    <div className="min-h-screen bg-white text-black dark:bg-darkBlue dark:text-lightestSlate">
      <Navbar data={resumeData?.main} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <Hero data={resumeData?.main} /> */}
        <About data={resumeData?.main} />
        <Experience data={resumeData?.resume} />
        <Skills data={resumeData?.resume} />
        <Projects data={resumeData?.portfolio} />
        <Certificates data={resumeData?.resume} />
        <Contact data={resumeData?.main} />
      </motion.div>
      
      <Footer data={resumeData?.main} />
    </div>
  );
}

export default App;