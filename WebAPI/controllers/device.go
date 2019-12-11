package controllers

import (
	"github.com/astaxie/beego"
	"iot_server/database"
	"iot_server/models"
)

type DeviceController struct {
	beego.Controller
}
// @Param   token   header  string  true "auth token"
// @Param   type     query   string true       "device type"
// @router / [get]
func (c *DeviceController) Get() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var deviceType string
		_ = c.Ctx.Input.Bind(&deviceType, "type")
		var devices []models.Device
		database.DB.Where("type = ?", deviceType).Where("deleted = ?", 0).Find(&devices)
		c.Data["json"] = devices
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}

// @Param   token   header  string  true "auth token"
// @Param   mac     query   string true       "mac address"
// @Param   name     query   string true       "device name"
// @Param	type	query	string true	"device type"

// @router / [post]
func (c *DeviceController) Post() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
			deviceName string
			deviceType string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		_ = c.Ctx.Input.Bind(&deviceName, "name")
		_ = c.Ctx.Input.Bind(&deviceType, "type")
		database.DB.Create(&models.Device{
			Name:    deviceName,
			Mac:     deviceMac,
			Type:    deviceType,
			Deleted: 0,
		})
		c.Data["json"] = true
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}

// @Param   token   header  string  true "auth token"
// @Param   mac     query   string true       "mac address"
// @Param	type	query	string true	"device type"
// @router / [delete]
func (c *DeviceController) Delete() {
	token := c.Ctx.Request.Header.Get("token")
	if token == beego.AppConfig.String("token") {
		var (
			deviceMac string
			deviceType string
		)
		_ = c.Ctx.Input.Bind(&deviceMac, "mac")
		_ = c.Ctx.Input.Bind(&deviceType, "type")
		database.DB.Model(&models.Device{}).Where("mac  = ? AND type = ?", deviceMac, deviceType).Update("deleted", 1)
		c.Data["json"] = true
		c.ServeJSON()
	} else {
		c.Ctx.ResponseWriter.WriteHeader(401)
	}
}
