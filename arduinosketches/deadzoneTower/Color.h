#ifndef COLOR
#define COLOR

class Color {
private:
  int value;
  int red;
  int green;
  int blue;

public:

  Color(int value);
  Color(int r, int g, int b);

  int getValue();
  int getRed();
  int getGreen();
  int getBlue();

  void setValue(int value);
  void setRed(int value);
  void setGreen(int value);
  void setBlue(int value);

};

#endif