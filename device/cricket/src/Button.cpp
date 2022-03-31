#include <BLEDevice.h>
#include <BLE2902.h>

class Button {
  private:
    BLECharacteristic* characteristic;
    uint32_t value;

  public:
    Button(BLEService* pService, BLEUUID uuid) {
        value = 0;
        characteristic = pService->createCharacteristic(uuid,
              BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_INDICATE
          );
        characteristic->addDescriptor(new BLE2902());
    }

    void publish() {
      this->characteristic->setValue((uint8_t*)&this->value, 4);
      this->characteristic->notify();
    }

    void increment() {
      this->value++;
    }

    void reset() {
      this->value = 0;
    }
};