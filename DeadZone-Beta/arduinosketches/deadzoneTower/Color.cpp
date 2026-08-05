#include "Color.h"

Color::Color(int value) {
    this->setValue(value);
}

Color::Color(int r, int g, int b) {
    this->value = (r << 16) + (g << 8) + b;
    this->red = r;
    this->green = g;
    this->blue = b;
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
//NOTE this class is incomplete as these functions do not modify the overall value when changed
void Color::setRed(int value) {
    this->red = value;
}
void Color::setGreen(int value) {
    this->green = value;
}
void Color::setBlue(int value) {
    this->blue = value;
}