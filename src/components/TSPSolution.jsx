import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const calculateDistance = (points) => {
  if (!points || points.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += Math.hypot(points[i].x - points[i+1].x, points[i].y - points[i+1].y);
  }
  total += Math.hypot(points[points.length-1].x - points[0].x, points[points.length-1].y - points[0].y);
  return total;
};

// forwardRef, żeby expose'ować hook do Visualizera
const TSPSolution = forwardRef(({ points, solution }, ref) => {
  const [bestSolution, setBestSolution] = useState([]);
  const [bestDistance, setBestDistance] = useState(0);

  useEffect(() => {
    if (!points || points.length === 0) return;

    if (bestSolution.length === 0) {
      const initial = solution && solution.length > 0 ? solution : [...points].sort(() => Math.random() - 0.5);
      setBestSolution(initial);
      setBestDistance(calculateDistance(initial));
    }
  }, [points]);

  useEffect(() => {
    if (!solution || solution.length === 0) return;

    const newDist = calculateDistance(solution);
    if (bestDistance === 0 || newDist < bestDistance) {
      setBestSolution(solution);
      setBestDistance(newDist);
    }
  }, [solution, bestDistance]);

  // expose hook dla Visualizera
  useImperativeHandle(ref, () => ({
    getBestSolution: () => bestSolution
  }));

  return (
    <div style={{ padding: 10, border: '1px solid #ccc', marginTop: 20 }}>
      <h2>Rozwiązanie</h2>
      {bestSolution.length > 0 ? (
        <>
          <p><strong>Trasa:</strong> {bestSolution.map((p, i) => (
            <span key={p.id}>{p.id}{i < bestSolution.length - 1 ? ' -> ' : ''}</span>
          ))}</p>
          <p><strong>Długość ścieżki:</strong> {bestDistance.toFixed(2)}</p>
        </>
      ) : (
        <p>Brak punktów do wyświetlenia</p>
      )}
    </div>
  );
});

export default TSPSolution;
