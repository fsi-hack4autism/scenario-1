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
}

void ButtonModel::setObjective(Objective* objective)
{
    _objective = objective;
    memset(&_data, 0, sizeof(ButtonState));
    _data.objectiveId = objective->id;
    _data.metricType = objective->metricType;
    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
}

void ButtonModel::clearObjective()
{
  _objective = NULL;
  memset(&_data, 0, sizeof(ButtonState));
}

bool ButtonModel::isEnabled()
{
  return _objective != NULL;
}

void ButtonModel::handleButtonPress(uint64_t now)
{
    // this button may not have been mapped in the descriptor
    if (!isEnabled()) return;

    switch (_objective->metricType)
    {
    case COUNTER:
        _data.counter.totalCount++;
        _data.counter.lastEventTime = now;
        break;

    case DURATION:
        if (_data.duration.startTime != 0 && _data.duration.endTime == 0) {
          // closing an open interval
          _data.duration.eventCount++;
          _data.duration.totalTime += (now - _data.duration.startTime);
          _data.duration.endTime = now;
        } else {
          // beginning a new interval
          _data.duration.startTime = now;
          _data.duration.endTime = 0;
        }
        break;
    
    default:
        break;
    }

    _characteristic->setValue((uint8_t *)&_data, sizeof(ButtonState));
    _characteristic->notify();
}

void ButtonModel::reset()
{
    switch (_objective->metricType)
    {
    case COUNTER:
        _data.counter.totalCount = 0;
        _data.counter.lastEventTime = 0;
        break;

    case DURATION:
        _data.duration.startTime = 0;
        _data.duration.endTime = 0;
        _data.duration.totalTime = 0;
        _data.duration.eventCount++;
        break;
    
    default:
        break;
    }
}