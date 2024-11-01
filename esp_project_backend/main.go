package main

import (
	"net/http"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var dataStore = struct {
	sync.RWMutex
	Data map[string]string
}{Data: make(map[string]string)}

func main() {
	router := gin.Default()

	// 設定 CORS 中間件
	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,                               // 允許所有來源
		AllowMethods:    []string{"GET", "POST"},            // 允許的方法
		AllowHeaders:    []string{"Origin", "Content-Type"}, // 允許的標頭
	}))

	router.POST("/data", handleData)
	router.GET("/data", getData)

	router.Run(":8080")
}

func handleData(c *gin.Context) {
	var data map[string]string
	if err := c.ShouldBindJSON(&data); err == nil {
		dataStore.Lock()
		dataStore.Data = data
		dataStore.Unlock()
		c.JSON(http.StatusOK, gin.H{"status": "success"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
	}
}

func getData(c *gin.Context) {
	dataStore.RLock()
	c.JSON(http.StatusOK, dataStore.Data)
	dataStore.RUnlock()
}
