import React, { useState, useEffect } from 'react';
import './TypeTestPage.css';

const PREDEFINED_TEXT = "The quick brown fox jumps over the lazy dog. This is a sample text for the typing test. Good luck and type accurately!";

function TypeTestPage() {
  const [sampleText, setSampleText] = useState(PREDEFINED_TEXT);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  const calculateResults = () => {
    if (!startTime || !endTime) return;

    const timeTakenInSeconds = (endTime - startTime) / 1000;
    const timeTakenInMinutes = timeTakenInSeconds / 60;

    // WPM calculation
    const wordsInSample = sampleText.split(' ').length;
    const calculatedWpm = Math.round(wordsInSample / timeTakenInMinutes) || 0;
    setWpm(calculatedWpm);

    // Accuracy calculation
    let correctCharacters = 0;
    for (let i = 0; i < sampleText.length; i++) {
      if (userInput[i] === sampleText[i]) {
        correctCharacters++;
      }
    }
    const calculatedAccuracy = Math.round((correctCharacters / sampleText.length) * 100) || 0;
    setAccuracy(calculatedAccuracy);
  };

  const handleInputChange = (event) => {
    if (testFinished) return;

    const currentInput = event.target.value;
    setUserInput(currentInput);

    if (!testStarted) {
      setStartTime(Date.now());
      setTestStarted(true);
    }

    // Check for completion (exact match of length, then content)
    // Using length check first can be slightly more performant but exact match is crucial.
    if (currentInput.length === sampleText.length) {
        // A more robust check might be needed if we allow early finish.
        // For now, assume test ends when input length matches sample length.
        setEndTime(Date.now());
        setTestFinished(true);
        // Results will be calculated in useEffect when testFinished becomes true
    }
  };
  
  // Calculate results when test is finished
  useEffect(() => {
    if (testFinished && startTime && endTime) {
      calculateResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testFinished, startTime, endTime]); // Dependencies for calculating results

  const handleReset = () => {
    // Could fetch new text here if generateSampleText was implemented
    // For now, just reset to the predefined text
    setSampleText(PREDEFINED_TEXT); 
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    setTestStarted(false);
    setTestFinished(false);
  };
  
  // Optional: function to generate/fetch new sample text
  // const generateSampleText = () => { /* ... */ };

  const getHighlightedText = () => {
    return sampleText.split('').map((char, index) => {
      let charClass = '';
      if (index < userInput.length) {
        charClass = userInput[index] === char ? 'correct' : 'incorrect';
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };


  return (
    <div className="typetest-container">
      <h1>Typing Speed Test</h1>
      <div className="sample-text-display">
        {getHighlightedText()}
      </div>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        disabled={testFinished}
        placeholder={testStarted ? "" : "Start typing here to begin the test..."}
        rows="10"
      />
      {testFinished && (
        <div className="results-display">
          <h2>Test Results</h2>
          <p>Words Per Minute (WPM): {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      )}
      <button onClick={handleReset} className="reset-button">
        Reset Test
      </button>
    </div>
  );
}

export default TypeTestPage;
