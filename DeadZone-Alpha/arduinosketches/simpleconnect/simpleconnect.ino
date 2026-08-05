
#include <WiFi.h>

// WiFi credentials
const char *ssid = "Dead Zone";
const char *password = "dawnwalker7";

//Static IP Configuration
IPAddress local_ip(192,168,0,101);
IPAddress gateway(192,168,0,254);
IPAddress mask(255,255,255,0);


void setup() {
  Serial.begin(9600);

  delay(100);
  
  Serial.println("Beginning Startup");

  WiFi.mode(WIFI_STA);

  //Configure the static ip
  if(!WiFi.config(local_ip, gateway, mask)) {
    Serial.println("STA Failed to Configure");
  }

  // Connect to WiFi
  WiFi.begin(ssid, password, 6);
  Serial.printf("Connecting to %s router...", ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    printWiFiStatus();
  }
  Serial.println(" connected!");
  Serial.println(WiFi.localIP());
}

void loop() {
}

void printWiFiStatus() {
  wl_status_t status = WiFi.status();
  Serial.print("WiFi Status: ");
  Serial.println(status);

  switch (status) {
    case WL_NO_SSID_AVAIL: Serial.println("SSID not available"); break;
    case WL_CONNECT_FAILED: Serial.println("Connection failed"); break;
    case 2: Serial.println("Wrong password"); break;
    case WL_IDLE_STATUS: Serial.println("Idle"); break;
    case WL_DISCONNECTED: Serial.println("Disconnected"); break;
    case WL_CONNECTED: Serial.println("Connected"); break;
  }
}
