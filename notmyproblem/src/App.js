import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        {/* Placeholder for main content */}
        <h1>Main Content Area</h1>
        <p>This is where the primary content of your application will go.</p>
        <p>Scroll down to see the footer.</p>
        {/* Add more placeholder content to demonstrate scrolling if needed */}
        <div style={{ height: '800px' }}> {/* Ensures scrolling */}
          <p>Some tall content...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
