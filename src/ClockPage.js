import React, { useState, useEffect, useRef } from 'react';
import './ClockPage.css';
import '@material/web/switch/switch.js'; // Import MWC switch
import '@material/web/select/outlined-select.js'; // Import MWC select
import '@material/web/select/select-option.js'; // Import MWC select option
import { formatInTimeZone } from 'date-fns-tz';

// It's generally better to get this list once, but for simplicity here,
// we define it outside. For dynamic scenarios, useEffect with empty dep array is good.
// Ensure this code runs client-side; Intl.supportedValuesOf might not be available server-side.
let allTimezones = [];
try {
  allTimezones = Intl.supportedValuesOf('timeZone');
} catch (e) {
  console.error("Could not get timezones from Intl.supportedValuesOf:", e);
  allTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']; // Fallback
}

// Function to format the GMT offset
const getFormattedGmtOffset = (timezone) => {
  try {
    // Get the offset in the format "+HH:mm" or "-HH:mm" or "Z"
    const offsetString = formatInTimeZone(new Date(), timezone, 'xxx');
    if (offsetString === 'Z') return 'GMT';
    
    const [hours, minutes] = offsetString.split(':');
    const h = parseInt(hours, 10);
    
    let displayOffset = `GMT${h >= 0 ? '+' : ''}${h}`;
    if (minutes && parseInt(minutes, 10) !== 0) {
      displayOffset += `:${minutes}`;
    }
    return displayOffset;
  } catch (error) {
    console.error(`Error getting offset for timezone ${timezone}:`, error);
    return ''; // Return empty if error
  }
};

const availableTimezones = allTimezones.map(tz => ({
  value: tz,
  display: `${tz.replace(/_/g, ' ')} (${getFormattedGmtOffset(tz)})`
})).filter(tz => tz.display.includes('GMT')); // Ensure only valid timezones with offsets are included


function ClockPage() {
  const [time, setTime] = useState('');
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  const selectRef = useRef(null);
  const switchRef = useRef(null); // Ref for the switch

  // Event handler for the switch
  const handleFormatChange = (event) => {
    setIs24HourFormat(event.target.selected);
  };

  // Effect for attaching event listener to the switch
  useEffect(() => {
    const switchElement = switchRef.current;
    if (switchElement) {
      // MWC switch uses 'change' event for when its state is committed by the user
      switchElement.addEventListener('change', handleFormatChange);
    }
    return () => {
      if (switchElement) {
        switchElement.removeEventListener('change', handleFormatChange);
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
        <div className="format-switch-container"> {/* Renamed class for clarity */}
          <label htmlFor="format-switch">
            24-Hour Format
          </label>
          <md-switch
            ref={switchRef}
            selected={is24HourFormat}
            id="format-switch"
          ></md-switch>
        </div>
        <div className="timezone-select-container">
          <md-outlined-select ref={selectRef} label="Timezone" value={selectedTimezone} id="timezone-select">
            {availableTimezones.map((tz) => (
              <md-select-option key={tz.value} value={tz.value}>
                <div slot="headline">{tz.display}</div>
              </md-select-option>
            ))}
          </md-outlined-select>
        </div>
      </div>
    </div>
  );
}

export default ClockPage;
