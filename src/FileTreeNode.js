import React, { useState } from 'react';
import './FileTreeNode.css';

// Define SVG Icon Constants
const FolderIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
    <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
  </svg>
);

const FolderOpenIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
    <path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
  </svg>
);

const FileIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
  </svg>
);

const FileTreeNode = ({ node, onDownloadFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Basic protection against rendering if node is null or undefined
  if (!node) {
    return null;
  }

  return (
    <div className="file-tree-node">
      <div className="node-content"> {/* Apply node-content class here */}
        {node.type === 'directory' && (
          <button onClick={handleToggleExpand} className="expand-button">
            {isExpanded ? '[-]' : '[+]'}
          </button>
        )}
        <span className={`icon icon-${node.type}`}>
          {node.type === 'directory' ? (isExpanded ? FolderOpenIcon : FolderIcon) : FileIcon}
        </span>
        <span className="node-name">{node.name}</span>
        {node.type === 'file' && (
          <span className="node-size">(Size: {node.size} bytes)</span>
        )}
        {node.type === 'file' && (
          <button
            className="download-button"
            onClick={() => onDownloadFile(node.path, node.offset, node.size)}>
            Download
          </button>
        )}
      </div>
      {node.type === 'directory' && isExpanded && node.children && node.children.length > 0 && (
        <div className="file-tree-children">
          {node.children.map(childNode => (
            <FileTreeNode
              key={childNode.path} // Assuming node.path is unique for each node
              node={childNode}
              onDownloadFile={onDownloadFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeNode;
