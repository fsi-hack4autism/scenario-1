#include <ButtonModel.h>

ButtonModel::ButtonModel()
{
    memset(&_data, 0, sizeof(ButtonState));
}

void ButtonModel::init(BLEService *pService, BLEUUID uuid)
{
    _characteristic = pService->createCharacteristic(uuid, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
    _characteristic->addDescriptor(new BLE2902());

    memset(&_data, 0, sizeof(ButtonState));
    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
}

void ButtonModel::handleButtonPress(uint64_t now)
{
    // this button may not have been mapped in the descriptor
    //if (!isEnabled()) return;

    _data.clickCount++;
    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
    _characteristic->notify();
}

void ButtonModel::reset()
{
    _data.clickCount = 0;
    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
}