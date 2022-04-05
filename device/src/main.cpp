#include <Arduino.h>
#include <AceButton.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <EEPROM.h>

#include "ButtonModel.h"
#include "Data.h"
#include "Notification.h"

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
bool autoAdvertise = true;

BLECharacteristic *sessionCharacteristic;

// peripherals
AceButton buttons[BUTTON_COUNT];
Notification therapyIndicator(BT_SESSION_LED_PIN);
Notification hapticFeedback(HAPTIC_DEVICE_PIN);

ButtonModel buttonModels[BUTTON_COUNT];
void handleEvent(AceButton *, uint8_t, uint8_t);

// Active session info
uint64_t remoteSessionStartTime;
uint64_t localStartLocalTime;
uint64_t localEndLocalTime;

/**
 * Begin BL advertisiting. This might be something that isn't enabled by default, and is triggered by a button press.
 */
void doAdvertise() {
    Serial.println("Device is advertising...");
    pServer->startAdvertising();
    hapticFeedback.pulse(500, 3);
}

/**
 * Notification of BLE connection events.
 */
class BTSessionCallback : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        deviceConnected = true;
        hapticFeedback.pulse(500, 1);
    };

    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;

        // while the device is going to keep counting, give a visual indication the device is offline?
        therapyIndicator.stop();

        if (autoAdvertise) {
            delay(500);
            doAdvertise();
        }
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
            buttonModels[i].setObjective(objective);
        }

        // purge additional buttons that are not of interest in this session
        for (uint8_t i = session->buttonCount; i < BUTTON_COUNT; i++) {
            buttonModels[i].clearObjective();
        }

        remoteSessionStartTime = session->startTime;
        localStartLocalTime = millis();

        therapyIndicator.start();
        hapticFeedback.pulse(500, 2);
    }
};

class SessionEndCallback : public BLECharacteristicCallbacks
{
    /** Notification on Therapy Session End. */
    void onWrite(BLECharacteristic *c)
    {
        Serial.println("Received SessionEnd");
        therapyIndicator.stop();

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

void loadDeviceState(uint32_t flags) {
    autoAdvertise = (flags & FLAG_AUTO_ADVERTISE) != 0;
    therapyIndicator.setFeatureEnabled((flags & FLAG_LED) != 0);
    hapticFeedback.setFeatureEnabled((flags & FLAG_HAPTICS) != 0);
}

/**
 * Endpoint to allow configuration of device peripherals on the fly, eg. haptic/led feedback.
 */
class DeviceOptionsCallback : public BLECharacteristicCallbacks
{
    /** update device operational flags */
    void onWrite(BLECharacteristic *c)
    {
        DeviceState *options = (DeviceState*) c->getData();
        Serial.printf("User configuration update: 0x%X...\n", options->flags);
        
        loadDeviceState(options->flags);

        // persist to eeprom
        // EEPROM.writeUInt(0x0, options->flags);
    }

    /** update device operational flags */
    void onRead(BLECharacteristic *c)
    {
        DeviceState *options = (DeviceState*) c->getData();
        
        options->flags = 0;
        if (autoAdvertise) options->flags |= FLAG_AUTO_ADVERTISE;
        if (therapyIndicator.isFeatureEnabled()) options->flags |= FLAG_LED;
        if (hapticFeedback.isFeatureEnabled()) options->flags |= FLAG_HAPTICS;
    }
};

/**
 * Device bootstrap.
 */
void setup()
{
    Serial.begin(115200);

    // disable on-board led
    pinMode(ONBOARD_LED, OUTPUT);
    digitalWrite(ONBOARD_LED, LOW);

    // load sensible defaults from EEPROM
    // loadDeviceState(EEPROM.readUInt(0x0));
    loadDeviceState(0x7);

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
        AceButton &button = buttons[i];
        button.init(buttonPin, 1U, i);
        ButtonConfig *buttonConfig = button.getButtonConfig();
        buttonConfig->setEventHandler(handleEvent);

        // Bind bluetooth service & characteristic to button
        buttonModels[i].init(pService, BUTTON_CHARACTERISTIC_ID[i]);
    }

    // Start the service
    pService->start();

    // Configure advertising
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);
    if (autoAdvertise) {
        doAdvertise();
    }
}

void loop()
{
    for (auto &button : buttons)
    {
        button.check();
    }

    therapyIndicator.check();
    hapticFeedback.check();
}

// The event handler for the buttons.
void handleEvent(AceButton *button, uint8_t eventType, uint8_t buttonState)
{
    uint64_t now = remoteSessionStartTime + (millis() - localStartLocalTime);

    switch (eventType)
    {
    case AceButton::kEventPressed:
        uint8_t buttonId = button->getId();
        Serial.printf("%09llu: Button Clicked: %d\n", now, buttonId);

        // while connected, we're a regular button... if not, we can be used to activate BLE advertising
        if (deviceConnected) {
            buttonModels[buttonId].handleButtonPress(now);
            hapticFeedback.pulse(150, 1);
        } 
        else if (!autoAdvertise) 
        {
            doAdvertise();
        }
        break;
    }
}