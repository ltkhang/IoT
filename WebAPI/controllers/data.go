package controllers

import (
	"github.com/astaxie/beego"
	"iot_server/database"
	"iot_server/models"
)

type DataController struct {
	beego.Controller
}

type MeasureController struct {
	beego.Controller
}

func (c *MeasureController) Get() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		var data []models.Measure
		database.DB.Where("mac = ?", deviceMac).Last(&data)

		c.Data["json"] = data
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}

// @Param   token   header  string  true "auth token"
// @router / [get]
func (c *DataController) Get() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
			dateFrom string
			dateTo string
			timeFrom string
			timeTo string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		_ = c.Ctx.Input.Bind(&dateFrom, "date_from")
		_ = c.Ctx.Input.Bind(&dateTo, "date_to")
		_ = c.Ctx.Input.Bind(&timeFrom, "time_from")
		_ = c.Ctx.Input.Bind(&timeTo, "time_to")
		var data []models.Measure
		database.DB.Where("date >= ? AND date <= ?", dateFrom, dateTo).Where("time >= ? AND time <= ?", timeFrom, timeTo).Find(&data)

		c.Data["json"] = data
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}
