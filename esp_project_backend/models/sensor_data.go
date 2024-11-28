package models

import (
	"time"
)

type SensorData struct {
	ID          int64     `json:"id"`
	CO2         string    `json:"co2"`
	Temperature string    `json:"temperature"`
	Humidity    string    `json:"humidity"`
	CreatedAt   time.Time `json:"created_at"`
}
