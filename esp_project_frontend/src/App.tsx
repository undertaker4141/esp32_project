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
    co2: string;
    temperature: string;
    humidity: string;
  } | null>(null);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8080/latest");
      setData(result.data);
    };

    const interval = setInterval(fetchData, 1000); // 每秒獲取一次數據
    fetchData(); // 初始獲取

    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <div
      className="flex flex-col items-center p-8 bg-gray-100 min-h-screen min-w-screen relative"
      style={{
        cursor: "pointer",
        transition: "height 0.3s ease, transform 0.3s ease",
        backgroundImage: `url(https://upload-os-bbs.hoyolab.com/upload/2021/12/10/30037970/7a2e72628cb6fb66be516621d8ba8fd8_5759376416209384907.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70)`, // 設置背景圖
        backgroundSize: " cover", // 背景圖填滿卡片
        backgroundPosition: "center", // 背景圖居中
        backgroundRepeat: "no-repeat", // 禁止重複
      }}
    >
      <div className="flex items-center gap-4 mb-8">
        <img 
          src="https://s1.aigei.com/src/img/gif/2e/2e1f5e8e5ccd47dd9c7be9b488870637.gif?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:_z9Mvbd61s1Vj1cHa5XBwh4RgII=" 
          alt="裝飾" 
          className="h-24 w-24 object-contain"
        />
        <h1 className="text-5xl font-bold text-gray-700 bg-white bg-opacity-60 p-4 rounded-full">
          環境數據即時監測
        </h1>
      </div>
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          <Card
            label="CO2"
            value={`${data.co2} ppm`}
            icon="🌫️"
            imageUrl="https://upload-os-bbs.hoyolab.com/upload/2022/07/23/1015537/18b4931f296ebeb487138caf50e299e2_4057599565959593022.png"
            isExpanded={expandedCard === "CO2"}
            onClick={() => {
              setExpandedCard(expandedCard === "CO2" ? null : "CO2");
            }}
          />
          <Card
            label="溫度"
            value={`${data.temperature} °C`}
            icon="🌡️"
            imageUrl="https://p1-tt.byteimg.com/origin/pgc-image/2cd8d720e51343b283761bef9f64a9b8.jpg"
            isExpanded={expandedCard === "溫度"}
            onClick={() =>
              setExpandedCard(expandedCard === "溫度" ? null : "溫度")
            }
          />
          <Card
            label="濕度"
            value={`${data.humidity} %`}
            icon="💧"
            imageUrl="https://feeds-drcn.dbankcdn.cn/web/1051087fb9c49a818d74c3e_si_1340766/image/a0b1596c262c4db86b53d0c1e2d8ffd841515ec5_w640_h289"
            isExpanded={expandedCard === "濕度"}
            onClick={() =>
              setExpandedCard(expandedCard === "濕度" ? null : "濕度")
            }
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
const Card: React.FC<CardProps> = ({
  label,
  value,
  icon,
  imageUrl,
  isExpanded,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform w-64 h-48 hover:h-60 ${
      isExpanded
        ? "scale-110 z-10 shadow-2xl ring-4 ring-red-600"
        : "scale-100 hover:scale-105"
    }`}
    style={{
      cursor: "pointer",
      transition: "height 0.3s ease, transform 0.3s ease",
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="bg-white bg-opacity-80 p-4 rounded-lg flex flex-col items-center w-full">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-lg font-medium text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-800 min-w-[120px] text-center">{value}</div>
    </div>
  </div>
);

// 互動元件
const InteractiveWidget: React.FC = () => (
  <div className="absolute bottom-10 right-20 w-1/6 hover:w-1/4">
    <img
      src="https://upload-os-bbs.hoyolab.com/upload/2022/02/05/156411308/418cedadbafce76e46825c4ff61904e9_4788917243909065800.gif"
      alt="Interactive Widget"
      //className="w-full h-full object-cover rounded-full shadow-lg"
    />
  </div>
);

export default App;
