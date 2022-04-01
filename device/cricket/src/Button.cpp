#include <Button.h>

Button::Button()
{
    memset(&_buttonState, 0, sizeof(ButtonState));
    _objective = new Objective();
    _objective->id = 12345;
    _objective->metricType = COUNTER;
}

void Button::init(BLEService *pService, BLEUUID uuid)
{
    _characteristic = pService->createCharacteristic(uuid, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    _characteristic->addDescriptor(new BLE2902());
    _characteristic->setValue((uint8_t *)&_buttonState, sizeof(ButtonState));
}

void Button::setObjective(Objective* objective)
{
    _objective = objective;
    memset(&_buttonState, 0, sizeof(ButtonState));
    _buttonState.objectiveId = objective->id;
    _buttonState.metricType = objective->metricType;
    _characteristic->setValue((uint8_t *)&_buttonState, sizeof(ButtonState));
}

void Button::clearObjective()
{
  _objective = NULL;
  memset(&_buttonState, 0, sizeof(ButtonState));
}

bool Button::isEnabled()
{
  return _objective != NULL;
}

void Button::handleButtonPress(uint64_t now)
{
    // this button may not have been mapped in the descriptor
    if (!isEnabled()) return;

    switch (_objective->metricType)
    {
    case COUNTER:
        _buttonState.counter.totalCount++;
        _buttonState.counter.lastEventTime = now;
        break;

    case DURATION:
        if (_buttonState.duration.startTime != 0 && _buttonState.duration.endTime == 0) {
          // closing an open interval
          _buttonState.duration.eventCount++;
          _buttonState.duration.totalTime += (now - _buttonState.duration.startTime);
          _buttonState.duration.endTime = now;
        } else {
          // beginning a new interval
          _buttonState.duration.startTime = now;
          _buttonState.duration.endTime = 0;
        }
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

    case DURATION:
        _buttonState.duration.startTime = 0;
        _buttonState.duration.endTime = 0;
        _buttonState.duration.totalTime = 0;
        _buttonState.duration.eventCount++;
        break;
    
    default:
        break;
    }
}