#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>
#include <Arduino.h>

class LedIndicator
{
private:
    uint8_t ledPin;

public:
    LedIndicator(uint8_t pin);

    void IndicatorOn();

    void IndicatorOff();

    void IndicatorBlink();
};