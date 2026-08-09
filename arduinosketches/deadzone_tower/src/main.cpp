/*
  Author: Levi Smith
  Version: Beta v1.1
  Date: 08/04/2025
*/
#include "main.h"

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
    writeColor(wifiConnectingColor);
    delay(500);
    //writeColor(0); // if blinking is desired
    delay(500);
  }
  Serial.println(" connected!");
  Serial.println(WiFi.localIP());

  // Configure WebSocket client
  websocket.begin(host, port, "/"); // Path = "/" by default
  websocket.onEvent(webSocketEvent);
  websocket.setReconnectInterval(3000); // 3 sec reconnect
  websocket.enableHeartbeat(1000, 3000, 5); // Ping every 3s, disconnect after 5 tries

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

    prevMillis = curMillis;

    sendSignalData();

    //check if the wifi has disconnected, and attempt a reconnect
    if (WiFi.status() != WL_CONNECTED) {
      WiFi.reconnect();
    }

  }

  
}
