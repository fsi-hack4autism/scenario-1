#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>
#include <Arduino.h>

class LedIndicator
{
private:
    uint8_t ledPin;
    bool featureEnabled;
    boolean isOn;

public:
    LedIndicator(uint8_t pin);

    void init();

    void IndicatorOn();

    void IndicatorOff();

    void IndicatorBlink();

    void setFeatureEnabled(bool isLedEnabled);
};