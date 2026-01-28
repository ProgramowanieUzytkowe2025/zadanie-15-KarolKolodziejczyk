import React, { useState, useRef, useEffect } from 'react';
import berlin52 from '../data/berlin52.tsp?raw';

const TSPVisualizer = ({ setPoints: setAppPoints, solution }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionToDraw, setSolutionToDraw] = useState([]);
  const canvasRef = useRef(null);

  const parseTSPFile = (content) => {
    const lines = content.replace(/\r/g, '').replace(/^\uFEFF/, '').split('\n');
    const points = [];
    let inSection = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('NODE_COORD_SECTION')) {
        inSection = true;
        continue;
      }
      if (trimmed === 'EOF') break;
      if (inSection && trimmed) {
        const [id, x, y] = trimmed.split(/\s+/).map(Number);
        if (!Number.isNaN(id) && !Number.isNaN(x) && !Number.isNaN(y)) {
          points.push({ id, x, y });
        }
      }
    }
    return points;
  };

  const normalizePoints = (points, width, height, padding = 50) => {
    if (!points || points.length === 0) return [];
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const scaleX = (width - 2 * padding) / (maxX - minX);
    const scaleY = (height - 2 * padding) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);
    return points.map(p => ({
      ...p,
      nx: padding + (p.x - minX) * scale,
      ny: padding + (p.y - minY) * scale
    }));
  };

  const drawPoints = (normalizedPoints) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    normalizedPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.nx, p.ny, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#007bff';
      ctx.fill();
      ctx.strokeStyle = '#003f7f';
      ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(p.id, p.nx, p.ny - 8);
    });

    if (showSolution && solutionToDraw && solutionToDraw.length > 0) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < solutionToDraw.length; i++) {
        const p = normalizedPoints.find(pt => pt.id === solutionToDraw[i].id);
        if (!p) continue;
        if (i === 0) ctx.moveTo(p.nx, p.ny);
        else ctx.lineTo(p.nx, p.ny);
      }
      const first = normalizedPoints.find(pt => pt.id === solutionToDraw[0].id);
      if (first) ctx.lineTo(first.nx, first.ny);
      ctx.stroke();
    }
  };

  const loadExampleFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(berlin52);
      const content = await response.text();
      const parsedPoints = parseTSPFile(content);
      if (parsedPoints.length === 0) throw new Error('Nie znaleziono punktów w pliku TSP');
      setPoints(parsedPoints);
      if (setAppPoints) setAppPoints(parsedPoints);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSolution && solution && solution.length > 0) {
      setSolutionToDraw(solution);
    }
  }, [solution, showSolution]);

  useEffect(() => {
    if (!points.length || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const normalized = normalizePoints(points, canvas.width, canvas.height);
    drawPoints(normalized);
  }, [points, solutionToDraw, showSolution]);

  return (
    <div className="tsp-visualizer">
      <h2>Wizualizacja TSP</h2>
      {loading && <p>Wczytywanie...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {points.length > 0 && <p>Wczytano <strong>{points.length}</strong> punktów</p>}

      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #ccc', marginTop: 10 }} />

      <br />
      <button onClick={loadExampleFile} disabled={loading}>Wczytaj berlin52.tsp</button>
      <button
        style={{ marginLeft: 10 }}
        onClick={() => setShowSolution(prev => !prev)}
        disabled={points.length === 0 || !solution || solution.length === 0}
      >
        {showSolution ? 'Ukryj rozwiązanie' : 'Pokaż rozwiązanie'}
      </button>
    </div>
  );
};

export default TSPVisualizer;
