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
bool autoAdvertise = false;

BLECharacteristic *sessionCharacteristic;

// peripherals
AceButton buttons[BUTTON_COUNT];
Notification onboardLed(ONBOARD_LED);
Notification therapyIndicator(BT_SESSION_LED_PIN);
Notification hapticFeedback(HAPTIC_DEVICE_PIN);

ButtonModel buttonModels[BUTTON_COUNT];
void handleEvent(AceButton *, uint8_t, uint8_t);

// Active session info
uint32_t currentSessionId;
bool sessionActive = false;
uint32_t ackCount;

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
 * Track whether a session is active, provide haptic feedback on receipt.
 */
class SessionManagementCallback : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *c)
    {
        Session *session = (Session*) c->getData();
        sessionActive = session->active != 0;

        if (currentSessionId != session->id) {
            currentSessionId = session->id;
            ackCount = 0;

            // reset
            for (uint8_t i = 0; i < BUTTON_COUNT; i++) {
                buttonModels[i].reset();
            }

            Serial.printf("Begin session: %d\n", session->id);

            if (sessionActive) {
                hapticFeedback.pulse(500, 2);
            }
        }

        // session activity denoted by led
        if (sessionActive) {
            therapyIndicator.start();
        } else {
            therapyIndicator.stop();
        }

        // haptic feedback to denote receival of events
        if (ackCount < session->eventCount) {
            //uint32_t newEvents = session->eventCount - ackCount;
            //Serial.printf("Acknowledged %d event(s)\n", newEvents);
            hapticFeedback.pulse(150, 1);
        }
        ackCount = session->eventCount;
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
    Serial.printf("Loading with flags: 0x%X...\n", flags);
    autoAdvertise = (flags & FLAG_AUTO_ADVERTISE) != 0;
    therapyIndicator.setFeatureEnabled((flags & FLAG_LED) != 0);
    hapticFeedback.setFeatureEnabled((flags & FLAG_HAPTICS) != 0);
}

/**
 * Endpoint to allow configuration of device peripherals on the fly, eg. haptic/led feedback.
 */
class DeviceOptionsCallback : public BLECharacteristicCallbacks
{
    DeviceOptions options = {};

    /** update device operational flags */
    void onWrite(BLECharacteristic *c)
    {
        DeviceOptions *options = (DeviceOptions*) c->getData();
        Serial.printf("User configuration update: 0x%X...\n", options->flags);
        
        loadDeviceState(options->flags);

        // persist to eeprom
        // EEPROM.writeUInt(0x0, options->flags);
        onboardLed.pulse(300, 3);
    }

    /** update device operational flags */
    void onRead(BLECharacteristic *c)
    {
        if (autoAdvertise) options.flags |= FLAG_AUTO_ADVERTISE;
        if (therapyIndicator.isFeatureEnabled()) options.flags |= FLAG_LED;
        if (hapticFeedback.isFeatureEnabled()) options.flags |= FLAG_HAPTICS;

        c->setValue((uint8_t*)&options, sizeof(DeviceOptions));
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

    // don't auto advertise by default
    loadDeviceState(0x7);

    // Create the BLE Device
    BLEDevice::init(DEVICE_NAME);

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new BTSessionCallback());

    // Create the BLE Service
    BLEService *pService = pServer->createService(BLEUUID(SERVICE_UUID), BT_NUM_HANDLES, 0);

    // Session Start/Status Descriptor
    BLECharacteristic *sessionState = pService->createCharacteristic(BLEUUID(SESSION_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE_NR);
    sessionState->addDescriptor(new BLE2902());
    sessionState->setCallbacks(new SessionManagementCallback());

    // High level info on the device
    BLECharacteristic *deviceState = pService->createCharacteristic(BLEUUID(DEVICE_STATE_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_READ);
    deviceState->addDescriptor(new BLE2902());
    deviceState->setCallbacks(new DeviceInfoCallback());

    // Configurable options
    BLECharacteristic *deviceOptions = pService->createCharacteristic(BLEUUID(DEVICE_OPTIONS_CHARACTERISTIC_ID),
            BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE_NR);
    deviceOptions->addDescriptor(new BLE2902());
    deviceOptions->setCallbacks(new DeviceOptionsCallback());

    // ensure clean state
    ackCount = 0;
    therapyIndicator.stop();

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
    pAdvertising->setScanResponse(true);
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
    onboardLed.check();
}

// The event handler for the buttons.
void handleEvent(AceButton *button, uint8_t eventType, uint8_t buttonState)
{
    uint64_t now = millis();

    switch (eventType)
    {
    case AceButton::kEventPressed:
        uint8_t buttonId = button->getId();
        Serial.printf("%09llu: Button Clicked: %d\n", now, buttonId);

        // while connected, we're a regular button... if not, we can be used to activate BLE advertising
        if (deviceConnected) {
            buttonModels[buttonId].handleButtonPress(now);
        } 
        else if (!autoAdvertise) 
        {
            doAdvertise();
        }
        break;
    }
}