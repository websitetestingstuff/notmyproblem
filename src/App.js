import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';
import ClockPage from './ClockPage';
import CalculatorPage from './CalculatorPage'; // Import CalculatorPage
import StopwatchPage from './StopwatchPage'; // Import StopwatchPage
import TypeTestPage from './TypeTestPage'; // Import TypeTestPage

// Define HomePage component
function HomePage() {
  return (
    <>
      <h1>Main Content Area</h1>
      <p>This is where the primary content of your application will go.</p>
      <p>Scroll down to see the footer.</p>
      <div style={{ height: '800px' }}> {/* Ensures scrolling */}
        <p>Some tall content...</p>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clock" element={<ClockPage />} />
            <Route path="/calculator" element={<CalculatorPage />} /> {/* Add CalculatorPage route */}
            <Route path="/stopwatch" element={<StopwatchPage />} /> {/* Add StopwatchPage route */}
            <Route path="/typetest" element={<TypeTestPage />} /> {/* Add TypeTestPage route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
