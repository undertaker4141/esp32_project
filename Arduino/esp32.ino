#include <Wire.h>
#include <SensirionI2CScd4x.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <string>

// Define WiFi credentials
const char* ssid = "日月星辰";          
const char* password = "048925525";   

// Define server address (localhost)
const char* serverName = "http://192.168.84.237:8080/data"; 

SensirionI2CScd4x scd4x;

void setup() {
   Serial.begin(115200);
   while (!Serial) {
       delay(100); // Wait for the Serial Monitor to open
   }

   Wire.begin(); // Initialize I2C communication
   Serial.println("Initializing SCD4x...");

   // Initialize sensor - no return value, just attempt to initialize
   scd4x.begin(Wire);  // No need to check for error value here
  
   // Stop any ongoing periodic measurements
   scd4x.stopPeriodicMeasurement();  // No need to check error code

   // Perform a factory reset (optional but useful for troubleshooting)
   scd4x.performFactoryReset();  // No need to check error code
   Serial.println("Factory reset complete.");

   // Start periodic measurement
   scd4x.startPeriodicMeasurement();  // No need to check error code
   Serial.println("Periodic measurement started successfully.");

   // Connect to WiFi
   WiFi.begin(ssid, password);
   Serial.print("Connecting to WiFi");
  
   while (WiFi.status() != WL_CONNECTED) {
       Serial.print(".");
       delay(1000);
   }
   Serial.println("\nConnected to WiFi");
}

void loop() {
   uint16_t error;
   char errorMessage[256];

   // Wait for 5 seconds (SCD4x updates every 5 seconds in periodic mode)
   delay(5000);

   uint16_t co2 = 0;
   float temperature = 0.0f;
   float humidity = 0.0f;

   // Check if data is ready
   bool isDataReady = false;
   error = scd4x.getDataReadyFlag(isDataReady);  // Returns error code
   if (error) {
       errorToString(error, errorMessage, sizeof(errorMessage));
       Serial.print("Error checking data ready flag: ");
       Serial.println(errorMessage);
       return;
   }

   if (!isDataReady) {
       Serial.println("Data not ready yet, skipping...");
       return;
   }

   // Read the measurement data
   error = scd4x.readMeasurement(co2, temperature, humidity);  // Returns error code
   if (error) {
       errorToString(error, errorMessage, sizeof(errorMessage));
       Serial.print("Error reading measurement: ");
       Serial.println(errorMessage);
       return;
   }

   // Check for invalid samples (CO2 = 0 is an invalid reading)
   if (co2 == 0) {
       Serial.println("Invalid sample detected, skipping...");
       return;
   }

   // Print the results
   Serial.print("CO2: ");
   Serial.print(co2);
   Serial.print(" ppm\t");

   Serial.print("Temperature: ");
   Serial.print(temperature);
   Serial.print(" °C\t");

   Serial.print("Humidity: ");
   Serial.print(humidity);
   Serial.println(" %RH");

   // Send data to the server
   HTTPClient http;
  
   // Start the HTTP POST request
   http.begin(serverName);

   // Set the content type to JSON
   http.addHeader("Content-Type", "application/json");

   // Create a JSON payload
   String jsonData = "{";
   jsonData += "\"co2\":\"" + String(co2) + "\",";
   jsonData += "\"humidity\":\"" + String(humidity) + "\",";
   jsonData += "\"temperature\":\"" + String(temperature) + "\"";
   jsonData += "}";

   int httpResponseCode = http.POST(jsonData);
   // Send the HTTP POST request
  
  
   // Check the HTTP response
   if (httpResponseCode > 0) {
       Serial.print("HTTP Response code: ");
       Serial.println(httpResponseCode);
   } else {
       Serial.print("Error on sending POST request: ");
       Serial.println(httpResponseCode);
   }

   // End the HTTP request
   http.end();
}


