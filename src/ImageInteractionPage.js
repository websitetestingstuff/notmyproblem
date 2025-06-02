import React, { useState, useRef, useEffect } from 'react';
import './ImageInteractionPage.css';

const ImageInteractionPage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [blurBoxPosition, setBlurBoxPosition] = useState({ x: 50, y: 50 }); // Initial position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Relative mouse offset within the box

  const blurBoxRef = useRef(null);
  const imageDisplayAreaRef = useRef(null); // Renamed from containerRef for clarity

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        // Reset box position when new image is uploaded
        setBlurBoxPosition({ x: 50, y: 50 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Placeholder for drag logic
  const handleMouseDown = (e) => {
    if (!blurBoxRef.current) return;
    setIsDragging(true);
    // Calculate mouse offset relative to the blur box's top-left corner
    const boxRect = blurBoxRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top,
    });
    e.preventDefault(); // Prevent text selection or other default drag behaviors
  };

  // useEffect for global mouse move and mouse up listeners
  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (!isDragging || !blurBoxRef.current || !imageDisplayAreaRef.current) return;

      const imageAreaRect = imageDisplayAreaRef.current.getBoundingClientRect();

      // Calculate new raw position based on mouse position and initial drag offset
      let newX = e.clientX - imageAreaRect.left - dragStart.x;
      let newY = e.clientY - imageAreaRect.top - dragStart.y;

      // Constrain the box within the imageDisplayAreaRef
      const boxWidth = blurBoxRef.current.offsetWidth;
      const boxHeight = blurBoxRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, imageAreaRect.width - boxWidth));
      newY = Math.max(0, Math.min(newY, imageAreaRect.height - boxHeight));

      setBlurBoxPosition({ x: newX, y: newY });
    };

    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUpGlobal);
    } else {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, dragStart]);


  return (
    <div className="image-interaction-container">
      <h1>Image Interaction</h1>
      <p className="page-description">Upload an image and drag the blur box over it.</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="image-upload-input"/>

      {imageSrc && (
        <div className="image-display-area" ref={imageDisplayAreaRef}>
          <img src={imageSrc} alt="Uploaded content" />
          <div
            className="blur-box"
            ref={blurBoxRef}
            style={{
              top: `${blurBoxPosition.y}px`,
              left: `${blurBoxPosition.x}px`,
            }}
            onMouseDown={handleMouseDown}
            // onMouseUp and onMouseLeave on the box itself are not strictly needed
            // if global listeners are correctly handling mouse up.
          >
            {/* The blur effect is applied via CSS backdrop-filter */}
          </div>
        </div>
      )}
      {!imageSrc && <p className="upload-prompt">Please upload an image to begin.</p>}
    </div>
  );
};

export default ImageInteractionPage;
