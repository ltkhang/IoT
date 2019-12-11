// @APIVersion 1.0.0
// @Title beego Test API
// @Description beego has a very cool tools to autogenerate documents for your API
// @Contact astaxie@gmail.com
// @TermsOfServiceUrl http://beego.me/
// @License Apache 2.0
// @LicenseUrl http://www.apache.org/licenses/LICENSE-2.0.html
package routers

import (
	"github.com/astaxie/beego"
	"iot_server/controllers"
)

func init() {
	beego.Router("/device", &controllers.DeviceController{})
	beego.Router("/schedule", &controllers.ScheduleController{})
	beego.Router("/data", &controllers.DataController{})
	beego.Router("/last_data", &controllers.MeasureController{})
	beego.Router("/pump", &controllers.PumpController{})
}
