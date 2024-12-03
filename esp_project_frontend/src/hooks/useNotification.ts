import { useRef, useCallback } from 'react';

interface NotificationThresholds {
  co2: number;
  temperature: number;
  humidity: number;
}

interface NotificationTimers {
  co2: number;
  temperature: number;
  humidity: number;
}

const DEFAULT_THRESHOLDS: NotificationThresholds = {
  co2: 1995,        // PPM
  temperature: 29.5,   // °C
  humidity: 76.7      // %
};

const NOTIFICATION_COOLDOWN = 30000; // 30秒冷卻時間

const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const useNotification = () => {
  const lastNotificationTime = useRef<NotificationTimers>({
    co2: 0,
    temperature: 0,
    humidity: 0
  });

  const requestPermission = useCallback(async () => {
    try {
      if (!('Notification' in window)) {
        console.error('此瀏覽器不支援系統通知');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      const permission = await Notification.requestPermission();
      console.log('通知權限狀態:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      return false;
    }
  }, []);

  const canSendNotification = (type: keyof NotificationTimers) => {
    const now = Date.now();
    const lastTime = lastNotificationTime.current[type];
    return now - lastTime >= NOTIFICATION_COOLDOWN;
  };

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    try {
      if (Notification.permission !== 'granted') {
        console.log('通知權限未授予');
        return;
      }

      const notification = new Notification(title, {
        icon: 'https://yuanshen.site/docs/imgs/common/logo/logo_256.png',
        badge: 'https://yuanshen.site/docs/imgs/common/logo/logo_256.png',
        requireInteraction: true,
        ...options,
        body: `${options?.body}\n\n檢測時間: ${formatTime()}`
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log('通知已發送:', title);
    } catch (error) {
      console.error('發送通知失敗:', error);
    }
  }, []);

  const checkThresholds = useCallback((
    data: { co2: string; temperature: string; humidity: string },
    thresholds: NotificationThresholds = DEFAULT_THRESHOLDS
  ) => {
    try {
      console.log('收到的數據:', data);
      
      const co2Value = parseFloat(data.co2);
      const tempValue = parseFloat(data.temperature);
      const humidityValue = parseFloat(data.humidity);

      console.log('解析後的數值:', { co2Value, tempValue, humidityValue });
      console.log('閾值:', thresholds);

      if (!isNaN(co2Value) && co2Value > thresholds.co2 && canSendNotification('co2')) {
        lastNotificationTime.current.co2 = Date.now();
        sendNotification('CO2 濃度警告', {
          body: `目前 CO2 濃度 (${co2Value.toFixed(1)} PPM) 已超過警戒值 ${thresholds.co2} PPM`
        });
      }

      if (!isNaN(tempValue) && tempValue > thresholds.temperature && canSendNotification('temperature')) {
        lastNotificationTime.current.temperature = Date.now();
        sendNotification('溫度警告', {
          body: `目前溫度 (${tempValue.toFixed(1)} °C) 已超過警戒值 ${thresholds.temperature} °C`
        });
      }

      if (!isNaN(humidityValue) && humidityValue > thresholds.humidity && canSendNotification('humidity')) {
        lastNotificationTime.current.humidity = Date.now();
        sendNotification('濕度警告', {
          body: `目前濕度 (${humidityValue.toFixed(1)} %) 已超過警戒值 ${thresholds.humidity} %`
        });
      }
    } catch (error) {
      console.error('檢查閾值時發生錯誤:', error);
    }
  }, [sendNotification]);

  return {
    requestPermission,
    sendNotification,
    checkThresholds
  };
}; 