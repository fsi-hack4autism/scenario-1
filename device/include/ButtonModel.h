#pragma once

#include <BLEDevice.h>
#include <BLE2902.h>

#include "Data.h"

class ButtonModel
{
private:
    BLECharacteristic *_characteristic;
    Objective *_objective;
    ButtonState _data;

public:
    ButtonModel();

    void init(BLEService *pService, BLEUUID uuid);

    void setObjective(Objective* objective);

    void clearObjective();

    void handleButtonPress(uint64_t now);

    void reset();

    bool isEnabled();
};