import React, { useState, useEffect, useRef } from "react";
import DraggableBox from "./DraggableBox";
import PlanetryAnimatedBackground from "./PlanetryAnimatedBackground";
import Xarrow, { Xwrapper } from "react-xarrows";
import "../styles/PlanetryPath.css";
import TaskModal from "./TaskModal";

const PlanetryPath = () => {
  const xIncrement = 220;
  const containerHeight = window.innerHeight - 200; // Adjusting for element height and some margin

  const generateRandomYPosition = () => {
    const minY = 50; // Minimum y position
    const maxY = containerHeight - 450; // Adjusted to prevent overflow
    return Math.floor(2 * Math.random() * (maxY - minY + 1)) + minY;
  };

  const [positions, setPositions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalQuestion, setModalQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [modalLink, setModalLink] = useState("");
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);
  const username = localStorage.getItem("Username");

  const fetchTasks = async (username) => {
    try {
      const response = await fetch("/api/get-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(username);
        setTasks(fetchedTasks);

        // Generate default positions for each task
        const defaultPositions = fetchedTasks.reduce((acc, task, index) => {
          const x = 50 + index * xIncrement;
          const y = generateRandomYPosition();
          acc[`task${task.week}`] = { x, y };
          return acc;
        }, {});

        setPositions(defaultPositions);
      } catch (error) {
        setError(error.message);
      }
    };

    loadTasks();
  }, [username]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePositionChange = (id, x, y) => {
    const newY = Math.min(Math.max(y, 50), containerHeight - 50); // Clamp Y to within bounds
    const newPositions = { ...positions, [id]: { x, y: newY } };
    setPositions(newPositions);
  };

  const handleElementClick = (id, event) => {
    event.preventDefault();
    event.stopPropagation();

    const { x, y, width, height } = event.target.getBoundingClientRect();
    const modalWidth = 300; //  modal's width
    const modalHeight = 200; //  modal's height

    // Calculate modal position considering scroll and viewport dimensions
    const modalX = x + window.scrollX + width / 2;
    const modalY = y + window.scrollY + height / 2;

    // Determine if the element is near the edges of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = modalX;
    let adjustedY = modalY;

    // Adjust X position
    if (modalX + modalWidth / 2 > viewportWidth) {
      adjustedX = viewportWidth - modalWidth / 2;
    } else if (modalX - modalWidth / 2 < 0) {
      adjustedX = modalWidth / 2;
    }

    // Adjust Y position
    if (modalY + modalHeight / 2 > viewportHeight) {
      adjustedY = viewportHeight - modalHeight / 2;
    } else if (modalY - modalHeight / 2 < 0) {
      adjustedY = modalHeight / 2;
    }

    const clickedElementData = tasks.find((task) => `task${task.week}` === id);

    if (clickedElementData) {
      setModalQuestion(clickedElementData.question);
      setModalAnswer(clickedElementData.answer);
      setModalLink(clickedElementData.link);
      setModalPosition({ x: adjustedX, y: adjustedY });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalQuestion("");
    setModalAnswer("");
    setModalLink("");
  };

  const handleWheel = (event) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel);
      return () => {
        scrollContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <div className="planetry-scroll-container" ref={scrollContainerRef}>
      <div className="planetry-scroll-content">
        <Xwrapper>
          {tasks.map((task) => (
            <DraggableBox
              key={`task${task.week}`}
              id={`task${task.week}`}
              onDrag={(x, y) => handlePositionChange(`task${task.week}`, x, y)}
              onClick={(e) => handleElementClick(`task${task.week}`, e)}
              className={`planetry-element`}
              style={{
                left: positions[`task${task.week}`]?.x,
                top: positions[`task${task.week}`]?.y,
              }}
            />
          ))}

          {tasks.slice(1).map((task, index) => (
            <Xarrow
              key={`task${task.week}`}
              start={`task${tasks[index].week}`}
              end={`task${task.week}`}
              curveness={1.5}
            />
          ))}
        </Xwrapper>
        <TaskModal
          show={showModal}
          onClose={handleCloseModal}
          question={modalQuestion}
          answer={modalAnswer}
          link={modalLink}
          position={modalPosition}
        />
        <PlanetryAnimatedBackground />
      </div>
    </div>
  );
};

export default PlanetryPath;
