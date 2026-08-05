#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  Serial.println("Scanning WiFi...");

  int networks = WiFi.scanNetworks();
  if (networks == 0) {
    Serial.println("No networks found");
  } else {
    Serial.printf("%d networks found:\n", networks);
    for (int i = 0; i < networks; ++i) {
      Serial.printf("%d: %s (RSSI: %d) Encryption: %d Channel: %d\n",
                    i + 1,
                    WiFi.SSID(i).c_str(),
                    WiFi.RSSI(i),
                    WiFi.encryptionType(i),
                    WiFi.channel(i));
      delay(10);
    }
  }
}

void loop() {}
