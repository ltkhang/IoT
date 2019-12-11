#include <ESP8266WiFi.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>

#define WIFI_SSID "16CNTN"
#define WIFI_PASSWORD "khongcopass"

#define MQTT_HOST IPAddress(192, 168, 1, 5)
#define MQTT_PORT 1883


AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;


#define SIGNAL_PIN D8 

#define TOPIC "/pump"
bool isWifiReady = false;
bool isMqttReady = false;
bool isPumping = false;

long timeRemain = 0;

String clientMac = "";

unsigned long pre = 0;
unsigned long cur = 0;

String macToStr(const uint8_t* mac)
{
  String result;
  for (int i = 0; i < 6; ++i) {
    result += String(mac[i], 16);
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
  isWifiReady = true;
  Serial.println(clientMac);
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
  uint16_t packetIdSub = mqttClient.subscribe(TOPIC, 0);
  Serial.print("Subscribing at QoS 0, packetId: ");
  Serial.println(packetIdSub);
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

void onMqttMessage(char* t, char* p, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
  Serial.println("Publish received.");
  Serial.print("Topic: ");
  Serial.println(t);
  Serial.println("Payload");
  Serial.println(p);

  String topic = String(t);
  String payload = String(p);
  if (topic == TOPIC){
    String splitInput[3];
    int index = 0;
    String tmp = "";
    for (int i = 0; i < payload.length(); i++){
      if (payload[i] != '|'){
        tmp += payload[i];
      } else {
        splitInput[index] = tmp;
        tmp = "";
        index++;
      }
    }
    Serial.println(splitInput[0]);
    Serial.println(splitInput[1]);
    Serial.println(splitInput[2]);
    if (splitInput[0] == clientMac){
      if (splitInput[1] == "1"){
        timeRemain = splitInput[2].toInt();
        isPumping = true;
      } else {
        isPumping = false;
      }
    }
  }
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
  pinMode(D7, OUTPUT);
  pinMode(D8, OUTPUT);
  pinMode(D5, OUTPUT);
  pre = millis();
}

void loop()
{
  if (isWifiReady && isMqttReady){
    digitalWrite(D5, HIGH);
    digitalWrite(SIGNAL_PIN, LOW);
    cur = millis();
    if (cur - pre >= 1000){
      pre = cur;
      if (isPumping){
        digitalWrite(D7, HIGH);
        timeRemain -= 1;
        if (timeRemain <= 0) {
          isPumping = false;
        }
      } else {
        digitalWrite(D7, LOW);
      } 
    }
  } else {
    digitalWrite(SIGNAL_PIN, HIGH);
  }
  
}
