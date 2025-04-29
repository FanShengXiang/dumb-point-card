import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pointsA, setPointsA] = useState([]);
  const [pointsB, setPointsB] = useState([]);
  // 判斷環境：開發(localhost) vs 上線(連render後端)
  const apiBase = process.env.NODE_ENV === 'development'
    ? 'http://localhost:6543'
    : 'https://dumb-point-card.onrender.com'; // 記得換成你的後端網址！

  // 一打開就從後端讀取點數
  useEffect(() => {
    fetch(`${apiBase}/pointsA`)
      .then(res => res.json())
      .then(data => {
        if (data === null) {
          setPointsA([]);
        } else {
          setPointsA(data);
        }
      })
      .catch(error => console.error('Error fetching pointsA:', error));
    
    fetch(`${apiBase}/pointsB`)
      .then(res => res.json())
      .then(data => {
        if (data === null) {
          setPointsB([]);
        } else {
          setPointsB(data);
        }
      })
      .catch(error => console.error('Error fetching pointsB:', error));

  }, []);

  // 點擊切換點數，同步更新後端
  const togglePointA = (index) => {
    const newPoints = [...pointsA];
    newPoints[index] = !newPoints[index];
    setPointsA(newPoints);

    fetch(`${apiBase}/pointsA`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: newPoints })
    })
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error updating points:', error));
  };

  const togglePointB = (index) => {
    const newPoints = [...pointsB];
    newPoints[index] = ! newPoints[index];
    setPointsB(newPoints);
    
    fetch(`${apiBase}/pointsB`,{
      method : 'POST',
      headers : {'Content-Type': 'application/json'},
      body : JSON.stringify({ points: newPoints })
    })
      .then(res=>res.json())
      .then(data=>console.log(data.message))
      .catch(error => console.error('Error updating points:', error))
  };

  

  return (
    <div className="App">
  <h1>萬阿寶</h1>
  <p>超雷次數：{pointsA.filter(Boolean).length} / {pointsA.length}</p>
  <div className="card">
    {pointsA.map((point, index) => (
      <div
        key={index}
        className={`point ${point ? 'activeA' : ''}`}
        onClick={() => togglePointA(index)}
      >
        {point ? '' : ''}
      </div>
    ))}
  </div>

  <h1>范阿寶</h1>
  <p>超雷次數：{pointsB.filter(Boolean).length} / {pointsB.length}</p>
  <div className="card">
    {pointsB.map((point, index) => (
      <div
        key={index}
        className={`point ${point ? 'activeB' : ''}`}
        onClick={() => togglePointB(index)}
      >
        {point ? '' : ''}
      </div>
    ))}
  </div>
</div>
  );
}

export default App;