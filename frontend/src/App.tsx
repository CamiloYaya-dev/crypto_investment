import React from 'react';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Crypto Investment Dashboard</h1>
      <Home />
      <ToastContainer />
    </div>
  );
};

export default App;
