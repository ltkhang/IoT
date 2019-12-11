package main

import (
	"github.com/astaxie/beego"
	_ "iot_server/database"
	_ "iot_server/routers"
)

func main() {
	beego.Run()
}
