package main

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gopkg.in/ini.v1"
	"os"
	"time"
)

var (
	REMOTE_MQTT_PORT = 1884
	REMOTE_MQTT_HOST = "localhost"

	LOCAL_MQTT_PORT = 1883
	LOCAL_MQTT_HOST = "localhost"

	POSTGRES_HOST = "localhost"
	POSTGRES_PORT = 5431
	POSTGRES_USER = "postgres"
	POSTGRES_PASS = "postgres"
	POSTGRES_DBNAME = "postgres"

	CLIENT_ID = "cpn"

	REMOTE_TOPIC = "/command"

	PUMP_TOPIC = "/pump"

	DATA_TOPIC = "/data"
)

var (
	db *gorm.DB
	err error
)

type Measure struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string `json:"mac"`
	Time string `json:"time"`
	Date string `json:"date"`
	Temperature float64 `json:"temperature"`
	Humidity float64 `json:"humidity"`
	Air float64 `json:"air"`
	IsDeleted int `json:"is_deleted"`
}
type Schedule struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string `json:"mac"`
	Time string `json:"time"`
	Duration int `json:"duration"`
}

type Command struct {
	Action string `json:"action"`
	Data string	`json:"data"`
}


func main() {
	fmt.Println("Smart Garden")
	fmt.Println("Central Processing Node service")
	fmt.Println("-------------------------------")
	fmt.Println("Load config file")
	cfg, err := ini.Load("config.ini")
	if err != nil {
		fmt.Printf("Fail to read file: %v", err)
		os.Exit(1)
	}
	LOCAL_MQTT_HOST = cfg.Section("").Key("LOCAL_MQTT_HOST").String()
	LOCAL_MQTT_PORT, _ = cfg.Section("").Key("LOCAL_MQTT_PORT").Int()
	REMOTE_MQTT_HOST = cfg.Section("").Key("REMOTE_MQTT_HOST").String()
	REMOTE_MQTT_PORT, _ = cfg.Section("").Key("REMOTE_MQTT_PORT").Int()
	POSTGRES_HOST = cfg.Section("").Key("POSTGRES_HOST").String()
	POSTGRES_PORT, _ = cfg.Section("").Key("POSTGRES_PORT").Int()
	POSTGRES_USER = cfg.Section("").Key("POSTGRES_USER").String()
	POSTGRES_PASS = cfg.Section("").Key("POSTGRES_PASS").String()
	POSTGRES_DBNAME = cfg.Section("").Key("POSTGRES_DBNAME").String()

	db, err = gorm.Open("postgres", fmt.Sprintf("host=%v port=%v user=%v dbname=%v password=%v sslmode=disable",
		POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DBNAME, POSTGRES_PASS))
	db = db.Debug()
	if err == nil {
		fmt.Println("Running.........")
		defer db.Close()
		db.AutoMigrate(&Measure{}, &Schedule{})
		c := make(chan bool)
		//signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		opts := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%v:%v", LOCAL_MQTT_HOST, LOCAL_MQTT_PORT))
		opts.SetClientID(CLIENT_ID + "_local")
		local := mqtt.NewClient(opts)
		if token := local.Connect(); token.Wait() && token.Error() != nil {
			panic(token.Error())
		}
		opts1 := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%v:%v", REMOTE_MQTT_HOST, REMOTE_MQTT_PORT))
		opts.SetClientID(CLIENT_ID + "_remote")
		remote := mqtt.NewClient(opts1)
		if token := remote.Connect(); token.Wait() && token.Error() != nil {
			panic(token.Error())
		}
		if token := remote.Subscribe(REMOTE_TOPIC, 0, func(client mqtt.Client, message mqtt.Message) {
			topic := message.Topic()
			payload := message.Payload()
			var command Command
			if topic == REMOTE_TOPIC {
				err := json.Unmarshal(payload, &command)
				if err == nil {
					switch command.Action {
					case "pump":
						local.Publish(PUMP_TOPIC, 0, false, command.Data)
						fmt.Println("publish pump", command.Data)
					case "schedule":
						schedules := make([]Schedule, 0)
						err = json.Unmarshal([]byte(command.Data), &schedules)
						if err == nil {
							macMap := make(map[string]bool)
							for _, schedule := range schedules {
								if _, ok := macMap[schedule.Mac]; !ok {
									macMap[schedule.Mac] = false
								}
								if macMap[schedule.Mac] == false {
									db.Where("mac = ?", schedule.Mac).Delete(Schedule{})
									macMap[schedule.Mac] = true
								}
								db.Create(&schedule)
							}
						}
					}
				}
			}
		}); token.Wait() && token.Error() != nil {
			panic(token.Error())
		} else {

		}

		for _ = range time.Tick(10 * time.Minute) {
			var measures []Measure
			db.Find(&measures).Where("is_deleted = 0")
			sentData, err := json.Marshal(measures)
			if err == nil {
				remote.Publish(DATA_TOPIC, 0, false, string(sentData))
				for _, measure := range measures {
					measure.IsDeleted = 1
					db.Save(measure)
				}
			}
		}
		<-c
	} else {
		fmt.Println(err.Error())
	}
}
