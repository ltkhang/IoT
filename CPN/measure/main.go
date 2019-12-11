package main

import (
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gopkg.in/ini.v1"
	"os"
	"strconv"
	"strings"
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
	TOPIC = "/measure"
	DEFAULT_LEN_PAYLOAD = 4
	CLIENT_ID = "measure"
)

func ChangeMonthToNumber(month string) (monthNumber string) {
	switch month {
	case "January":
		monthNumber = "01"
	case "February":
		monthNumber = "02"
	case "March":
		monthNumber = "03"
	case "April":
		monthNumber = "04"
	case "May":
		monthNumber = "05"
	case "June":
		monthNumber = "06"
	case "July":
		monthNumber = "07"
	case "August":
		monthNumber = "08"
	case "September":
		monthNumber = "09"
	case "October":
		monthNumber = "10"
	case "November":
		monthNumber = "11"
	case "December":
		monthNumber = "12"
	}
	return monthNumber
}

func ConvertTimeToString(timeNum int) (timeS string) {
	if timeNum < 10 {
		return "0" + strconv.Itoa(timeNum)
	} else {
		return strconv.Itoa(timeNum)
	}
}

func TimeToTimeString(time time.Time) (timeS string) {
	return ConvertTimeToString(time.Hour()) + ":" + ConvertTimeToString(time.Minute()) + ":" + ConvertTimeToString(time.Second())
}

func TimeToDayString(time time.Time) (day string) {
	return ConvertTimeToString(time.Year()) + "-" + ChangeMonthToNumber(time.Month().String()) + "-" + ConvertTimeToString(time.Day())
}

var (
	db *gorm.DB
	err error
)

var f mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	topic := msg.Topic()
	payload := string(msg.Payload())
	if topic == TOPIC {
		fmt.Println(payload)
		data := strings.Split(payload, "|")
		if len(data) == DEFAULT_LEN_PAYLOAD {
			mac := data[0]
			temperatureStr := data[1]
			humidityStr := data[2]
			lightStr := data[3]
			temperature, _ := strconv.ParseFloat(temperatureStr, 64)
			humidity, _ := strconv.ParseFloat(humidityStr, 64)
			light, _ := strconv.ParseFloat(lightStr, 64)
			dt := time.Now()
			m := Measure{
				Mac:         mac,
				Time:       TimeToTimeString(dt),
				Date:        TimeToDayString(dt),
				Temperature: temperature,
				Humidity:    humidity,
				Air:       light,
				IsDeleted: 0,
			}
			db.Create(&m)
		}
	}

}


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
func main()  {
	fmt.Println("Smart Garden")
	fmt.Println("Measure Node service")
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
		db.AutoMigrate(&Measure{})
		//c := make(chan os.Signal, 1)
		//signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		c := make(chan bool)
		opts := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%v:%v", MQTT_HOST, MQTT_PORT))
		opts.SetClientID(CLIENT_ID)
		client := mqtt.NewClient(opts)
		if token := client.Connect(); token.Wait() && token.Error() != nil {
			panic(token.Error())
		}
		if token := client.Subscribe(TOPIC, 0, f); token.Wait() && token.Error() != nil {
			panic(token.Error())
		} else {

		}
		<-c
	} else {
		fmt.Println(err.Error())
	}
}
