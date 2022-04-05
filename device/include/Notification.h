#pragma once

#include <Arduino.h>

class Notification
{
private:
    uint8_t _pin;
    bool _featureEnabled = true;

    uint8_t _remainingPulse;
    uint16_t _pulseDuration;
    uint64_t _nextTimeout;
    bool _isHigh;

public:
    Notification(uint8_t pin);

    void check();

    void start();
    
    void pulse(uint16_t duration, uint8_t count = 1);

    void stop();

    void setFeatureEnabled(bool featureEnabled);
};