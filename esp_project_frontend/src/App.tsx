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

/*UI初步美化版*/
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";

// const App: React.FC = () => {
//   const [data, setData] = useState<{
//     pm25: string;
//     temperature: string;
//     humidity: string;
//     pressure: string;
//   } | null>(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get("http://localhost:8080/data");
//       setData(result.data);
//     };

//     const interval = setInterval(fetchData, 1000); // 每10秒獲取一次數據
//     fetchData(); // 初始獲取

//     return () => clearInterval(interval); // 清除定時器
//   }, []);

//   return (
//     <div className="h-[calc(100vh-74px)] w-[calc(100vh-74px)]">
//       <div className="h-1/12 w-full bg-gray-100 p-8 content-center mt-10 ml-5 mr-5 mb-5">
//         <h1 className="text-5xl font-bold text-gray-700 mb-8">
//           環境數據即時監測
//         </h1>
//         {data ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-full">
//             <Card label="PM2.5" value={data["pm25"] + "µg/m³"} icon="🌫️" />
//             <Card label="溫度" value={data["temperature"] + "°C"} icon="🌡️" />
//             <Card label="濕度" value={data["humidity"] + "%"} icon="💧" />
//             <Card label="氣壓" value={data["pressure"] + "hPa"} icon="🌍" />
//           </div>
//         ) : (
//           <p>加載中...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // 卡片組件
// const Card: React.FC<{ label: string; value: string; icon: string }> = ({
//   label,
//   value,
//   icon,
// }) => (
//   <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
//     <div className="text-4xl mb-2">{icon}</div>
//     <div className="text-lg font-medium text-gray-600">{label}</div>
//     <div className="text-2xl font-bold text-gray-800">{value}</div>
//   </div>
// );

// export default App;

/*---------------------------------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface CardProps {
    label: string;
    value: string;
    icon: string;
    imageUrl: string; // 添加圖片屬性
    isExpanded: boolean;
    onClick: () => void;
  }

const App: React.FC = () => {
  const [data, setData] = useState<{
    pm25: string;
    temperature: string;
    humidity: string;
    pressure: string;
  } | null>(null);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen relative" style={{
        cursor: "pointer",
        transition: "height 0.3s ease, transform 0.3s ease",
        backgroundImage: `url(https://upload-os-bbs.hoyolab.com/upload/2021/12/10/30037970/7a2e72628cb6fb66be516621d8ba8fd8_5759376416209384907.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70)`, // 設置背景圖
        backgroundSize: "cover", // 背景圖填滿卡片
        backgroundPosition: "center", // 背景圖居中
        backgroundRepeat: "no-repeat", // 禁止重複
      }}>
      <h1 className="text-5xl font-bold text-gray-700 mb-8">
        環境數據即時監測
      </h1>
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          label="PM2.5"
          value={`${data.pm25} µg/m³`}
          icon="🌫️"
          imageUrl="https://upload-os-bbs.hoyolab.com/upload/2022/07/23/1015537/18b4931f296ebeb487138caf50e299e2_4057599565959593022.png"
          isExpanded={expandedCard === "PM2.5"}
          onClick={() => setExpandedCard(expandedCard === "PM2.5" ? null : "PM2.5")}
        />
        <Card
          label="溫度"
          value={`${data.temperature} °C`}
          icon="🌡️"
          imageUrl="https://p1-tt.byteimg.com/origin/pgc-image/2cd8d720e51343b283761bef9f64a9b8.jpg"
          isExpanded={expandedCard === "溫度"}
          onClick={() => setExpandedCard(expandedCard === "溫度" ? null : "溫度")}
        />
        <Card
          label="濕度"
          value={`${data.humidity} %`}
          icon="💧"
          imageUrl="https://feeds-drcn.dbankcdn.cn/web/1051087fb9c49a818d74c3e_si_1340766/image/a0b1596c262c4db86b53d0c1e2d8ffd841515ec5_w640_h289"
          isExpanded={expandedCard === "濕度"}
          onClick={() => setExpandedCard(expandedCard === "濕度" ? null : "濕度")}
        />
        <Card
          label="氣壓"
          value={`${data.pressure} hPa`}
          icon="🌍"
          imageUrl="https://lh3.googleusercontent.com/L7tcFXgGAdQrT1YOq0_AdicO7yiZHorVdrAX_hj7ORjh80WhZ_SCgN3qlgz5_eafN-vlImexWH25dOm01YYlUeKynLQidLaDMUxSupk2TNkuJQ=s0"
          isExpanded={expandedCard === "氣壓"}
          onClick={() => setExpandedCard(expandedCard === "氣壓" ? null : "氣壓")}
        />
      </div>
      ) : (
        <p>加載中...</p>
      )}
      <InteractiveWidget />
    </div>
  );
};

// 卡片組件
const Card: React.FC<CardProps> = ({ label, value, icon, imageUrl, isExpanded, onClick }) => (
    <div
      onClick={onClick}
      className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform ${
        isExpanded ? "fixed top-1/3 left-1/2 transform -translate-x-1/2 w-1/2 h-auto z-50" : "scale-100 h-48 hover:row-span-2 hover:h-72" }`}
      style={{
        cursor: "pointer",
        transition: "height 0.3s ease, transform 0.3s ease",
        backgroundImage: `url(${imageUrl})`, // 設置背景圖
        backgroundSize: "cover", // 背景圖填滿卡片
        backgroundPosition: "center", // 背景圖居中
        backgroundRepeat: "no-repeat", // 禁止重複
      }}
    >
      {/* 半透明背景遮罩，提升文字對比度 */}
      <div className="bg-white bg-opacity-80 p-4 rounded-lg flex flex-col items-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-lg font-medium text-gray-600">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );

// 互動元件
const InteractiveWidget: React.FC = () => (
  <div className="absolute bottom-10 right-25 w-1/6 hover:w-">
    <img
      src="https://i.imgur.com/SUtTFrP.gif"
      alt="Interactive Widget"
      className="w-full h-full object-cover rounded-full shadow-lg"
    />
  </div>
);

export default App;
