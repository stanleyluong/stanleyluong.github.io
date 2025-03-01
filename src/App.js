import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactGA from 'react-ga';
import useFirebaseData from './hooks/useFirebaseData';

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
import DataSourceIndicator from './Components/DataSourceIndicator';

function App() {
  const { data: firebaseData, loading: firebaseLoading, error: firebaseError } = useFirebaseData();
  const [jsonData, setJsonData] = useState(null);
  const [jsonLoading, setJsonLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('json');

  // Fetch JSON data as fallback
  useEffect(() => {
    fetch('/resumeData.json')
      .then(response => response.json())
      .then(data => {
        setJsonData(data);
        setJsonLoading(false);
      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
        setJsonLoading(false);
      });
  }, []);

  // Determine which data to use (Firebase or JSON)
  useEffect(() => {
    // Wait for both data sources to resolve
    if (!firebaseLoading && !jsonLoading) {
      // If Firebase data is available and valid, use it
      if (firebaseData && 
          (firebaseData.main || 
           firebaseData.resume || 
           firebaseData.portfolio)) {
        console.log('Using Firebase data:', firebaseData);
        setResumeData(firebaseData);
        setDataSource('firebase');
      }
      // Otherwise fall back to JSON data
      else if (jsonData) {
        console.log('Using JSON data:', jsonData);
        setResumeData(jsonData);
        setDataSource('json');
      }
      // Data is ready (from whichever source)
      setLoading(false);
    }
  }, [firebaseData, firebaseLoading, jsonData, jsonLoading]);

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);
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
      
      {/* Debug indicator to show data source and allow toggling */}
      <DataSourceIndicator dataSource={dataSource} />
    </div>
  );
}

export default App;