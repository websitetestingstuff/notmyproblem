import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';
import ClockPage from './ClockPage';
import CalculatorPage from './CalculatorPage'; // Import CalculatorPage
import StopwatchPage from './StopwatchPage'; // Import StopwatchPage
import TypeTestPage from './TypeTestPage'; // Import TypeTestPage
import ImageInteractionPage from './ImageInteractionPage'; // Import ImageInteractionPage

// Define HomePage component
function HomePage() {
  return (
    <>
      <h1>Homepage Showcase</h1>
      <p>This page demonstrates various HTML elements and sample content.</p>

      <h2>Text Formatting</h2>
      <p>This is a standard paragraph. <strong>This text is bold.</strong> <em>This text is italic.</em> <strong><em>This is bold and italic.</em></strong> <u>This is underlined.</u> <s>This is strikethrough.</s></p>

      <h3>Sub-heading Level 3</h3>
      <p>Another paragraph with more text to demonstrate spacing and flow.</p>

      <h4>Sub-heading Level 4</h4>
      <blockquote>"This is a blockquote, useful for highlighting quotes or important notes." - A wise person.</blockquote>

      <h2>Lists</h2>
      <h3>Unordered List</h3>
      <ul>
        <li>Apples</li>
        <li>Oranges</li>
        <li>Bananas</li>
      </ul>

      <h3>Ordered List</h3>
      <ol>
        <li>First step</li>
        <li>Second step</li>
        <li>Third step</li>
      </ol>

      <hr />

      <h2>Sample Images</h2>
      <p>Below are some placeholder images:</p>
      <img src="https://via.placeholder.com/728x150.png?text=Large+Banner+Image" alt="Large Placeholder Banner" />
      <img src="https://via.placeholder.com/300x200.png?text=Medium+Image" alt="Medium Placeholder" style={{ marginTop: '1rem', marginRight: '1rem', display: 'inline-block' }} />
      <img src="https://via.placeholder.com/300x200.png?text=Another+Medium+Image" alt="Another Medium Placeholder" style={{ marginTop: '1rem', display: 'inline-block' }} />

      <h5>Sub-heading Level 5</h5>
      <p>Some text under H5.</p>

      <h6>Sub-heading Level 6</h6>
      <p>Some text under H6, which is typically the smallest heading.</p>

      {/* Add a div with height to ensure scrolling for testing purposes if needed, or remove if content is tall enough */}
      {/* <div style={{ height: '400px' }}></div> */}
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
            <Route path="/image-interaction" element={<ImageInteractionPage />} /> {/* Add ImageInteractionPage route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
