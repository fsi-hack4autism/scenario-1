#include <HapticFeedback.h>

HapticFeedback::HapticFeedback(uint8_t pin)
{
    _hapticPin = pin;
    pinMode(_hapticPin, OUTPUT);
    digitalWrite(_hapticPin, LOW);
}

void HapticFeedback::check()
{
    if (millis() >= _stopMillis)
    {
        buzzOff();
        _stopMillis = LONG_MAX;
    }
}

void HapticFeedback::buzzOn()
{
    if (_featureEnabled)
    {
        digitalWrite(_hapticPin, HIGH);
    }
}

void HapticFeedback::buzzOff()
{
    digitalWrite(_hapticPin, LOW);
}

void HapticFeedback::buzzForMillis(uint16_t buzzMillis)
{
    _stopMillis = millis() + buzzMillis;
    buzzOn();
}

void HapticFeedback::setFeatureEnabled(bool featureEnabled)
{
    _featureEnabled = featureEnabled;
}
