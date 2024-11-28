package main

import (
	"esp_project_backend/db"
	"esp_project_backend/handlers"
	"log"
	"net/http"
)

func main() {
	// 初始化資料庫
	database := db.InitDB()
	defer database.Close()

	// 建立 handler
	sensorHandler := handlers.NewSensorHandler(database)

	// 設定路由
	http.HandleFunc("/data", sensorHandler.SaveSensorData)
	http.HandleFunc("/latest", sensorHandler.GetLatestSensorData)

	// 啟動伺服器
	log.Println("伺服器啟動於 :8080 端口")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
