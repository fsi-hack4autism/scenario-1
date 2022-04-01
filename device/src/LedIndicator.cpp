#include <LedIndicator.h>

LedIndicator::LedIndicator(uint8_t pin)
{
    ledPin = pin;
    featureEnabled = true;
    isOn = false;
}

void LedIndicator::init() {
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);
}

void LedIndicator::IndicatorOn()
{
    isOn = true;
    if (featureEnabled)
        digitalWrite(ledPin, HIGH);
}

void LedIndicator::IndicatorOff()
{
    isOn = false;
    digitalWrite(ledPin, LOW);
}

void LedIndicator::IndicatorBlink()
{
    if (featureEnabled) {
        delay(500);
        IndicatorOn();
        delay(500);
        IndicatorOff();
    }
}

void LedIndicator::setFeatureEnabled(bool isLedEnabled)
{
    featureEnabled = isLedEnabled;
    if (!isLedEnabled) {
        digitalWrite(ledPin, LOW);
    } else {
        digitalWrite(ledPin, isOn ? HIGH : LOW);
    }
}
