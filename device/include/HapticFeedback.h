#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>
#include <Arduino.h>

class HapticFeedback
{
private:
    uint8_t _hapticPin;
    bool _featureEnabled = true;
    unsigned long _stopMillis = LONG_MAX;

public:
    HapticFeedback(uint8_t pin);

    void init();

    void check();
    
    void buzzOn();

    void buzzOff();

    void buzzForMillis(uint16_t millis);

    void setFeatureEnabled(bool featureEnabled);
};