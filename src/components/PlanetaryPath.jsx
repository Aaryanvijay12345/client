import React, { useState, useEffect, useRef } from 'react';
import DraggableBox from './DraggableBox';
import PlanetryAnimatedBackground from '../components/PlanetaryAnimatedBackground';
import Xarrow, { Xwrapper } from 'react-xarrows';
import '../styles/PlanetaryPath.css'; // Updated import for CSS
import TaskModal from './TaskModal';

const PlanetryPath = () => {
  const numPlanteryElements = 48;
  const planteryElementIds = Array.from({ length: numPlanteryElements }, (_, i) => `elem${i + 1}`);
  const planteryXIncrement = 220;
  const planteryContainerHeight = window.innerHeight - 200; // Adjusting for element height and some margin

  const generatePlanteryRandomYPosition = () => {
    const planteryMinY = 50; // Minimum y position
    const planteryMaxY = planteryContainerHeight - 450; // Adjusted to prevent overflow
    return Math.floor(Math.random() * (planteryMaxY - planteryMinY + 1)) + planteryMinY;
  };

  const planteryDefaultPositions = planteryElementIds.reduce((acc, id, index) => {
    const planteryX = 50 + index * planteryXIncrement;
    const planteryY = generatePlanteryRandomYPosition();
    acc[id] = { x: planteryX, y: planteryY };
    return acc;
  }, {});

  const [planteryPositions, setPlanteryPositions] = useState(planteryDefaultPositions);
  const [showPlanteryModal, setShowPlanteryModal] = useState(false);
  const [planteryModalQuestion, setPlanteryModalQuestion] = useState('');
  const [planteryModalAnswer, setPlanteryModalAnswer] = useState('');
  const [planteryModalLink, setPlanteryModalLink] = useState('');
  const [planteryModalPosition, setPlanteryModalPosition] = useState({ x: 0, y: 0 });

  const planteryScrollContainerRef = useRef(null);

  const planteryQuestionsAndAnswers = [
    { id: 'elem1', question: 'What is React?', answer: 'React is a JavaScript library for building user interfaces.', link: 'https://reactjs.org' },
    { id: 'elem2', question: 'What is a component?', answer: 'A component is a reusable piece of UI in a React application.', link: 'https://reactjs.org/docs/components-and-props.html' },
    { id: 'elem3', question: 'What is a component?', answer: 'A component is a reusable piece of UI in a React application.', link: 'https://reactjs.org/docs/components-and-props.html' },
  ];

  const handlePlanteryPositionChange = (id, x, y) => {
    const planteryNewY = Math.min(Math.max(y, 50), planteryContainerHeight - 50); // Clamp Y to within bounds
    const planteryNewPositions = { ...planteryPositions, [id]: { x, y: planteryNewY } };
    setPlanteryPositions(planteryNewPositions);
  };

  const handlePlanteryElementClick = (id, event) => {
    event.preventDefault();
    event.stopPropagation();

    const { x, y, width, height } = event.target.getBoundingClientRect();
    const planteryModalWidth = 300; // modal's width
    const planteryModalHeight = 200; // modal's height

    // Calculate modal position considering scroll and viewport dimensions
    const planteryModalX = x + window.scrollX + width / 2;
    const planteryModalY = y + window.scrollY + height / 2;

    // Determine if the element is near the edges of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let planteryAdjustedX = planteryModalX;
    let planteryAdjustedY = planteryModalY;

    // Adjust X position
    if (planteryModalX + planteryModalWidth / 2 > viewportWidth) {
      planteryAdjustedX = viewportWidth - planteryModalWidth / 2;
    } else if (planteryModalX - planteryModalWidth / 2 < 0) {
      planteryAdjustedX = planteryModalWidth / 2;
    }

    // Adjust Y position
    if (planteryModalY + planteryModalHeight / 2 > viewportHeight) {
      planteryAdjustedY = viewportHeight - planteryModalHeight / 2;
    } else if (planteryModalY - planteryModalHeight / 2 < 0) {
      planteryAdjustedY = planteryModalHeight / 2;
    }

    const planteryClickedElementData = planteryQuestionsAndAnswers.find(item => item.id === id);

    if (planteryClickedElementData) {
      setPlanteryModalQuestion(planteryClickedElementData.question);
      setPlanteryModalAnswer(planteryClickedElementData.answer);
      setPlanteryModalLink(planteryClickedElementData.link);
      setPlanteryModalPosition({ x: planteryAdjustedX, y: planteryAdjustedY });
      setShowPlanteryModal(true);
    }
  };

  const handlePlanteryCloseModal = () => {
    setShowPlanteryModal(false);
    setPlanteryModalQuestion('');
    setPlanteryModalAnswer('');
    setPlanteryModalLink('');
  };

  const handlePlanteryWheel = (event) => {
    if (planteryScrollContainerRef.current) {
      planteryScrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const planteryScrollContainer = planteryScrollContainerRef.current;
    if (planteryScrollContainer) {
      planteryScrollContainer.addEventListener('wheel', handlePlanteryWheel);
      return () => {
        planteryScrollContainer.removeEventListener('wheel', handlePlanteryWheel);
      };
    }
  }, []);

  return (
    <div className="planetry-scroll-container" ref={planteryScrollContainerRef}>
      <div className="planetry-scroll-content">
        <Xwrapper>
          {planteryElementIds.map(id => (
            <div key={id}>
              <DraggableBox
                id={id}
                onDrag={(x, y) => handlePlanteryPositionChange(id, x, y)}
                onClick={(e) => handlePlanteryElementClick(id, e)}
                className={`planetry-element ${id}`}
                style={{ left: planteryPositions[id].x, top: planteryPositions[id].y }}
              />
            </div>
          ))}
          {planteryElementIds.slice(1).map((id, index) => (
            <Xarrow key={id} start={planteryElementIds[index]} end={id} curveness={1.5} />
          ))}
        </Xwrapper>
        <TaskModal
          show={showPlanteryModal}
          onClose={handlePlanteryCloseModal}
          question={planteryModalQuestion}
          answer={planteryModalAnswer}
          link={planteryModalLink}
          position={planteryModalPosition}
        />
        <PlanetryAnimatedBackground />
      </div>
    </div>
  );
};

export default PlanetryPath;



