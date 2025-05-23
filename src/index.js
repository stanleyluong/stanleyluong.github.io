import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Admin from './Components/Admin';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
);