package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"iot_server/database"
	"iot_server/models"
)

type PumpController struct {
	beego.Controller
}

// @Param   token   header  string  true "auth token"
// @Param   type     query   string true       "pump type 0/1"
// @Param   mac     query   string true       "mac address"
// @Param   duration     query   string true       "duration"
// @router / [get]
func (c *PumpController) Get() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac  string
			duration string
			pumpType string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		_ = c.Ctx.Input.Bind(&duration, "duration")
		_ = c.Ctx.Input.Bind(&pumpType, "type")
		fmt.Println(deviceMac)
		c.Data["json"] = true
		command := models.Command{
			Action: "pump",
			Data:   fmt.Sprintf("%v|%v|%v|", deviceMac, pumpType, duration),
		}
		sentCommand, _ := json.Marshal(command)
		database.MQTTClient.Publish("/command", 0, false, string(sentCommand))
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}
