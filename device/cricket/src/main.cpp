#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <AceButton.h>
#include "Button.h"
#include "Data.h"

using namespace ace_button;

// Bluetooth Descriptors
#define SERVICE_UUID "00afbfe4-0000-4233-bb16-1e3500152342"
#define DEVICE_NAME "ABA Cricket"
#define SESSION_CHARACTERISTIC_ID (uint16_t)0x01
#define SESSION_END_CHARACTERISTIC_ID (uint16_t)0x02
#define DEVICE_STATE_CHARACTERISTIC_ID (uint16_t)0x10
#define DEVICE_OPTIONS_CHARACTERISTIC_ID (uint16_t)0x11

// Device presets
#define ONBOARD_LED 22
#define BUTTON_COUNT 5

const uint8_t buttonPins[BUTTON_COUNT] = {27, 25, 32, 4, 0};
const uint16_t buttonCharacteristicIds[BUTTON_COUNT] = {0xd0, 0xd1, 0xd2, 0xd3, 0xd4};

AceButton buttonHandlers[BUTTON_COUNT];
void handleEvent(AceButton *, uint8_t, uint8_t);
Button buttons[BUTTON_COUNT];

BLEServer *pServer = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Active session info
uint64_t remoteSessionStartTime;
uint64_t localStartLocalTime;
uint64_t localEndLocalTime;

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

/**
 * Initiate a therapy session, and map the currently tracked objectives to physical buttons.
 */
class SessionManagementCallback : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("Received SessionManagement");
        digitalWrite(ONBOARD_LED, HIGH);

        Session *session = (Session*) c->getData();
        remoteSessionStartTime = session->startTime;
        localStartLocalTime = millis();

        Serial.printf("Begin session: %d\n", session->id);
    }
};

class SessionEndCallback : public BLECharacteristicCallbacks
{
    /** Notification on Therapy Session End. */
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("Received SessionEnd");
        digitalWrite(ONBOARD_LED, LOW);

        localEndLocalTime = millis();
    }
};

class DeviceInfoCallback : public BLECharacteristicCallbacks
{
    /** Notification that device info is being requested. */
    void onRead(BLECharacteristic *c)
    {
        DeviceInfo deviceInfo = 
        {
            100,    //Battery Percentage
            BUTTON_COUNT
        };

        c->setValue((uint8_t*)&deviceInfo, sizeof(DeviceInfo));
    }
};

class DeviceOptionsCallback : public BLECharacteristicCallbacks
{
    /** update device operational flags */
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("User configuration update...");
    }
};

void setup()
{
    Serial.begin(115200);

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
    BLECharacteristic *sessionStart = pService->createCharacteristic(BLEUUID(SESSION_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ);
    sessionStart->setCallbacks(new SessionManagementCallback());
    sessionStart->addDescriptor(new BLE2902());

    // Session End Descriptor
    BLECharacteristic *sessionEnd = pService->createCharacteristic(BLEUUID(SESSION_END_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE);
    sessionEnd->setCallbacks(new SessionEndCallback());
    sessionEnd->addDescriptor(new BLE2902());

    // High level info on the device
    BLECharacteristic *deviceState = pService->createCharacteristic(BLEUUID(DEVICE_STATE_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_READ);
    deviceState->setCallbacks(new DeviceInfoCallback());
    deviceState->addDescriptor(new BLE2902());

    // Configurable options
    BLECharacteristic *deviceOptions = pService->createCharacteristic(BLEUUID(DEVICE_OPTIONS_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE);
    deviceOptions->setCallbacks(new DeviceOptionsCallback());
    deviceOptions->addDescriptor(new BLE2902());

    // Initialize buttons
    for (int i = 0; i < BUTTON_COUNT; i++)
    {
        int buttonPin = buttonPins[i];
        pinMode(buttonPin, INPUT_PULLUP);
        AceButton &buttonHandler = buttonHandlers[i];
        buttonHandler.init(buttonPin, 1U, i);
        ButtonConfig *buttonConfig = buttonHandler.getButtonConfig();
        buttonConfig->setEventHandler(handleEvent);

        // Bind bluetooth service & characteristic to button
        buttons[i].init(pService, BLEUUID(buttonCharacteristicIds[i]));
    }

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
    for (auto &buttonHandler : buttonHandlers)
    {
        buttonHandler.check();
    }

    if (deviceConnected)
    {
        // Serial.println("Device is connected");
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
void handleEvent(AceButton *button, uint8_t eventType, uint8_t buttonState)
{
    uint64_t now = remoteSessionStartTime + (millis() - localStartLocalTime);

    switch (eventType)
    {
    case AceButton::kEventPressed:
        auto buttonId = button->getId();
        Serial.printf("%09ld: Button Clicked: %d\n", now, buttonId);
        buttons[buttonId].handleButtonPress(now);
        break;
    }
}