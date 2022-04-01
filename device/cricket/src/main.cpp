#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <AceButton.h>
#include "Button.h"
#include "Data.h"
#include "LedIndicator.h"

using namespace ace_button;

// Device presets
#define BT_SESSION_LED_PIN 2
#define ONBOARD_LED 22
#define BUTTON_COUNT 5

// Bluetooth Descriptors
#define SERVICE_UUID "00afbfe4-0000-4233-bb16-1e3500152342"
#define DEVICE_NAME "ABA Cricket"

const uint16_t SESSION_CHARACTERISTIC_ID = 0x01;
const uint16_t SESSION_END_CHARACTERISTIC_ID = 0x02;
const uint16_t DEVICE_STATE_CHARACTERISTIC_ID = 0x10;
const uint16_t DEVICE_OPTIONS_CHARACTERISTIC_ID = 0x11;
const uint8_t  BUTTON_PIN_IN[BUTTON_COUNT] = {27, 25, 32, 4, 0};
const uint16_t BUTTON_CHARACTERISTIC_ID[BUTTON_COUNT] = {0xd0, 0xd1, 0xd2, 0xd3, 0xd4};

// peripherals
AceButton buttonHandlers[BUTTON_COUNT];
Button buttons[BUTTON_COUNT];
LedIndicator sessionIndicator(BT_SESSION_LED_PIN);

void handleEvent(AceButton *, uint8_t, uint8_t);

// BL/dervice state
BLEServer *pServer = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
bool ledEnabled = true;

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
        Session *session = (Session*) c->getData();
        if (session->buttonCount < 0 || session->buttonCount >= BUTTON_COUNT) {
            Serial.println("Ignoring bad session packet");
            return;
        }

        // map objectives for this session
        for (uint8_t i = 0; i < session->buttonCount; i++) {
            // todo: validate objective
            buttons[i].setObjective(&session->objectives[i]);
        }

        // purge additional buttons that are not of interest in this session
        for (uint8_t i = session->buttonCount - 1; i < BUTTON_COUNT; i++) {
            buttons[i].clearObjective();
        }

        remoteSessionStartTime = session->startTime;
        localStartLocalTime = millis();

        Serial.printf("Begin session: %d at epoch %llu\n", session->id, session->startTime);
        if (ledEnabled) {
            digitalWrite(ONBOARD_LED, HIGH);
        }
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
            100,    //Battery Percentage todo
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
        DeviceState *options = (DeviceState*) c->getData();
        ledEnabled = options->ledEnabled;
        if (!ledEnabled) {
            digitalWrite(ONBOARD_LED, LOW);
            sessionIndicator.IndicatorOff();
        }
    }
};

void setup()
{
    Serial.begin(115200);

    // prep pins
    pinMode(ONBOARD_LED, OUTPUT);
    digitalWrite(ONBOARD_LED, LOW);

    //Initialize Session Indicator
    pinMode(BT_SESSION_LED_PIN, OUTPUT);
    if (ledEnabled) {
        sessionIndicator.IndicatorOn();
    }

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
        int buttonPin = BUTTON_PIN_IN[i];
        pinMode(buttonPin, INPUT_PULLUP);
        AceButton &buttonHandler = buttonHandlers[i];
        buttonHandler.init(buttonPin, 1U, i);
        ButtonConfig *buttonConfig = buttonHandler.getButtonConfig();
        buttonConfig->setEventHandler(handleEvent);

        // Bind bluetooth service & characteristic to button
        buttons[i].init(pService, BLEUUID(BUTTON_CHARACTERISTIC_ID[i]));
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
        if (ledEnabled) {
            sessionIndicator.IndicatorOn();
        }
    }
    else
    {
        digitalWrite(ONBOARD_LED, LOW);

        // disconnecting
        if (oldDeviceConnected)
        {
            // prepare for re-advertising
            delay(500);
            pServer->startAdvertising();
            Serial.println("Restart advertising...");
            oldDeviceConnected = deviceConnected;
        }
        else
        {
            oldDeviceConnected = deviceConnected;
            // any additional steps we'd like to do post connection goes here
        }

        if (ledEnabled) {
            sessionIndicator.IndicatorBlink();
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
        Serial.printf("%09llu: Button Clicked: %d\n", now, buttonId);
        buttons[buttonId].handleButtonPress(now);
        break;
    }
}