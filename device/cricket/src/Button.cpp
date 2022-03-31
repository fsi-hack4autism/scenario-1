#include <Button.h>

Button::Button()
{
    memset(&_buttonState, 0, sizeof(ButtonState));
    _objective = new Objective();
    _objective->id = 12345;
    _objective->metricType = MetricType::COUNTER;
}

void Button::init(BLEService *pService, BLEUUID uuid)
{
    _characteristic = pService->createCharacteristic(uuid,
                                                    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    _characteristic->addDescriptor(new BLE2902());
}

void Button::setObjective(Objective* objective)
{
    _objective = objective;
    memset(&_buttonState, 0, sizeof(ButtonState));
    _buttonState.objectiveId = objective->id;
    _buttonState.metricType = objective->metricType;
}

void Button::handleButtonPress(uint64_t now)
{
    switch (_objective->metricType)
    {
    case COUNTER:
        _buttonState.counter.totalCount++;
        _buttonState.counter.lastEventTime = now;
        break;
    
    default:
        break;
    }

    _characteristic->setValue((uint8_t *)&_buttonState, sizeof(ButtonState));
    _characteristic->notify();
}

void Button::reset()
{
    switch (_objective->metricType)
    {
    case COUNTER:
        _buttonState.counter.totalCount = 0;
        _buttonState.counter.lastEventTime = 0;
        break;
    
    default:
        break;
    }
}