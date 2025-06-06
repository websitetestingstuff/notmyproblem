import React, { useState } from 'react';
import './CalculatorPage.css';

function CalculatorPage() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue < 0) {
      alert("Error: Cannot calculate square root of a negative number.");
      return;
    }
    const result = Math.sqrt(currentValue);
    setDisplayValue(String(result));
    // previousValue remains unchanged
    // operator remains unchanged
    setWaitingForOperand(true); // Next input will start a new number
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplayValue(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        if (current === 0) {
          alert('Error: Division by zero');
          return 0; // Or handle error appropriately
        }
        return prev / current;
      case '^':
        return Math.pow(prev, current);
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (!operator || previousValue === null) return; // Nothing to calculate

    const currentValue = parseFloat(displayValue);
    const result = calculate(previousValue, currentValue, operator);

    setDisplayValue(String(result));
    setPreviousValue(null); // Reset for next calculation chain
    setOperator(null);
    setWaitingForOperand(true); // Ready for new input, but display shows result
  };


  return (
    <div className="calculator-page">
      <h1>Calculator</h1>
      <div className="calculator-container">
        <div className="calculator-display">{displayValue}</div>
        <div className="calculator-grid">
          {/* Row 1: AC, √, ^, / */}
          <button onClick={clearDisplay} className="calculator-button clear">AC</button>
          <button onClick={handleSquareRoot} className="calculator-button operator">√</button>
          <button onClick={() => performOperation('^')} className="calculator-button operator">^</button>
          <button onClick={() => performOperation('/')} className="calculator-button operator">/</button>
          
          {/* Row 2: 7, 8, 9, * */}
          <button onClick={() => inputDigit(7)} className="calculator-button">7</button>
          <button onClick={() => inputDigit(8)} className="calculator-button">8</button>
          <button onClick={() => inputDigit(9)} className="calculator-button">9</button>
          <button onClick={() => performOperation('*')} className="calculator-button operator">*</button>

          {/* Row 3: 4, 5, 6, - */}
          <button onClick={() => inputDigit(4)} className="calculator-button">4</button>
          <button onClick={() => inputDigit(5)} className="calculator-button">5</button>
          <button onClick={() => inputDigit(6)} className="calculator-button">6</button>
          <button onClick={() => performOperation('-')} className="calculator-button operator">-</button>
          
          {/* Row 4: 1, 2, 3, + */}
          <button onClick={() => inputDigit(1)} className="calculator-button">1</button>
          <button onClick={() => inputDigit(2)} className="calculator-button">2</button>
          <button onClick={() => inputDigit(3)} className="calculator-button">3</button>
          <button onClick={() => performOperation('+')} className="calculator-button operator">+</button>

          {/* Row 5: 0, ., = */}
          {/* Making 0 span 1, . span 1, = span 2 to fill the row */}
          <button onClick={() => inputDigit(0)} className="calculator-button">0</button>
          <button onClick={inputDecimal} className="calculator-button">.</button>
          <button onClick={handleEquals} className="calculator-button equals" style={{gridColumn: 'span 2'}}> = </button>
        </div>
      </div>
    </div>
  );
}

export default CalculatorPage;
