#ifndef DATA_H_
#define DATA_H_
#include <Arduino.h>

#define MAX_BUTTONS 5

const uint8_t COUNTER = 0;
const uint8_t DURATION = 1;

#pragma pack(4)
struct Objective {
    uint32_t id;
    char name[16];
    uint8_t metricType;
};

#pragma pack(4)
struct Session {
    uint32_t id;
    uint64_t startTime;
    uint64_t endTime;
    uint8_t buttonCount;
    uint8_t padding[3];
    Objective objectives[MAX_BUTTONS];
};

#pragma pack(4)
struct CounterMetric {
    uint64_t lastEventTime;
    uint32_t totalCount;
};

#pragma pack(4)
struct DurationMetric {
    uint64_t startTime;
    uint64_t endTime;
    uint32_t eventCount;
    uint32_t totalTime;
};

#pragma pack(4)
struct ButtonState {
    uint32_t objectiveId;
    uint8_t metricType;
    uint8_t padding[3];
    union {
        CounterMetric counter;
        DurationMetric duration;
    };
};

#pragma pack(4)
struct DeviceInfo {
    uint8_t batteryPercentage;
    uint8_t buttonCount;
};

#pragma pack(4)
struct DeviceState {
    bool lcdEnabled;
    bool ledEnabled;
};

#endif