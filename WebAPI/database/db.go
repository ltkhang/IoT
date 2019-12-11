package database

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"iot_server/models"
)

var (
	DB *gorm.DB
	err error
)

func init() {
	DB, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=postgres password=postgres sslmode=disable")
	if err != nil {
		panic(err)
	}
	DB = DB.Debug()
	DB.AutoMigrate(&models.Measure{}, &models.Schedule{}, &models.Device{}, &models.MeasureBakup{})
	// Chua chay
	//var m1 []models.MeasureBakup
	//DB.Find(&m1)
	//for _, m := range m1 {
	//	DB.Create(&models.Measure{
	//		Mac:         m.Mac,
	//		Time:        m.Time,
	//		Date:        m.Date,
	//		Temperature: m.Temperature,
	//		Humidity:    m.Humidity,
	//		Air:         m.Air,
	//	})
	//}
//	rows, err1 := DB.Raw(`select m."date", m."time", m.mac, m.temperature, m.humidity, m.air from measures m
//group by m."date", m."time", m.mac, m.temperature, m.humidity, m.air
//order by m."date"`).Rows()
//	if err1 == nil {
//		var (
//			date string
//			time string
//			mac string
//			temperature float64
//			humidity float64
//			air float64
//		)
//		for rows.Next() {
//			err2 := rows.Scan(&date, &time, &mac, &temperature, &humidity, &air)
//			if err != nil {
//				fmt.Println(err2)
//			} else {
//				DB.Create(&models.MeasureBakup{
//					Mac:         mac,
//					Time:        time,
//					Date:        date,
//					Temperature: temperature,
//					Humidity:    humidity,
//					Air:         air,
//				})
//			}
//
//		}
//	}
	//
}
