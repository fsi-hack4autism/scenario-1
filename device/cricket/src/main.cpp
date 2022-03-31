#include <AceButton.h>
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "Button.cpp"

using namespace ace_button;

// Bluetooth Descriptors
#define SERVICE_UUID "00afbfe4-0000-4233-bb16-1e3500152342"
#define DEVICE_NAME "ABA Cricket"
#define SESSION_CHARACTERISTIC_ID (uint16_t) 0x01
#define SESSION_END_CHARACTERISTIC_ID (uint16_t) 0x02
#define BUTTON0_CHARACTERISTIC_ID (uint16_t) 0xd0
#define BUTTON1_CHARACTERISTIC_ID (uint16_t) 0xd1
#define BUTTON2_CHARACTERISTIC_ID (uint16_t) 0xd2
#define BUTTON3_CHARACTERISTIC_ID (uint16_t) 0xd3
#define BUTTON4_CHARACTERISTIC_ID (uint16_t) 0xd4

// Device presets
#define ONBOARD_LED 22

const int numberOfButtons = 5;
const int buttonPins[numberOfButtons] = {27, 25, 32, 4, 0};
AceButton buttonHandlers[numberOfButtons];
void handleEvent(AceButton *, uint8_t, uint8_t);

BLEServer* pServer = NULL;
Button* buttons[numberOfButtons];
bool deviceConnected = false;
bool oldDeviceConnected = false;

/**
 * Notification of BLE connection events.
 */
class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;
    }
};

class SessionManagementCallback : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        Serial.println("Received SessionManagement Request");
        digitalWrite(ONBOARD_LED, HIGH);
    }
};

class SessionEndCallback : public BLECharacteristicCallbacks
{
  /** Notification on Therapy Session End. */
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    Serial.println("Received SessionEnd");
    digitalWrite(ONBOARD_LED, LOW);
  }
};

void setup()
{
    Serial.begin(115200);

    // Initialize buttons
    for (int i = 0; i < numberOfButtons; i++)
    {
        int buttonPin = buttonPins[i];
        pinMode(buttonPin, INPUT_PULLUP);
        AceButton &button = buttonHandlers[i];
        button.init(buttonPin, 1U, i);
        ButtonConfig *buttonConfig = button.getButtonConfig();
        buttonConfig->setEventHandler(handleEvent);
    }

    // prep pins
    pinMode(ONBOARD_LED, OUTPUT);
    digitalWrite(ONBOARD_LED, LOW);

    // Create the BLE Device
    BLEDevice::init(DEVICE_NAME);

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    BLEService *pService = pServer->createService(SERVICE_UUID);

    // Session Start/Status Descriptor
    BLECharacteristic* sessionStart = pService->createCharacteristic(BLEUUID(SESSION_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ);
    sessionStart->setCallbacks(new SessionManagementCallback());
    sessionStart->addDescriptor(new BLE2902());

    // Session End Descriptor
    BLECharacteristic* sessionEnd = pService->createCharacteristic(BLEUUID(SESSION_END_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE);
    sessionEnd->setCallbacks(new SessionEndCallback());
    sessionEnd->addDescriptor(new BLE2902());

    // Create a BLE Characteristics for each button
    buttons[0] = new Button(pService, BLEUUID(BUTTON0_CHARACTERISTIC_ID));
    buttons[1] = new Button(pService, BLEUUID(BUTTON1_CHARACTERISTIC_ID));
    buttons[2] = new Button(pService, BLEUUID(BUTTON2_CHARACTERISTIC_ID));
    buttons[3] = new Button(pService, BLEUUID(BUTTON3_CHARACTERISTIC_ID));
    buttons[4] = new Button(pService, BLEUUID(BUTTON4_CHARACTERISTIC_ID));

    // Start the service
    pService->start();

    // Start advertising
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);
    BLEDevice::startAdvertising();
    Serial.println("Device is advertising...");
}

void loop()
{
    for(auto& buttonHandler : buttonHandlers)
    {
        buttonHandler.check();
    }

    if (deviceConnected)
    {
        //Serial.println("Device is connected");
    }
    else
    {
        digitalWrite(ONBOARD_LED, LOW);

        // disconnecting
        if (oldDeviceConnected)
        {
            // reset the device?
            // for (var i = 0; i < BUTTON_COUNT; i++) {
            //   button[i]->reset();
            // }
            delay(500); // give the bluetooth stack the chance to get things ready
            pServer->startAdvertising();
            Serial.println("Restart advertising...");
            oldDeviceConnected = deviceConnected;
        }
        else
        {
            oldDeviceConnected = deviceConnected;
            // any additional steps we'd like to do post connection goes here
        }
    }
}

// The event handler for the buttons.
void handleEvent(AceButton * button, uint8_t eventType, uint8_t buttonState)
{
    switch (eventType)
    {
    case AceButton::kEventPressed:
        auto buttonId = button->getId();
        Serial.println(buttonId);
        buttons[buttonId]->increment();
        buttons[buttonId]->publish();
        break;
    }
}