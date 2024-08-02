import React from 'react';
import '../styles/TaskModal.css';

const TaskModal = ({ show, onClose, question, answer, link, position }) => {
  if (!show) {
    return null;
  }

  const calculateTaskModalPosition = () => {
    const modalWidth = 400;
    const modalHeight = 300;
    const { x, y } = position;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + modalWidth > viewportWidth) {
      adjustedX = viewportWidth - modalWidth - 20;
    }

    if (y + modalHeight > viewportHeight) {
      adjustedY = viewportHeight - modalHeight - 20;
    }

    return { top: adjustedY, left: adjustedX };
  };

  const taskModalStyle = {
    position: 'fixed',
    top: calculateTaskModalPosition().top + 'px',
    left: calculateTaskModalPosition().left + 'px',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" style={taskModalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-background"></div>
        <button className="task-modal-button" onClick={onClose}>Close</button>
        <h2>Task Details</h2>
        <h3>{question}</h3>
        <p>{answer}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
      </div>
    </div>
  );
};

export default TaskModal;