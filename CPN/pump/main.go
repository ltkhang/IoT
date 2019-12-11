package main

import (
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/jinzhu/now"
	"gopkg.in/ini.v1"
	"os"
	"time"
)

var (
	MQTT_PORT = 1883
	MQTT_HOST = "localhost"
	POSTGRES_HOST = "localhost"
	POSTGRES_PORT = 5431
	POSTGRES_USER = "postgres"
	POSTGRES_PASS = "postgres"
	POSTGRES_DBNAME = "postgres"
	TOPIC = "/pump"
	DEFAULT_LEN_PAYLOAD = 4
	CLIENT_ID = "/pump"
	START = "/start"
	STOP = "/stop"
)

var (
	db *gorm.DB
	err error
)
type Schedule struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string `json:"mac"`
	Time string `json:"time"`
	Duration int `json:"duration"`
}
func subtractTime(time1,time2 time.Time) float64{
	diff := time1.Sub(time2).Seconds()
	return diff
}
func addTime(t time.Time, second int) time.Time {
	return t.Add(time.Duration(second) * time.Second)
}
func main() {
	fmt.Println("Smart Garden")
	fmt.Println("Pump Node service")
	fmt.Println("-------------------------------")
	fmt.Println("Load config file")
	cfg, err := ini.Load("config.ini")
	if err != nil {
		fmt.Printf("Fail to read file: %v", err)
		os.Exit(1)
	}
	MQTT_HOST = cfg.Section("").Key("LOCAL_MQTT_HOST").String()
	MQTT_PORT, _ = cfg.Section("").Key("LOCAL_MQTT_PORT").Int()
	POSTGRES_HOST = cfg.Section("").Key("POSTGRES_HOST").String()
	POSTGRES_PORT, _ = cfg.Section("").Key("POSTGRES_PORT").Int()
	POSTGRES_USER = cfg.Section("").Key("POSTGRES_USER").String()
	POSTGRES_PASS = cfg.Section("").Key("POSTGRES_PASS").String()
	POSTGRES_DBNAME = cfg.Section("").Key("POSTGRES_DBNAME").String()
	db, err = gorm.Open("postgres", fmt.Sprintf("host=%v port=%v user=%v dbname=%v password=%v sslmode=disable",
		POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DBNAME, POSTGRES_PASS))
	if err == nil {
		fmt.Println("Running.........")
		defer db.Close()
		db.AutoMigrate(&Schedule{})
		c := make(chan bool)
		//c := make(chan os.Signal, 1)
		//signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		opts := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%v:%v", MQTT_HOST, MQTT_PORT))
		opts.SetClientID(CLIENT_ID)
		client := mqtt.NewClient(opts)
		if token := client.Connect(); token.Wait() && token.Error() != nil {
			panic(token.Error())
		}
		pumpMap := make(map[string]bool)
		go func() {
			for _ = range time.Tick(time.Minute) {
				timeNow := time.Now()
				var schedules []Schedule
				db.Find(&schedules)
				for _, schedule := range schedules {
					fmt.Println(schedule)
					timeSchedule, err := now.Parse(schedule.Time)
					duration := schedule.Duration * 60
					if err == nil {
						if _, ok := pumpMap[schedule.Mac]; !ok {
							pumpMap[schedule.Mac] = false
						}
						if pumpMap[schedule.Mac] == false {
							if timeNow.After(timeSchedule) && timeNow.Before(addTime(timeSchedule, duration)) {
								client.Publish(TOPIC, 0, false, fmt.Sprintf("%v|1|%v|", schedule.Mac, duration))
								pumpMap[schedule.Mac] = true
							}
						} else {
							if timeNow.Before(timeSchedule) || timeNow.After(addTime(timeSchedule, duration)) {
								client.Publish(TOPIC, 0, false, fmt.Sprintf("%v|0|%v|", schedule.Mac, duration))
								pumpMap[schedule.Mac] = false
							}
						}


					}

				}
			}
		}()
		<-c
	} else {
		fmt.Println(err.Error())
	}
}
