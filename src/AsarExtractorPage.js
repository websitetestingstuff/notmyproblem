import React, { useState } from 'react';
import './AsarExtractorPage.css';

const AsarExtractorPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const extractAsar = () => {
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }

    console.log('Starting ASAR extraction process...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target.result;
      console.log('File ArrayBuffer length:', buffer.byteLength);

      try {
        console.log('Attempting to parse ASAR header...');
        const view = new DataView(buffer);

        // The first 4 bytes are a UInt32LE for pickleSize.
        // We don't directly use pickleSize itself for header extraction in this simplified model,
        // but it's part of the ASAR structure.
        // const pickleSize = view.getUint32(0, true);
        // console.log('Pickle Size:', pickleSize);

        // The next 4 bytes (offset 4) give the size of the JSON header.
        const jsonHeaderSize = view.getUint32(4, true);
        console.log('JSON Header Size:', jsonHeaderSize);

        // The JSON header string starts at offset 8.
        const headerBuffer = buffer.slice(8, 8 + jsonHeaderSize);
        const headerString = new TextDecoder('utf-8').decode(headerBuffer);
        console.log("ASAR Header JSON:", headerString);

        const headerJson = JSON.parse(headerString);

        const logFiles = (node, currentPath) => {
          // Adjust based on actual ASAR structure, typically root is an object with a 'files' property
          const files = node.files || node; // If headerJson is the root files object directly
          for (const [entryName, entryNode] of Object.entries(files)) {
            const newPath = currentPath ? `${currentPath}/${entryName}` : entryName;
            if (entryNode.files) { // It's a directory
              console.log('Found: Directory', newPath);
              logFiles(entryNode, newPath);
            } else { // It's a file
              console.log('Found: File', newPath, 'Size:', entryNode.size, 'Offset:', entryNode.offset);
            }
          }
        };

        // Determine the starting node for logFiles.
        // Common ASAR structure has a root object, and the file tree is under a property (e.g., "files").
        // If headerJson itself is the directory listing (e.g. { "file1": {...}, "dir1": {"files": {...}} }),
        // then headerJson is the correct starting node.
        // If headerJson is like { "files": { "file1": ... } }, then headerJson.files is the node.
        // Based on typical asar structure, the root of the parsed JSON is the directory listing.
        logFiles(headerJson, '');

      } catch (error) {
        console.error("Error parsing ASAR file:", error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="asar-extractor-page">
      <input type="file" accept=".asar" onChange={handleFileChange} />
      <button onClick={extractAsar}>Extract Info</button>
    </div>
  );
};

export default AsarExtractorPage;
