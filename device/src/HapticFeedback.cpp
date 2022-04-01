#include <HapticFeedback.h>

HapticFeedback::HapticFeedback(uint8_t pin)
{
    hapticPin = pin;
    featureEnabled = true;
    isAlreadyConnected = false;
}

void HapticFeedback::init() {
    pinMode(hapticPin, OUTPUT);
    digitalWrite(hapticPin, LOW);
}

void HapticFeedback::BuzzOn()
{
    if (featureEnabled)
        digitalWrite(hapticPin, HIGH);
}

void HapticFeedback::BuzzOff()
{
    digitalWrite(hapticPin, LOW);
}

void HapticFeedback::DeviceOnBuzz()
{

    for (uint8_t x = 0; x < 5; x++)
    {
        delay(250);
        BuzzOn();
        delay(250);
        BuzzOff();
    }
}

void HapticFeedback::BluetoothConnectedBuzz()
{
    if (!isAlreadyConnected)
    {
        for (uint8_t x = 0; x < 2; x++)
        {
            delay(250);
            BuzzOn();
            delay(200);
            BuzzOff();
        }
    }

    isAlreadyConnected = true;
}

void HapticFeedback::BluetoothDisconnectedBuzz()
{
    for (uint8_t x = 0; x < 3; x++)
    {
        delay(250);
        BuzzOn();
        delay(200);
        BuzzOff();
    }

    isAlreadyConnected = false;
}

void HapticFeedback::setFeatureEnabled(bool isHapticFeedbackEnabled)
{
    featureEnabled = isHapticFeedbackEnabled;
}

void HapticFeedback::ButtonPressBuzz()
{
    cyclesToBuzz = BUTTON_PRESS_CYCLES;
    BuzzOn();
}

void HapticFeedback::CheckBuzzStatus(int currentCycleCount)
{
    if (currentCycleCount >= cyclesToBuzz)
        BuzzOff();
}
