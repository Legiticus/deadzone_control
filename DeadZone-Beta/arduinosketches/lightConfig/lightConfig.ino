/*
  Author: Levi Smith
  Version: Temporary Test (Alpha)
  Date: 07/10/2025
*/

#define RPIN 14
#define GPIN 12
#define BPIN 13

void setup() {
  Serial.begin(9600);
  //ledcAttach(RPIN, 5000, 8);  // Channel 0, 5 KHz, 8-bit resolution
  //ledcAttach(GPIN, 5000, 8);
  //ledcAttach(BPIN, 5000, 8);
}

void loop() {
  static int i = 0;
  //purple
  //ledcWrite(RPIN, 128);  // Red
  //ledcWrite(GPIN, 0);    // Green
  //ledcWrite(BPIN, 0);  // Blue
  analogWrite(RPIN, i);
  Serial.println(i);
  i++;
  if (i > 255) {
    i = 0;
  }
  delay(100);
}