import { useState, useEffect } from 'react';
import { setUseLocalDataOnly } from '../hooks/useFirebaseData';

const DataSourceIndicator = ({ dataSource }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocalData, setIsLocalData] = useState(false);

  useEffect(() => {
    try {
      setIsLocalData(localStorage.getItem('useLocalDataOnly') === 'true');
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
  }, []);

  const toggleLocalData = () => {
    setUseLocalDataOnly(!isLocalData);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-lightBlue bg-opacity-80 text-white p-2 rounded-full shadow-lg hover:bg-opacity-100"
        title="Data Source Info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-darkBlue bg-opacity-95 text-white p-4 rounded-lg shadow-xl w-64">
          <h3 className="text-lg font-semibold mb-2">Data Source</h3>
          <p className="mb-3 text-sm">
            Currently using: <span className="font-bold text-green">
              {dataSource === 'firebase' ? 'Firebase' : 'Local JSON'}
            </span>
          </p>
          <button
            onClick={toggleLocalData}
            className="w-full py-2 px-3 bg-green text-darkBlue rounded hover:bg-opacity-80 text-sm"
          >
            Switch to {isLocalData ? 'Firebase' : 'Local JSON'} Data
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-white hover:text-green"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DataSourceIndicator;