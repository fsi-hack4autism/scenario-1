#include <LedIndicator.h>

LedIndicator::LedIndicator(uint8_t pin, bool isLedEnabled)
{
    ledPin = pin;
    ledEnabled = isLedEnabled;
}

void LedIndicator::IndicatorOn()
{
    if (ledEnabled)
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

void LedIndicator::SetLedEnabled(bool isLedEnabled)
{
    ledEnabled = isLedEnabled;
}
