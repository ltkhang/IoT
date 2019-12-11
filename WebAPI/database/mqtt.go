package database

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"iot_server/models"
)

var (
	MQTTClient mqtt.Client
)

const (
	CLIENT_ID = "iot_server"
	MQTT_HOST = "localhost"
	MQTT_PORT = 1884
)

func init() {
	opts := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%v:%v", MQTT_HOST, MQTT_PORT))
	opts.SetClientID(CLIENT_ID)
	MQTTClient = mqtt.NewClient(opts)
	if token := MQTTClient.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	MQTTClient.Subscribe("/data", 0, func(client mqtt.Client, message mqtt.Message) {
		var measures []models.Measure
		err := json.Unmarshal(message.Payload(), &measures)
		if err == nil {
			for _, measure := range measures {
				DB.Create(&models.Measure{
					Mac:         measure.Mac,
					Time:        measure.Time,
					Date:        measure.Date,
					Temperature: measure.Temperature,
					Humidity:   	measure.Humidity,
					Air:         measure.Air,
				})
			}
			fmt.Println("Receive data from CPN")
		} else {
			fmt.Println(err.Error())
		}
	})
}