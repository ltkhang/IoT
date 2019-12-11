package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"iot_server/database"
	"iot_server/models"
)

type ScheduleController struct {
	beego.Controller
}

// @Param   token   header  string  true "auth token"
// @router / [get]
func (c *ScheduleController) Get() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		var schedules []models.Schedule
		database.DB.Where("mac = ?", deviceMac).Find(&schedules)
		c.Data["json"] = schedules
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}

// @Param   token   header  string  true "auth token"
// @router / [post]
func (c *ScheduleController) Post() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
		)
		body := make([]map[string]interface{}, 0)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		_ = json.Unmarshal(c.Ctx.Input.RequestBody, &body)
		database.DB.Delete(&models.Schedule{}).Where("mac = ?", deviceMac)
		schedules := make([]models.Schedule, 0)
		for _, item := range body {
			data := models.Schedule{
				Mac:      deviceMac,
				Time:     item["time"].(string),
				Duration: int(item["duration"].(float64)),
			}
			database.DB.Create(&data)
			schedules = append(schedules, data)
		}
		sentData, _ := json.Marshal(schedules)
		command := models.Command{
			Action: "schedule",
			Data:   string(sentData),
		}
		sentCommand, _ := json.Marshal(command)
		database.MQTTClient.Publish("/command", 0, false, string(sentCommand))
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}
