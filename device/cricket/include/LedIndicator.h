#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>
#include <Arduino.h>

class LedIndicator
{
private:
    uint8_t ledPin;
    bool ledEnabled;

public:
    LedIndicator(uint8_t pin, bool isLedEnabled);

    void IndicatorOn();

    void IndicatorOff();

    void IndicatorBlink();

    void SetLedEnabled(bool isLedEnabled);
};