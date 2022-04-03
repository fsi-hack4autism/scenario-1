#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <AceButton.h>
#include "Button.h"
#include "Data.h"
#include "LedIndicator.h"
#include "HapticFeedback.h"

using namespace ace_button;

// Device presets
#define BT_SESSION_LED_PIN 2
#define HAPTIC_DEVICE_PIN 26
#define ONBOARD_LED 22
#define BUTTON_COUNT 4
const uint8_t  BUTTON_PIN_IN[BUTTON_COUNT] = {27, 25, 32, 4};

// Bluetooth Descriptors
#define DEVICE_NAME                      "ABA Cricket"
#define SERVICE_UUID                     "00afbfe4-0000-4233-bb16-1e3500150000"
#define SESSION_CHARACTERISTIC_ID        "00afbfe4-0001-4233-bb16-1e3500150000"
#define SESSION_END_CHARACTERISTIC_ID    "00afbfe4-0002-4233-bb16-1e3500150000"
#define DEVICE_STATE_CHARACTERISTIC_ID   "00afbfe4-0010-4233-bb16-1e3500150000"
#define DEVICE_OPTIONS_CHARACTERISTIC_ID "00afbfe4-0011-4233-bb16-1e3500150000"
#define BUTTON0_CHARACTERISTIC_ID        "00afbfe4-00d0-4233-bb16-1e3500150000"
#define BUTTON1_CHARACTERISTIC_ID        "00afbfe4-00d1-4233-bb16-1e3500150000"
#define BUTTON2_CHARACTERISTIC_ID        "00afbfe4-00d2-4233-bb16-1e3500150000"
#define BUTTON3_CHARACTERISTIC_ID        "00afbfe4-00d3-4233-bb16-1e3500150000"
#define BT_NUM_HANDLES 32

const BLEUUID BUTTON_CHARACTERISTIC_ID[BUTTON_COUNT] = {
    BLEUUID(BUTTON0_CHARACTERISTIC_ID),
    BLEUUID(BUTTON1_CHARACTERISTIC_ID),
    BLEUUID(BUTTON2_CHARACTERISTIC_ID),
    BLEUUID(BUTTON3_CHARACTERISTIC_ID)
};

// BL/device state
BLEServer *pServer = NULL;
BLEService *pService = NULL;
bool deviceConnected = false;
BLECharacteristic *sessionCharacteristic;

// peripherals
AceButton buttonHandlers[BUTTON_COUNT];
Button buttons[BUTTON_COUNT];
LedIndicator therapyIndicator(BT_SESSION_LED_PIN);
HapticFeedback hapticFeedback(HAPTIC_DEVICE_PIN);

void handleEvent(AceButton *, uint8_t, uint8_t);

// Active session info
uint64_t remoteSessionStartTime;
uint64_t localStartLocalTime;
uint64_t localEndLocalTime;

/**
 * Notification of BLE connection events.
 */
class BTSessionCallback : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        deviceConnected = true;
        hapticFeedback.buzzForMillis(500);
    };

    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;

        // while the device is going to keep counting, give a visual indication the device is offline?
        therapyIndicator.IndicatorOff();

        delay(500);
        pServer->startAdvertising();
        Serial.println("Restart advertising...");
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

        Serial.printf("Begin session: %d at epoch %llu\n", session->id, session->startTime);

        // map objectives for this session
        Serial.printf("Mapping %d buttons for the session...\n", session->buttonCount);
        for (uint8_t i = 0; i < session->buttonCount; i++) {
            Objective *objective = &session->objectives[i];
            Serial.printf("Session: %d, associating button: %d with objective %d (type:%d)\n",
                session->id, i, objective->id, objective->metricType);

            // todo: validate objective
            buttons[i].setObjective(objective);
        }

        // purge additional buttons that are not of interest in this session
        for (uint8_t i = session->buttonCount; i < BUTTON_COUNT; i++) {
            buttons[i].clearObjective();
        }

        remoteSessionStartTime = session->startTime;
        localStartLocalTime = millis();

        therapyIndicator.IndicatorOn();
        hapticFeedback.buzzForMillis(1000);
    }
};

class SessionEndCallback : public BLECharacteristicCallbacks
{
    /** Notification on Therapy Session End. */
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("Received SessionEnd");
        therapyIndicator.IndicatorOff();

        // update the Session characteristic
        Session *session = (Session *)sessionCharacteristic->getData();
        session->endTime = remoteSessionStartTime + (millis() - localStartLocalTime);

        // todo: disable buttons and/or clear objectives?
    }
};

class DeviceInfoCallback : public BLECharacteristicCallbacks
{
    /** Notification that device info is being requested. */
    void onRead(BLECharacteristic *c)
    {
        // todo: battery percentage is currently not calculated
        DeviceInfo deviceInfo =
        {
            100,
            BUTTON_COUNT
        };

        c->setValue((uint8_t*)&deviceInfo, sizeof(DeviceInfo));
    }
};

/**
 * Endpoint to allow configuration of device peripherals on the fly, eg. haptic/led feedback.
 */
class DeviceOptionsCallback : public BLECharacteristicCallbacks
{
    /** update device operational flags */
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("User configuration update...");
        DeviceState *options = (DeviceState*) c->getData();
        therapyIndicator.setFeatureEnabled(options->ledEnabled);
        hapticFeedback.setFeatureEnabled(options->hapticsEnabled);
    }
};


/**
 * Device bootstrap.
 */
void setup()
{
    Serial.begin(115200);

    // prep pins
    pinMode(ONBOARD_LED, OUTPUT);
    digitalWrite(ONBOARD_LED, LOW);

    //Initialize Session Indicator
    pinMode(BT_SESSION_LED_PIN, OUTPUT);

    // Create the BLE Device
    BLEDevice::init(DEVICE_NAME);

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new BTSessionCallback());

    // Create the BLE Service
    BLEService *pService = pServer->createService(BLEUUID(SERVICE_UUID), BT_NUM_HANDLES, 0);

    // Session Start/Status Descriptor
    BLECharacteristic *sessionStart = pService->createCharacteristic(BLEUUID(SESSION_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE_NR);
    sessionStart->addDescriptor(new BLE2902());
    sessionStart->setCallbacks(new SessionManagementCallback());

    // Session End Descriptor
    BLECharacteristic *sessionEnd = pService->createCharacteristic(BLEUUID(SESSION_END_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_WRITE);
    sessionEnd->addDescriptor(new BLE2902());
    sessionEnd->setCallbacks(new SessionEndCallback());

    // High level info on the device
    BLECharacteristic *deviceState = pService->createCharacteristic(BLEUUID(DEVICE_STATE_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_READ);
    deviceState->addDescriptor(new BLE2902());
    deviceState->setCallbacks(new DeviceInfoCallback());

    // Configurable options
    BLECharacteristic *deviceOptions = pService->createCharacteristic(BLEUUID(DEVICE_OPTIONS_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
    deviceOptions->addDescriptor(new BLE2902());
    deviceOptions->setCallbacks(new DeviceOptionsCallback());

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
        buttons[i].init(pService, BUTTON_CHARACTERISTIC_ID[i]);
    }

    // Start the service
    pService->start();

    // Start advertising
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);
    pServer->startAdvertising();
    Serial.println("Device is advertising...");
}

void loop()
{
    if (deviceConnected)
    {
        for (auto &buttonHandler : buttonHandlers)
        {
            buttonHandler.check();
        }

        hapticFeedback.check();
    }
    else
    {
        // currently disconnected from the BLE, awaiting connection
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
        hapticFeedback.buzzForMillis(150);
        break;
    }
}