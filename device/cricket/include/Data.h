#ifndef DATA_H_
#define DATA_H_
#include <Arduino.h>

#define MAX_BUTTONS 5

enum MetricType {
    COUNTER  = 0,
    DURATION = 1
};

struct Objective {
    uint32_t id;
    char name[16];
    MetricType metricType;
};

struct Session {
    uint32_t id;
    uint64_t startTime;
    uint64_t endTime;
    uint8_t buttonCount;
    uint8_t padding[3];
    Objective objectives[MAX_BUTTONS];
};

struct CounterMetric {
    uint64_t lastEventTime;
    uint32_t totalCount;
};

struct DurationMetric {
    uint64_t startTime;
    uint64_t endTime;
    uint32_t eventCount;
    uint32_t totalTime;
};

struct ButtonState {
    uint32_t objectiveId;
    MetricType metricType;
    union {
        CounterMetric counter;
        DurationMetric duration;
    };
};

struct DeviceInfo {
    uint8_t batteryPercentage;
    uint8_t buttonCount;
};

struct DeviceState {
    bool lcdEnabled;
    bool ledEnabled;
};

#endif