import React, { useState, useRef } from 'react';
import TSPVisualizer from './components/TSPVIsualizer';
import TSPSolution from './components/TSPSolution';
import TSPMonteCarlo from './components/TSPMonteCarlo';
import TSPChart from './components/TSPChart';

function App() {
  const [points, setPoints] = useState([]);
  const [solution, setSolution] = useState([]);
  const [bestSolutionForVisualizer, setBestSolutionForVisualizer] = useState([]); 
  const [history, setHistory] = useState([]);

  return (
    <div className="App">
      <TSPVisualizer
        setPoints={setPoints}
        solution={bestSolutionForVisualizer} 
      />

      {points.length > 0 && (
        <>
          <TSPSolution points={points} solution={solution} />

          <TSPMonteCarlo
            points={points}
            solution={solution}
            setSolution={(newSol) => {
              setSolution(newSol);

              const newLength = newSol.reduce((sum, p, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return sum + Math.hypot(p.x - next.x, p.y - next.y);
              }, 0);

              setHistory(prev => [
                ...prev,
                { iteration: prev.length + 1, length: Number(newLength.toFixed(2)) }
              ]);

              const currentBestLength = bestSolutionForVisualizer.reduce((sum, p, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return sum + Math.hypot(p.x - next.x, p.y - next.y);
              }, 0);

              if (bestSolutionForVisualizer.length === 0 || newLength < currentBestLength) {
                setBestSolutionForVisualizer(newSol);
              }
            }}
          />

          <TSPChart history={history} />
        </>
      )}
    </div>
  );
}

export default App;
