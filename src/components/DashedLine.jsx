import React, { useEffect, useRef } from 'react';
import '../styles/Start3.css';

const DashedLine = ({
  startX,
  startY,
  verticalLength,
  horizontalLength,
  color = 'black',
  strokeWidth = 1,
  dashArray = '5,5',
  upperVerticalOffsetX = 0,
  lowerVerticalOffsetX = 0

}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const path = svgElement.querySelector('path');
            path.classList.add('dashedLineAnimation');
            observer.disconnect(); // Stop observing after the animation has been triggered
          }
        });
      },
      {
        threshold: 0.8 // Trigger when at least 10% of the element is visible
      }
    );

    observer.observe(svgElement);

    return () => observer.disconnect();
  }, []);

  const pathData = `
    M${startX + upperVerticalOffsetX},${startY}
    L${startX + upperVerticalOffsetX},${startY + verticalLength}
    L${startX + horizontalLength},${startY + verticalLength}
    L${startX + horizontalLength + lowerVerticalOffsetX},${startY + verticalLength + verticalLength}
  `;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 230" // This ensures the SVG scales proportionally
      preserveAspectRatio="xMidYMid meet" // Preserves aspect ratio
    >
      {/* Path for the dashed line */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={dashArray}
      />
      {/* Hollow Circle at the start of the path */}
      <circle
        cx={startX + upperVerticalOffsetX}
        cy={startY}
        r={strokeWidth * 15}
        fill="white"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Hollow Circle at the end of the path */}
      <circle
        cx={startX + horizontalLength + lowerVerticalOffsetX}
        cy={startY + verticalLength + verticalLength}
        r={strokeWidth * 15}
        fill="white"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default DashedLine;
