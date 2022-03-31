#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>

#include "Data.h"

class Button
{
private:
    BLECharacteristic *_characteristic;
    Objective *_objective;
    ButtonState _buttonState;

public:
    Button();

    void init(BLEService *pService, BLEUUID uuid);

    void setObjective(Objective* objective);

    void handleButtonPress(uint64_t now);

    void reset();
};