// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState<{ pm25: string; temperature: string; humidity: string; pressure: string } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8080/data');
      setData(result.data);
    };

    const interval = setInterval(fetchData, 1000); // 每10秒獲取一次數據
    fetchData(); // 初始獲取

    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <div className="App">
      <h1>環境監測資料</h1>
      {data ? (
        <div className="data-container" style={{textAlign: 'left'}}>
          <p>PM2.5: {data["pm25"]} µg/m³</p>
          <p>溫度: {data["temperature"]} °C</p>
          <p>濕度: {data["humidity"]} %</p>
          <p>氣壓: {data["pressure"]} hPa</p>
        </div>
      ) : (
        <p>加載中...</p>
      )}
    </div>
  );
};

export default App;
