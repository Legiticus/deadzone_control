/*
  Author: Levi Smith
  Version: Beta
  Date: 08/04/2025
*/

#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <WiFi.h>

#include "Color.h"

#define STRINGIFY(x) #x
#define ID 2

#define RPIN 14
#define GPIN 12
#define BPIN 13

// WiFi credentials
const char *ssid = "Dead Zone";
const char *password = "dawnwalker7";

// WebSocket server settings
const char *host = "192.168.0.100";
const uint16_t port = 8001;

// Static IP Configuration
IPAddress local_ip(192, 168, 0, 100 + ID);
IPAddress gateway(192, 168, 0, 254);
IPAddress mask(255, 255, 255, 0);

WebSocketsClient websocket;

String initString;

JsonDocument recvFile;
JsonDocument sendFile;

Color disconnectedLight(255, 0, 1);
Color lightColor(disconnectedLight.getValue());
String transition = "instant";
String effect = "solid";

class Oscillator {
  private:
    int max = 1;
    int tick = 0;
    int direction = 1;
  public:
    Oscillator(int maxVal){
      max = maxVal;
    }
    int update() {
      if (tick < 0 || tick >= max) {
        direction *= -1;
      }
      tick += direction;
      return tick;
    }
    void reset() {
      tick = 0;
      direction = 1;
    }
    int getTick() {
      return tick;
    }
    bool getSwitch() {
      return direction == 1;
    }
};

Oscillator lightOscillator(250);


void setup() {

  pinMode(RPIN, OUTPUT);
  pinMode(GPIN, OUTPUT);
  pinMode(BPIN, OUTPUT);

  writeColor(lightColor.getValue());

  Serial.begin(9600);

  // Switching esp32 to station mode
  WiFi.mode(WIFI_STA);

  // Configure the static ip
  WiFi.config(local_ip, gateway, mask);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.printf("Connecting to %s router...\n", ssid);
  while (WiFi.status() != WL_CONNECTED) {
    printWiFiStatus();
    writeColor(255);
    delay(500);
    writeColor(0);
    delay(500);
  }
  Serial.println(" connected!");
  Serial.println(WiFi.localIP());

  // Configure WebSocket client
  websocket.begin(host, port, "/"); // Path = "/" by default
  websocket.onEvent(webSocketEvent);
  websocket.setReconnectInterval(3000); // 3 sec reconnect
  websocket.enableHeartbeat(1000, 3000, 1000); // Ping every 3s

  //Configure initString
  String str1 = "{ \"type\" : \"init\", \"device\" : \"tower\", \"id\" : ";
  String str2 = ", \"color\" : \"none\", \"transition\" : \"instant\", \"signal\" : ";
  String str3 = " }";
  initString = str1 + ID + str2 + WiFi.RSSI() + str3;

}

void loop() {

  websocket.loop();

  if (effect == "blink") {
    lightOscillator.update();
    writeColor(lightColor.getValue() * lightOscillator.getSwitch());
    Serial.println(lightOscillator.getTick());
  }else if (effect == "pulse") {
    //this scaling provides a more noticable affect
    float scale = pow(0.004 * lightOscillator.update(), 2);
    writeColor(lightColor.getRed() * scale, lightColor.getGreen() * scale, lightColor.getBlue() * scale);
    Serial.println(int(scale * 255));
  }


  //Scheduled Tasks
  static unsigned long prevMillis = 0;
  unsigned long curMillis = millis();

  //runs every 5 seconds
  if (curMillis - prevMillis >= 5000) {

    Serial.println("still running...");
    prevMillis = curMillis;

    sendSignalData();

    //check if the wifi has disconnected, and attempt a reconnect
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Reconnecting to WiFi...");
      WiFi.reconnect();
    }

  }

  
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
  case WStype_DISCONNECTED:
    Serial.println("[WebSocket] Disconnnected");
    writeColor(disconnectedLight);
    break;

  case WStype_CONNECTED:
    Serial.println("[WebSocket] Connected");
    websocket.sendTXT(initString);
    break;

  case WStype_TEXT:
    Serial.printf("[WebSocket] Received: %s\n", payload);
    deserializeJson(recvFile, payload);
    if (recvFile["type"].as<String>() == "update") {
      lightColor.setValue(recvFile["color"].as<int>());
      writeColor(lightColor);
      transition = recvFile["transition"].as<String>();
      effect = recvFile["effect"].as<String>();
    }else if (recvFile["type"].as<String>() == "error") {
      websocket.setReconnectInterval(0);
      Serial.println(recvFile["error"].as<String>());
      writeColor(Color(255,255,0));
    }
    break;

  case WStype_ERROR:
    Serial.println("[WebSocket] Error");
    break;

  default:
    break;
    Serial.printf("[WebSocket] Received: %s\n", payload);
  }
}

void printWiFiStatus() {
  wl_status_t status = WiFi.status();
  Serial.print("WiFi Status: ");
  Serial.println(status);

  switch (status) {
  case WL_NO_SSID_AVAIL:
    Serial.println("SSID not available");
    break;
  case WL_CONNECT_FAILED:
    Serial.println("Connection failed");
    break;
  case 2:
    Serial.println("Wrong password");
    break;
  case WL_IDLE_STATUS:
    Serial.println("Idle");
    break;
  case WL_DISCONNECTED:
    Serial.println("Disconnected");
    break;
  case WL_CONNECTED:
    Serial.println("Connected");
    break;
  }
}

void writeColor(Color color) {
  analogWrite(RPIN, color.getRed());
  analogWrite(GPIN, color.getGreen());
  analogWrite(BPIN, color.getBlue());
}

void writeColor(int r, int g, int b) {
  analogWrite(RPIN, r);
  analogWrite(GPIN, g);
  analogWrite(BPIN, b);
}

void sendSignalData() {
    static String output;
    static String str1 = "{ \"type\" : \"data\", \"device\" : \"tower\", \"id\" : ";
    static String str2 = ", \"signal\" : ";
    static String str3 = "}";
    output = str1 + ID + str2 + WiFi.RSSI() + str3;
    Serial.println(output);
    websocket.sendTXT(output);
}