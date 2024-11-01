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

/*-----------------------------------------------------------------------------------------------------------------------------*/

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const App: React.FC = () => {
//   const [data, setData] = useState<{ pm25: string; temperature: string; humidity: string; pressure: string } | null>(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get('http://localhost:8080/data');
//       setData(result.data);
//     };

//     const interval = setInterval(fetchData, 1000); // 每10秒獲取一次數據
//     fetchData(); // 初始獲取

//     return () => clearInterval(interval); // 清除定時器
//   }, []);

//   return (
//     <div className="App">
//       <h1>環境監測資料</h1>
//       {data ? (
//         <div className="data-container" style={{textAlign: 'left'}}>
//           <p>PM2.5: {data["pm25"]} µg/m³</p>
//           <p>溫度: {data["temperature"]} °C</p>
//           <p>濕度: {data["humidity"]} %</p>
//           <p>氣壓: {data["pressure"]} hPa</p>
//         </div>
//       ) : (
//         <p>加載中...</p>
//       )}
//     </div>
//   );
// };

// export default App;

/*---------------------------------------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [data, setData] = useState<{
    pm25: string;
    temperature: string;
    humidity: string;
    pressure: string;
  } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8080/data");
      setData(result.data);
    };

    const interval = setInterval(fetchData, 1000); // 每10秒獲取一次數據
    fetchData(); // 初始獲取

    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <div className="h-[calc(100vh-74px)] w-[calc(100vh-74px)]">
      <div className="h-1/12 w-full bg-gray-100 p-8 content-center mt-10 ml-5 mr-5 mb-5">
        <h1 className="text-5xl font-bold text-gray-700 mb-8">
          環境數據即時監測
        </h1>
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-full">
            <Card label="PM2.5" value={data["pm25"] + "µg/m³"} icon="🌫️" />
            <Card label="溫度" value={data["temperature"] + "°C"} icon="🌡️" />
            <Card label="濕度" value={data["humidity"] + "%"} icon="💧" />
            <Card label="氣壓" value={data["pressure"] + "hPa"} icon="🌍" />
          </div>
        ) : (
          <p>加載中...</p>
        )}
      </div>
    </div>
  );
};

// 卡片組件
const Card: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-lg font-medium text-gray-600">{label}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

export default App;
