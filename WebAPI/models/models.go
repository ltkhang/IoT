package models

type Measure struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string `json:"mac"`
	Time string	`json:"time"`
	Date string	`json:"date"`
	Temperature float64 `json:"temperature"`
	Humidity float64 `json:"humidity"`
	Air float64 `json:"air"`
}

type MeasureBakup struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string `json:"mac"`
	Time string	`json:"time"`
	Date string	`json:"date"`
	Temperature float64 `json:"temperature"`
	Humidity float64 `json:"humidity"`
	Air float64 `json:"air"`
}
type Device struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Name string `json:"name"`
	Mac string `json:"mac"`
	Type string `json:"type"`
	Deleted int `json:"deleted"`
}
type Schedule struct {
	ID int `json:"id" gorm:"AUTO_INCREMENT"`
	Mac string	`json:"mac"`
	Time string `json:"time"`
	Duration int `json:"duration"`
}

type Command struct {
	Action string `json:"action"`
	Data string	`json:"data"`
}

