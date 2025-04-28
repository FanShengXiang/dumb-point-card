import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);

  // 一開啟網頁，就從後端API讀取點數
  useEffect(() => {
    fetch('http://localhost:5000/points')
      .then(res => res.json())
      .then(data => {
        if (data === null) {
          setPoints([]);
        } else {
          setPoints(data);
        }
      })
      .catch(error => console.error('Error fetching points:', error));
  }, []);

  const togglePoint = (index) => {
    const newPoints = [...points];
    newPoints[index] = !newPoints[index];
    setPoints(newPoints);

    // 更新後端資料庫
    fetch('http://localhost:5000/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: newPoints })
    })
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error updating points:', error));
  };

  const collected = points.filter(Boolean).length;

  return (
    <div className="App">
      <h1>集點卡</h1>
      <p>已集點：{collected} / {points.length}</p>
      <div className="card">
        {points.map((point, index) => (
          <div
            key={index}
            className={`point ${point ? 'active' : ''}`}
            onClick={() => togglePoint(index)}
          >
            {point ? '✓' : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;