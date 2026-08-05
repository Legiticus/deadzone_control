/*
  Author: Levi Smith
  Version: Temporary Test (Alpha)
  Date: 07/10/2025
*/

#define RPIN 14
#define GPIN 12
#define BPIN 13

void setup() {
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
  analogWrite(RPIN, 0);
  analogWrite(GPIN, 0);
  analogWrite(BPIN, 0);
  if (i % 4 == 0) {
    analogWrite(RPIN, 255);
  }else if (i % 4 ==1) {
    analogWrite(GPIN, 255);
  }else if (i % 4 == 2) {
    analogWrite(BPIN, 255);
  }else {
    analogWrite(RPIN, 250);
    analogWrite(GPIN, 209);
    analogWrite(BPIN, 107);
  }
  i++;
  delay(4000);
}