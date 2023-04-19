#pragma once

#include <Arduino.h>

#define MAX_BUTTONS 5

#pragma pack(4)
struct Session {
    uint32_t id;
    uint32_t active;
    uint32_t eventCount;
};

#pragma pack(4)
struct ButtonState {
    uint32_t clickCount;
};

#pragma pack(4)
struct DeviceInfo {
    uint8_t batteryPercentage;
    uint8_t buttonCount;
};

#define FLAG_LED             0x1
#define FLAG_HAPTICS         0x2
#define FLAG_AUTO_ADVERTISE  0x4

#pragma pack(4)
struct DeviceOptions {
    uint32_t flags;
};