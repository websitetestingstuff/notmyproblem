import React, { useState } from 'react';
import './FileTreeNode.css'; // This CSS file will be created in a later step

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
          {node.type === 'directory' ? '[D]' : '[F]'}
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
