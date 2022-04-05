#include <Notification.h>

Notification::Notification(uint8_t pin)
{
    _pin = pin;
    _nextTimeout = LONG_MAX;
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
}

void Notification::check()
{
    if (_remainingPulse == 0) return;

    unsigned long now = millis();

    if (now >= _nextTimeout) {
        _nextTimeout = now + _pulseDuration;

        if (_isHigh) {
            digitalWrite(_pin, LOW);
            _isHigh = false;
            _remainingPulse--;
            if (_remainingPulse == 0) {
                _nextTimeout = LONG_MAX;
            }
        } else {
            if (_featureEnabled) {
                digitalWrite(_pin, HIGH);
            }
            _isHigh = true;
        }
    }
}

void Notification::start() {
    _isHigh = true;
    _remainingPulse = 0;
    _nextTimeout = LONG_MAX;
    if (_featureEnabled) {
        digitalWrite(_pin, HIGH);
    }
}

void Notification::pulse(uint16_t duration, uint8_t count) {
    _isHigh = false;
    _remainingPulse = count;
    _nextTimeout = 0;
    _pulseDuration = duration;
    check();
}

void Notification::stop() {
    _nextTimeout = LONG_MAX;
    _isHigh = false;
    _remainingPulse = 0;
    digitalWrite(_pin, LOW);
}

void Notification::setFeatureEnabled(bool featureEnabled) {
    _featureEnabled = featureEnabled;
    if (_featureEnabled) {
        digitalWrite(_pin, _isHigh ? HIGH : LOW);
    } else {
        stop();
    }
}