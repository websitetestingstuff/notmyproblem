import React, { useState, useRef } from 'react'; // Import useRef
import JSZip from 'jszip'; // Import JSZip
import './AsarExtractorPage.css';
import FileTreeNode from './FileTreeNode'; // Import FileTreeNode

const AsarExtractorPage = () => {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTree, setFileTree] = useState(null);
  const [asarBuffer, setAsarBuffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false); // New state for zipping
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFileTree(null);
    setAsarBuffer(null);
    setErrorMessage('');
    setSelectedFile(event.target.files[0]);
  };

  const extractAsar = () => {
    if (!selectedFile) {
      // console.log('No file selected'); // User will see this via lack of file tree/error message
      setErrorMessage('Please select an ASAR file first.');
      return;
    }
    setErrorMessage(''); // Clear previous errors
    setIsLoading(true);
    setFileTree(null); // Clear previous tree

    // console.log('Starting ASAR extraction process...'); // isLoading state will show this
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target.result;
        // console.log('File ArrayBuffer length:', buffer.byteLength); // Dev info
        setAsarBuffer(buffer);

        // console.log('Attempting to parse ASAR header...'); // Dev info
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
        let headerString = new TextDecoder('utf-8').decode(headerBuffer);
        // console.log("Raw ASAR Header String:", headerString); // Optional: log raw string before trimming

        const jsonStartIndex = headerString.indexOf('{');
        if (jsonStartIndex === -1) {
          throw new Error("ASAR header JSON does not contain '{'.");
        }
        // Only substring if '{' is not the first character.
        // If jsonStartIndex is 0, substring would be redundant.
        // If jsonStartIndex > 0, it means there's leading garbage.
        if (jsonStartIndex > 0) {
          console.log(`Trimming ${jsonStartIndex} characters from the start of the ASAR header string.`);
          headerString = headerString.substring(jsonStartIndex);
        }
        console.log("Cleaned ASAR Header JSON:", headerString);

        const headerJson = JSON.parse(headerString);

        function buildFileTreeRecursive(nodeName, nodeData, pathSoFar) {
          const currentFullPath = pathSoFar ? `${pathSoFar}/${nodeName}` : nodeName;
          if (nodeData.files) { // It's a directory
            const children = [];
            for (const childName in nodeData.files) {
              children.push(buildFileTreeRecursive(childName, nodeData.files[childName], currentFullPath));
            }
            // Sort children so files and directories are grouped and alphabetized
            children.sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            });
            return { name: nodeName, type: 'directory', path: currentFullPath, children: children };
          } else { // It's a file
            return { name: nodeName, type: 'file', size: nodeData.size, offset: nodeData.offset, path: currentFullPath };
          }
        }

        const children = [];
        // Standard ASAR structure has a 'files' object under the root.
        // For example: { "files": { "app": { "files": {...} }, "package.json": {"size": ...} } }
        // The 'headerJson' variable would correspond to the above structure.
        // The actual file entries are within 'headerJson.files'.
        if (headerJson.files) {
            for (const name in headerJson.files) {
                children.push(buildFileTreeRecursive(name, headerJson.files[name], ''));
            }
            // Sort children at the root level
            children.sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            });
        } else {
            // This case handles ASAR files that might not have the top-level "files" wrapper,
            // though this is less common for archives like Electron app.asar.
            // It assumes headerJson itself is the directory listing.
            console.warn("ASAR root does not have a 'files' property. Processing as a flat list or single item.");
            for (const name in headerJson) {
                 children.push(buildFileTreeRecursive(name, headerJson[name], ''));
            }
             // Sort children at the root level
            children.sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            });
        }

        const generatedFileTree = {
          name: selectedFile ? selectedFile.name : 'asar_archive',
          type: 'directory',
          path: '', // Root path is empty string
          children: children
        };
        setFileTree(generatedFileTree);
        setErrorMessage(''); // Clear any errors if successful
      } catch (error) {
        console.error("Error parsing ASAR file:", error);
        setErrorMessage(`Failed to parse ASAR file: ${error.message}. Please ensure it is a valid .asar archive.`);
        setFileTree(null);
        setAsarBuffer(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setErrorMessage('Failed to read the selected file.');
      setFileTree(null);
      setAsarBuffer(null);
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDownloadFile = (filePath, offset, size) => {
    if (!asarBuffer) {
      console.error("ASAR buffer is not available for download.");
      alert("Error: ASAR data not loaded.");
      return;
    }

    // ASAR header size is 8 bytes (pickle size + json header size declarations)
    // The actual JSON header starts after these 8 bytes.
    // The file offsets in ASAR are typically from the start of the ASAR file *after* its header.
    // So, we need to find where the actual file data begins.
    // 1. Get jsonHeaderSize
    const view = new DataView(asarBuffer);
    const jsonHeaderSize = view.getUint32(4, true); // Size of the JSON header string

    // 2. Calculate where the file content region starts
    // The file content starts after:
    //   - 4 bytes for `pickleSize` (which contains jsonHeaderSize + 4)
    //   - 4 bytes for `jsonHeaderSize` itself
    //   - `jsonHeaderSize` bytes for the actual JSON string
    const fileContentStartOffset = 8 + jsonHeaderSize;

    // 3. Slice the file data
    // The 'offset' from the ASAR header is relative to the start of the file content region.
    const fileDataStart = fileContentStartOffset + parseInt(offset, 10);
    const fileDataEnd = fileDataStart + parseInt(size, 10);

    if (fileDataEnd > asarBuffer.byteLength) {
        console.error(`Calculated file end offset ${fileDataEnd} is beyond buffer length ${asarBuffer.byteLength}. Path: ${filePath}, Offset: ${offset}, Size: ${size}`);
        alert(`Error: File data for "${filePath}" is out of bounds. The ASAR file might be corrupted or parsed incorrectly.`);
        return;
    }

    const fileData = asarBuffer.slice(fileDataStart, fileDataEnd);
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Extract filename from path
    a.download = filePath.includes('/') ? filePath.substring(filePath.lastIndexOf('/') + 1) : filePath;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`Download requested for: ${filePath}, Offset: ${offset}, Size: ${size}`);
  };

  const handleDownloadAllAsZip = async () => {
    if (!fileTree || !asarBuffer) {
      setErrorMessage('No ASAR content loaded to zip.');
      return;
    }
    setIsZipping(true);
    setErrorMessage(''); // Clear previous errors

    const zip = new JSZip();

    const getLocalHeaderInfo = (buffer) => {
      const view = new DataView(buffer);
      // const pickleSize = view.getUint32(0, true); // Not directly used for offset calculation here
      const actualJsonHeaderSize = view.getUint32(4, true);
      return { jsonHeaderSize: actualJsonHeaderSize };
    };
    const headerInfo = getLocalHeaderInfo(asarBuffer);
    const dataBlockOffset = 8 + headerInfo.jsonHeaderSize;

    const addNodeToZip = (node, currentZipFolder) => {
      if (node.type === 'directory') {
        const folder = currentZipFolder.folder(node.name);
        if (node.children) {
          for (const child of node.children) {
            addNodeToZip(child, folder);
          }
        }
      } else if (node.type === 'file') {
        if (typeof node.offset === 'undefined' || typeof node.size === 'undefined') {
            console.warn(`Skipping file ${node.path} due to missing offset or size.`);
            return;
        }
        const fileDataStart = dataBlockOffset + parseInt(node.offset, 10);
        const fileContent = asarBuffer.slice(fileDataStart, fileDataStart + node.size);
        currentZipFolder.file(node.name, fileContent, { binary: true });
      }
    };

    try {
      if (fileTree.children) {
        for (const childNode of fileTree.children) {
          addNodeToZip(childNode, zip);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = (selectedFile ? selectedFile.name.replace(/\.asar$/, '') : 'asar_archive') + '.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Error creating ZIP:", error);
      setErrorMessage('Failed to create ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="asar-extractor-page dark-mode">
      {isLoading && <p className="loading-message">Processing ASAR file...</p>}
      {isZipping && <p className="loading-message">Zipping files...</p>} {/* Zipping message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="controls">
        <input
          type="file"
          accept=".asar"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }} // Visually hide the default input
          disabled={isLoading || isZipping}
        />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="custom-file-select-button"
          disabled={isLoading || isZipping}
        >
          Select ASAR File
        </button>
        {selectedFile && <span className="selected-file-name">{selectedFile.name}</span>}
        <button
          onClick={extractAsar}
          className="extract-button"
          disabled={isLoading || isZipping || !selectedFile}
        >
          {isLoading ? 'Processing...' : 'Extract Info'}
        </button>
        <button
          onClick={handleDownloadAllAsZip}
          className="download-zip-button"
          disabled={isLoading || isZipping || !fileTree || !asarBuffer}
        >
          {isZipping ? 'Zipping...' : 'Download All as ZIP'}
        </button>
      </div>
      {fileTree && !isLoading && !isZipping && !errorMessage && (
        <div className="file-tree-container">
          <h3>{selectedFile ? selectedFile.name : 'ASAR Content'}</h3>
          <FileTreeNode node={fileTree} onDownloadFile={handleDownloadFile} />
        </div>
      )}
    </div>
  );
};

export default AsarExtractorPage;
