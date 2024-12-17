#include <WiFi.h>
#include <HTTPClient.h>

// WiFi 設定
const char* ssid = "CHT Wi-Fi Home_2.4Ghz";
const char* password = "password";

// 後端 API URL
const char* serverName = "http://192.168.1.101:8080/data"; // 替換成你的伺服器 IP

void setup() {
  Serial.begin(115200);

  // 初始化 WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("正在連接到 WiFi...");
  }
  Serial.println("WiFi 已連接");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 模擬數據 (將數據轉為字串格式)
    String co2 = String(random(400, 2000) + random(0, 100) / 100.0, 1); // 模擬 CO2 濃度 (ppm)
    String temperature = String(random(15, 30) + random(0, 100) / 100.0, 1); // 模擬溫度數據
    String humidity = String(random(30, 80) + random(0, 100) / 100.0, 1);    // 模擬濕度數據

    Serial.println("模擬數據產生:");
    Serial.print("co2: ");
    Serial.print(co2);
    Serial.print(" µg/m³, 溫度: ");
    Serial.print(temperature);
    Serial.print(" °C, 濕度: ");
    Serial.print(humidity);

    // 發送模擬數據到後端
    sendSensorData(co2, temperature, humidity);
  } else {
    Serial.println("WiFi 連接中斷，重新連接...");
    WiFi.reconnect();
  }
  
  delay(5000); // 每5秒更新一次
}

// 發送數據到伺服器
void sendSensorData(String co2, String temp, String hum) {
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  // 組成符合格式的 JSON 字串
  String jsonData = "{";
  jsonData += "\"co2\":\"" + co2 + "\",";
  jsonData += "\"humidity\":\"" + hum + "\",";
  jsonData += "\"temperature\":\"" + temp + "\"";
  jsonData += "}";

  int httpResponseCode = http.POST(jsonData);

  if (httpResponseCode > 0) {
    Serial.print("\nHTTP 回應代碼: ");
    Serial.println(httpResponseCode);
    Serial.println("數據已發送成功");
  } else {
    Serial.print("\n發送失敗, HTTP 回應代碼: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}