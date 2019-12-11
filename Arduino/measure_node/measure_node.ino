#include <ESP8266WiFi.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>
#include "DHT.h"

#define DHTPIN D3
#define DHTTYPE DHT22 

DHT dht(DHTPIN, DHTTYPE);

#define WIFI_SSID "16CNTN"
#define WIFI_PASSWORD "khongcopass"

#define MQTT_HOST IPAddress(192, 168, 1, 5)
#define MQTT_PORT 1883

#define MOISTURE_PIN A0
#define MAP_LOW 720
#define MAP_HIGH 320

#define SIGNAL_PIN D8


AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;

#define TIME_GAP 1000
#define TIME_SEND 60000
#define TOPIC "/measure"
bool isWifiReady = false;
bool isMqttReady = false;
unsigned long currentTime;
unsigned long previousTime;
unsigned long elapsedTime;

unsigned long previousTimeSend;
unsigned long elapsedTimeSend;
String clientMac = "";

int moisture;
int humidityMoisturePercentage;

String message = "";

float totalMoisture;
float totalTemperature;
float totalAir;

int count;

String macToStr(const uint8_t* mac)
{
  String result;
  for (int i = 0; i < 6; ++i) {
    String m = String(mac[i], 16);
    if (m.length() == 1) {
      m = "0"+m;
    }
    result += m;
    if (i < 5)
      result += ':';
  }
  return result;
}

void Blink(int pin, int n){
  for (int i = 0; i < n; i++){
    digitalWrite(pin, HIGH);
    delay(500);
    digitalWrite(pin, LOW);
    delay(500);
  }
}
void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void onWifiConnect(const WiFiEventStationModeGotIP& event) {
  Serial.println("Connected to Wi-Fi.");
  unsigned char mac[6];
  WiFi.macAddress(mac);
  clientMac += macToStr(mac);
  Serial.println(clientMac);
  isWifiReady = true;
  Blink(SIGNAL_PIN, 3);
  connectToMqtt();
}

void onWifiDisconnect(const WiFiEventStationModeDisconnected& event) {
  Serial.println("Disconnected from Wi-Fi.");
  mqttReconnectTimer.detach(); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
  wifiReconnectTimer.once(2, connectToWifi);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
  isMqttReady = true;
  Blink(SIGNAL_PIN, 3);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected()) {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}

void onMqttUnsubscribe(uint16_t packetId) {
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
  Serial.println("Publish received.");
  Serial.print("  topic: ");
  Serial.println(topic);
  Serial.print("  qos: ");
  Serial.println(properties.qos);
  Serial.print("  dup: ");
  Serial.println(properties.dup);
  Serial.print("  retain: ");
  Serial.println(properties.retain);
  Serial.print("  len: ");
  Serial.println(len);
  Serial.print("  index: ");
  Serial.println(index);
  Serial.print("  total: ");
  Serial.println(total);
}

void onMqttPublish(uint16_t packetId) {
  Serial.println("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println();

  pinMode(SIGNAL_PIN, OUTPUT);
  pinMode(D5, OUTPUT);

  dht.begin();

  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onSubscribe(onMqttSubscribe);
  mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  connectToWifi();
  currentTime = millis();
  previousTime = millis();
  count = 0;
  totalMoisture = 0.0;
  totalTemperature = 0.0;
  totalAir = 0.0;
}

void loop()
{
  if (isWifiReady && isMqttReady){
    digitalWrite(D5, HIGH);
    digitalWrite(SIGNAL_PIN, LOW);
    currentTime = millis();
    elapsedTime = currentTime - previousTime;
    if (elapsedTime >= TIME_GAP){
      previousTime = currentTime;
      moisture = analogRead(MOISTURE_PIN);
      float humidityMoisturePercentage = map(moisture, MAP_LOW, MAP_HIGH, 0, 100);
      float humidityAir = dht.readHumidity();
      float temperature = dht.readTemperature();
      if (isnan(temperature)){
        temperature = 0.0;
      }
      if (isnan(humidityAir)){
        humidityAir = 0.0;
      }
      Serial.println(humidityMoisturePercentage);
      Serial.println(temperature);
      Serial.println(humidityAir);
      Serial.println("--------");
      count += 1;
      totalMoisture += humidityMoisturePercentage;
      totalTemperature += temperature;
      totalAir += humidityAir;
    }
    elapsedTimeSend = currentTime - previousTimeSend;
    if (elapsedTimeSend >= TIME_SEND){
      previousTimeSend = currentTime;
      message = clientMac + "|" + String(totalTemperature / count) + "|" +  String(totalMoisture / count) + "|" + String(totalAir / count);
      mqttClient.publish(TOPIC, 0, true, (message).c_str());
      Serial.println(message);
      count = 0;
      totalMoisture = 0.0;
      totalTemperature = 0.0;
      totalAir = 0.0;
    }
  } else {
    digitalWrite(SIGNAL_PIN, HIGH);
  }
}
