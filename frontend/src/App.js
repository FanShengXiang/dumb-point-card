import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);
  
  // 判斷環境：開發(localhost) vs 上線(連render後端)
  const apiBase = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://dumb-point-card.onrender.com'; // 記得換成你的後端網址！

  // 一打開就從後端讀取點數
  useEffect(() => {
    fetch(`${apiBase}/points`)
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

  // 點擊切換點數，同步更新後端
  const togglePoint = (index) => {
    const newPoints = [...points];
    newPoints[index] = !newPoints[index];
    setPoints(newPoints);

    fetch(`${apiBase}/points`, {
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