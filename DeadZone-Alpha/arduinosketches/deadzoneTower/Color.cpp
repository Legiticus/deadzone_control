#include "Color.h"

Color::Color(int value) {
    this->setValue(value);
}

int Color::getValue() {
    return this->value;
}
int Color::getRed() {
    return this->red;
}
int Color::getGreen() {
    return this->green;
}
int Color::getBlue() {
    return this->blue;
}

void Color::setValue(int value) {
    this->value = value;
    this->red = value >> 16 & 0xFF;
    this->green = value >> 8 & 0xFF;
    this->blue = value & 0xFF;
}
void Color::setRed(int value) {
    this->red = value;
}
void Color::setGreen(int value) {
    this->green = value;
}
void Color::setBlue(int value) {
    this->blue = value;
}