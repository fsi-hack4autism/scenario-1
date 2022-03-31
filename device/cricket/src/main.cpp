#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "Button.cpp"

// Bluetooth Descriptors
#define SERVICE_UUID "00afbae4-0000-4233-bb16-1e3500152342"
#define DEVICE_NAME "ABA Cricket"
#define SESSION_START_CHARACTERISTIC_ID (uint16_t) 0x01
#define SESSION_END_CHARACTERISTIC_ID (uint16_t) 0x02
#define BUTTON0_CHARACTERISTIC_ID (uint16_t) 0xd0
#define BUTTON1_CHARACTERISTIC_ID (uint16_t) 0xd1
#define BUTTON2_CHARACTERISTIC_ID (uint16_t) 0xd2
#define BUTTON3_CHARACTERISTIC_ID (uint16_t) 0xd3
#define BUTTON4_CHARACTERISTIC_ID (uint16_t) 0xd4

// Device presets
#define BUTTON_COUNT 5
#define ONBOARD_LED 22

BLEServer* pServer = NULL;
BLECharacteristic* dictCharacteristic;
Button* buttons[BUTTON_COUNT];
bool deviceConnected = false;
bool oldDeviceConnected = false;

class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

class SessionManagementCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    Serial.println("Received SessionManagement Request");
    digitalWrite(ONBOARD_LED, HIGH);
  }
};

void setup() {
  Serial.begin(9600);

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

  // a characteristic for receiving the feature dictionary
  dictCharacteristic = pService->createCharacteristic(BLEUUID(SESSION_START_CHARACTERISTIC_ID), BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ);
  dictCharacteristic->setCallbacks(new SessionManagementCallback());
  dictCharacteristic->addDescriptor(new BLE2902());

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

void loop() {
    if (deviceConnected) {
        // device is ready and available
        buttons[0]->publish();
        buttons[0]->increment();
        delay(500);
    } else {
      digitalWrite(ONBOARD_LED, LOW);

      // disconnecting
      if (oldDeviceConnected) {
        // reset the device?
        // for (var i = 0; i < BUTTON_COUNT; i++) {
        //   button[i]->reset();
        // }
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising();
        Serial.println("Restart advertising...");
        oldDeviceConnected = deviceConnected;
      } else {
        oldDeviceConnected = deviceConnected;
        // any additional steps we'd like to do post connection goes here
      }
    }
}