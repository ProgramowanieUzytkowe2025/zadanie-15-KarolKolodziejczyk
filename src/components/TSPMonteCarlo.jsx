import React, { useState, useRef, useEffect } from 'react';

const shufflePoints = (points) => {
  const arr = [...points];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const TSPMonteCarlo = ({ points, setSolution }) => {
  const [running, setRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  const intervalRef = useRef(null);

  const toggleRunning = () => setRunning(prev => !prev);

  useEffect(() => {
    if (running && points.length > 0) {
      intervalRef.current = setInterval(() => {
        setIterations(prev => prev + 1);
        const newSolution = shufflePoints(points);
        setSolution(newSolution); 
      }, 5000); 
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [running, points, setSolution]);

  return (
    <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
      <button onClick={toggleRunning}>{running ? 'Przerwa' : 'Szukaj rozwiązania'}</button>
      <span style={{ marginLeft: 20 }}>Iteracje: {iterations}</span>
    </div>
  );
};

export default TSPMonteCarlo;
