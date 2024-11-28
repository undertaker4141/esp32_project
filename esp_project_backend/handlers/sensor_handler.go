package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type SensorHandler struct {
	db *sql.DB
}

func NewSensorHandler(db *sql.DB) *SensorHandler {
	return &SensorHandler{db: db}
}

func (h *SensorHandler) SaveSensorData(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "只支援 POST 方法", http.StatusMethodNotAllowed)
		return
	}

	// 解析 JSON 請求
	var data struct {
		CO2         string `json:"co2"`
		Temperature string `json:"temperature"`
		Humidity    string `json:"humidity"`
	}

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "無效的 JSON 格式", http.StatusBadRequest)
		return
	}

	// 插入資料
	_, err = h.db.Exec(`
		INSERT INTO sensor_data (co2, temperature, humidity)
		VALUES (?, ?, ?)
	`, data.CO2, data.Temperature, data.Humidity)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "資料儲存成功",
	})
}

func (h *SensorHandler) GetLatestSensorData(w http.ResponseWriter, r *http.Request) {
	// 添加 CORS 標頭
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "只支援 GET 方法", http.StatusMethodNotAllowed)
		return
	}

	var data struct {
		CO2         string `json:"co2"`
		Temperature string `json:"temperature"`
		Humidity    string `json:"humidity"`
	}

	// 查詢最新的感測器數據
	row := h.db.QueryRow(`
		SELECT co2, temperature, humidity
		FROM sensor_data
		ORDER BY created_at DESC
		LIMIT 1
	`)

	err := row.Scan(&data.CO2, &data.Temperature, &data.Humidity)
	if err != nil {
		if err == sql.ErrNoRows {
			// 如果沒有數據，返回預設值
			data = struct {
				CO2         string `json:"co2"`
				Temperature string `json:"temperature"`
				Humidity    string `json:"humidity"`
			}{
				CO2:         "0",
				Temperature: "0",
				Humidity:    "0",
			}
		} else {
			http.Error(w, "無法取得數據", http.StatusInternalServerError)
			return
		}
	}

	json.NewEncoder(w).Encode(data)
}
