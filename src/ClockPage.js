import React, { useState, useEffect, useRef } from 'react';
import './ClockPage.css';
import '@material/web/slider/slider.js'; // Import MWC slider
import '@material/web/select/outlined-select.js'; // Import MWC select
import '@material/web/select/select-option.js'; // Import MWC select option
import { formatInTimeZone } from 'date-fns-tz';

// It's generally better to get this list once, but for simplicity here,
// we define it outside. For dynamic scenarios, useEffect with empty dep array is good.
// Ensure this code runs client-side; Intl.supportedValuesOf might not be available server-side.
let availableTimezones = [];
try {
  availableTimezones = Intl.supportedValuesOf('timeZone');
} catch (e) {
  console.error("Could not get timezones from Intl.supportedValuesOf:", e);
  availableTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']; // Fallback
}


function ClockPage() {
  const [time, setTime] = useState('');
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  const sliderRef = useRef(null);
  const selectRef = useRef(null);

  // Effect for handling slider input (format toggle)
  useEffect(() => {
    const sliderElement = sliderRef.current;
    const handleSliderInput = (event) => {
      setIs24HourFormat(event.target.value === 1);
    };
    if (sliderElement) {
      sliderElement.addEventListener('input', handleSliderInput);
    }
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('input', handleSliderInput);
      }
    };
  }, []);

  // Effect for handling timezone select change
  useEffect(() => {
    const selectElement = selectRef.current;
    const handleSelectChange = (event) => {
      setSelectedTimezone(event.target.value);
    };
    if (selectElement) {
      // MWC select uses 'change' or 'input'. 'change' is typical for final value.
      selectElement.addEventListener('change', handleSelectChange);
    }
    return () => {
      if (selectElement) {
        selectElement.removeEventListener('change', handleSelectChange);
      }
    };
  }, []);

  // Effect for updating time display based on format and timezone
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // HH for 24h, hh for 12h. mm for minutes, ss for seconds. a for am/pm.
      const formatString = is24HourFormat ? 'HH:mm:ss' : 'hh:mm:ss a';
      try {
        setTime(formatInTimeZone(now, selectedTimezone, formatString));
      } catch (error) {
        console.error("Error formatting time in timezone:", error);
        setTime("Error"); // Display error if timezone is invalid
      }
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [is24HourFormat, selectedTimezone]);

  return (
    <div className="clock-container">
      <div className="clock-display">{time}</div>
      <div className="controls-container">
        <div className="format-slider-container">
          <label htmlFor="format-slider">
            Format: {is24HourFormat ? '24-Hour' : '12-Hour'}
          </label>
          <md-slider
            ref={sliderRef}
            min="0"
            max="1"
            step="1"
            value={is24HourFormat ? '1' : '0'}
            ticks
            labeled
            id="format-slider"
          ></md-slider>
        </div>
        <div className="timezone-select-container">
          <md-outlined-select ref={selectRef} label="Timezone" value={selectedTimezone} id="timezone-select">
            {availableTimezones.map((tz) => (
              <md-select-option key={tz} value={tz}>
                <div slot="headline">{tz.replace(/_/g, ' ')}</div>
              </md-select-option>
            ))}
          </md-outlined-select>
        </div>
      </div>
    </div>
  );
}

export default ClockPage;
