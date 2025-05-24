import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes } from 'react-router-dom';
import Certificates from './Components/Certificates';
import Contact from './Components/Contact';
import Experience from './Components/Experience';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Projects from './Components/Projects';
import ProjectDetail from './Components/ProjectDetail';
import Skills from './Components/Skills';
import useFirebaseData from './hooks/useFirebaseData';

function App() {
  const { data: firebaseData, loading: firebaseLoading } = useFirebaseData();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseLoading) {
      if (firebaseData && (firebaseData.main || firebaseData.resume || firebaseData.portfolio)) {
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
      <div className="flex items-center justify-center h-screen bg-white dark:bg-darkBlue">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-700 dark:border-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-darkBlue dark:text-lightestSlate flex flex-col">
      <Navbar data={resumeData?.main} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        <Routes>
          <Route path="/projects" element={<Projects data={resumeData?.portfolio} />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/experience" element={<Experience data={resumeData?.resume} />} />
          <Route path="/skills" element={<Skills data={resumeData?.resume} />} />
          <Route path="/certificates" element={<Certificates data={resumeData?.resume} />} />
          <Route path="/contact" element={<Contact data={resumeData?.main} />} />
          <Route path="/" element={<Home data={resumeData} />} />
          <Route path="*" element={<Home data={resumeData} />} />
        </Routes>
      </motion.div>
      <Footer data={resumeData?.main} />
    </div>
  );
}

export default App;