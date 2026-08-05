#ifndef FADE_ENGINE
#define FADE_ENGINE

class FadeEngine {
private:

  struct RGB{
	int red;
	int green;
	int blue;
  };

  int tick;
  int shrinkTick;
  int growTick;

  int fadeLength;

  RGB target;
  RGB current;

  RGB intToRGB(int color);

  int RGBToInt(RGB color);

public:
  FadeEngine();

  void configure(int fadeLength);

  void routePath(int color);

  int state();

  void changePath();
};

#endif