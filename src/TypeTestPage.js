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
  const [activeKey, setActiveKey] = useState(''); // For keyboard highlighting
  const [activeKeyTimeout, setActiveKeyTimeout] = useState(null); // Timeout for active key

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
    const lastChar = currentInput.slice(-1); // Get the last typed character
    setUserInput(currentInput);

    if (activeKeyTimeout) {
      clearTimeout(activeKeyTimeout);
    }
    setActiveKey(lastChar.toUpperCase());
    const timeoutId = setTimeout(() => setActiveKey(''), 200); // Highlight for 200ms
    setActiveKeyTimeout(timeoutId);


    if (!testStarted) {
      setStartTime(Date.now());
      setTestStarted(true);
    }

    // Check for completion
    if (currentInput.length === sampleText.length) {
        setEndTime(Date.now());
        setTestFinished(true);
    }
  };
  
  // Calculate results when test is finished
  useEffect(() => {
    if (testFinished && startTime && endTime) {
      calculateResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testFinished, startTime, endTime]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (activeKeyTimeout) {
        clearTimeout(activeKeyTimeout);
      }
    };
  }, [activeKeyTimeout]);

  const handleReset = () => {
    // Could fetch new text here if generateSampleText was implemented
    // Reset progress but keep the current sampleText
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

  const handleSampleTextChange = (event) => {
    setSampleText(event.target.value);
    // Call a modified reset that doesn't change sampleText back to PREDEFINED_TEXT
    // For now, handleReset is modified to keep current sampleText
    handleReset();
  };

  const getHighlightedText = () => {
    return sampleText.split('').map((char, index) => {
      let charClass = '';
      if (index < userInput.length) {
        charClass = userInput[index] === char ? 'correct' : 'incorrect';
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SPACE'] // Representing spacebar
  ];

  const renderKeyboard = () => {
    return (
      <div className="keyboard">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <div
                key={key}
                className={`keyboard-key ${key === 'SPACE' ? 'spacebar' : ''} ${activeKey === key ? 'active-key' : ''}`}
              >
                {key === 'SPACE' ? '' : key}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="typetest-container">
      <h1>Typing Speed Test</h1>

      <div className="sample-text-editor">
        <label htmlFor="sampleTextEditable">Edit Sample Text:</label>
        <textarea
          id="sampleTextEditable"
          value={sampleText}
          onChange={handleSampleTextChange}
          rows="5"
          className="sample-text-edit-area"
        />
      </div>

      <div className="sample-text-display">
        {getHighlightedText()}
      </div>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        disabled={testFinished}
        placeholder={testStarted ? "" : "Start typing here to begin the test..."}
        rows="10"
        className="typing-area"
      />

      {renderKeyboard()}

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
