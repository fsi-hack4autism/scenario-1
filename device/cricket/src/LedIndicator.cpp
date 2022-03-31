#include <LedIndicator.h>

LedIndicator::LedIndicator(uint8_t pin)
{
    ledPin = pin;
}

void LedIndicator::IndicatorOn()
{
    digitalWrite(ledPin, HIGH);
}

void LedIndicator::IndicatorOff()
{
    digitalWrite(ledPin, LOW);
}

void LedIndicator::IndicatorBlink()
{
    delay(500);
    IndicatorOn();
    delay(500);
    IndicatorOff();
}
