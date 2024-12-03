import React, { useEffect, useState } from 'react';

interface AlertData {
  type: 'co2' | 'temperature' | 'humidity';
  value: number;
  threshold: number;
  unit: string;
}

interface AlertNotificationProps {
  data: {
    co2: string;
    temperature: string;
    humidity: string;
  };
  thresholds: {
    co2: number;
    temperature: number;
    humidity: number;
  };
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ data, thresholds }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    const newAlerts: AlertData[] = [];
    const co2Value = parseFloat(data.co2);
    const tempValue = parseFloat(data.temperature);
    const humValue = parseFloat(data.humidity);

    if (co2Value > thresholds.co2) {
      newAlerts.push({
        type: 'co2',
        value: co2Value,
        threshold: thresholds.co2,
        unit: 'PPM'
      });
    }

    if (tempValue > thresholds.temperature) {
      newAlerts.push({
        type: 'temperature',
        value: tempValue,
        threshold: thresholds.temperature,
        unit: '°C'
      });
    }

    if (humValue > thresholds.humidity) {
      newAlerts.push({
        type: 'humidity',
        value: humValue,
        threshold: thresholds.humidity,
        unit: '%'
      });
    }

    setAlerts(newAlerts);
  }, [data, thresholds]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.type}
          className="bg-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse"
          style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-semibold">
              {alert.type === 'co2' && 'CO2 濃度警告'}
              {alert.type === 'temperature' && '溫度警告'}
              {alert.type === 'humidity' && '濕度警告'}
            </span>
          </div>
          <p className="mt-1 text-sm">
            目前數值: {alert.value.toFixed(1)} {alert.unit}
            <br />
            警戒值: {alert.threshold} {alert.unit}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AlertNotification; 