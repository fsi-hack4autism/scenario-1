#include <Button.h>

Button::Button(BLEService *pService, BLEUUID uuid)
{
    _value = 0;
    _characteristic = pService->createCharacteristic(uuid,
                                                    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    _characteristic->addDescriptor(new BLE2902());
}

void Button::publish()
{
    _characteristic->setValue((uint8_t *)&_value, 4);
    _characteristic->notify();
}

void Button::increment()
{
    _value++;
}

void Button::reset()
{
    _value = 0;
}