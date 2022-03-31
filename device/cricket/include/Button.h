#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>

class Button
{
private:
    BLECharacteristic *_characteristic;
    uint32_t _value;

public:
    Button(BLEService *pService, BLEUUID uuid);

    void publish();

    void increment();

    void reset();
};