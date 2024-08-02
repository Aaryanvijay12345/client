import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

const DraggableBox = ({ id, style, onDrag, onClick }) => {
  const boxRef = useRef(null);
  const updateXarrow = useXarrow();
  const [position, setPosition] = useState({ x: style.left || 0, y: style.top || 0 });
  const [bounds, setBounds] = useState({ top: 0, bottom: window.innerHeight - 100 });
  const [backgroundColor, setBackgroundColor] = useState(getRandomDraggableColor());
  const [size, setSize] = useState(getRandomDraggableSize());

  useEffect(() => {
    const handleResize = () => {
      setBounds({ top: 0, bottom: window.innerHeight - 100 });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setPosition({ x, y });
    onDrag(x, y);
    updateXarrow();
  };

  const handleStop = (e, ui) => {
    // Ensure box stays within bounds after drag stops
    if (ui.y < bounds.top) {
      setPosition({ ...position, y: bounds.top });
    } else if (ui.y > bounds.bottom) {
      setPosition({ ...position, y: bounds.bottom });
    }
  };

  function getRandomDraggableColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getRandomDraggableSize() {
    const minSize = 100; // Minimum size value
    const maxSize = 200; // Maximum size value
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    return { width: `${size}px`, height: `${size}px` };
  }

  const defaultDraggableStyle = {
    border: `5px solid ${backgroundColor}`, // Border color based on background color
    textAlign: 'center',
    color: '#FFFFFF', // White text color
    backgroundColor, // Dynamic background color
    borderRadius: '50%', // Circular shape
    padding: '10px',
    width: size.width, // Dynamic width
    height: size.height, // Dynamic height
    position: 'absolute',
    left: position.x,
    top: position.y,
    backgroundImage: 'radial-gradient(circle, #2980b9, #2c3e50, #f39c12)', // Gradient colors
    animation: 'glow 4s infinite alternate', // Glow animation
  };

  return (
    <Draggable
      bounds={bounds}
      defaultPosition={{ x: style.left || 0, y: style.top || 0 }}
      position={null}
      onDrag={handleDrag}
      onStop={handleStop}
      nodeRef={boxRef}
    >
      <div ref={boxRef} id={id} style={{ ...defaultDraggableStyle, ...style }} onClick={onClick}>
        {id}
      </div>
    </Draggable>
  );
};

// Define the keyframes for the glow animation
const styles = `
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px #9b59b6, 0 0 30px #9b59b6, 0 0 40px #9b59b6;
  }
  50% {
    box-shadow: 0 0 10px #9b59b6, 0 0 20px #9b59b6, 0 0 30px #9b59b6;
  }
}
`;

// Append the style to the head of the document
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default DraggableBox;

