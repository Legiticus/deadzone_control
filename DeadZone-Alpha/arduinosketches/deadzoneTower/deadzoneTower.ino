#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <WiFi.h>

#include "Color.h"

#define STRINGIFY(x) #x
#define ID 3

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

Color lightColor(16711765);
String transition = "instant";
String effect = "solid";

class Clock {//TODO fix this thing
  private:
    int tick = 10;
    int direction = 1;
  public:
    int update() {
      if (tick < 10 || tick == 250) {
        direction *= -1;
      }
      tick += direction;
      return tick;
    }
    int getTick() {
      return tick;
    }
    bool getSwitch() {
      return direction == 1;
    }
};

Clock lightClock;


void setup() {

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
    delay(500);
    printWiFiStatus();
  }
  Serial.println(" connected!");
  Serial.println(WiFi.localIP());

  // Configure WebSocket client
  websocket.begin(host, port, "/"); // Path = "/" by default
  websocket.onEvent(webSocketEvent);
  websocket.setReconnectInterval(3000); // 3 sec reconnect

  //Configure initString
  String str1 = "{ \"type\" : \"init\", \"device\" : \"tower\", \"id\" : ";
  String str2 = ", \"settings\" : {\"color\" : \"none\", \"transition\" : \"instant\"} }";
  initString = str1 + ID + str2;

}

void loop() {

  websocket.loop();

  if (effect == "blink") {
    lightClock.update();
    writeColor(lightColor.getValue() * lightClock.getSwitch());
    Serial.println(lightClock.getTick());
  }else if (effect == "pulse") {
    //this scaling provides a more noticable affect
    float scale = pow(0.004 * lightClock.update(), 2);
    writeColor(lightColor.getRed() * scale, lightColor.getGreen() * scale, lightColor.getBlue() * scale);
    Serial.println(int(scale * 255));
  }
  
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
  case WStype_DISCONNECTED:
    Serial.println("[WebSocket] Disconnnected");
    break;

  case WStype_CONNECTED:
    Serial.println("[WebSocket] Connected");
    websocket.sendTXT(initString);
    break;

  case WStype_TEXT:
    Serial.printf("[WebSocket] Received: %s\n", payload);
    deserializeJson(recvFile, payload);
    writeColor(recvFile["color"].as<int>());
    lightColor.setValue(recvFile["color"].as<int>());
    transition = recvFile["transition"].as<String>();
    effect = recvFile["effect"].as<String>();
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

void writeColor(unsigned int color) {
  analogWrite(RPIN, color >> 16 & 0xFF);
  analogWrite(GPIN, color >> 8 & 0xFF);
  analogWrite(BPIN, color & 0xFF);
}

void writeColor(int r, int g, int b) {
  analogWrite(RPIN, r);
  analogWrite(GPIN, g);
  analogWrite(BPIN, b);
}