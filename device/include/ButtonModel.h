#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>

#include "Data.h"

class ButtonModel
{
private:
    BLECharacteristic *_characteristic;
    ButtonState _data;

public:
    ButtonModel();

    void init(BLEService *pService, BLEUUID uuid);

    void handleButtonPress(uint64_t now);

    void reset();
};