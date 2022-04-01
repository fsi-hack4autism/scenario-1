#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>
#include <Arduino.h>

#define BUTTON_PRESS_CYCLES 10000

class HapticFeedback
{
private:
    uint8_t hapticPin;
    bool featureEnabled;
    int cyclesToBuzz;
    bool isAlreadyConnected;

public:
    HapticFeedback(uint8_t pin);

    void init();
    
    void BuzzOn();

    void BuzzOff();

    void ButtonPressBuzz();

    void DeviceOnBuzz();

    void BluetoothConnectedBuzz();

    void BluetoothDisconnectedBuzz();

    void setFeatureEnabled(bool isHapticFeedbackEnabled);

    /*void SetBuzzCounter(int numberOfCycles);*/

    void CheckBuzzStatus(int currentCycleCount);


};