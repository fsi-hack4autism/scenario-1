# ABA Therapy: Bluetooth LE Device Specification

## Introduction

This interface is targetted for creating a simple “clicker” that can help record/count events vital to helping in ABA therapy.  Having a dedicated device with a physical button(s) removes all the distractions of an app on a shared device.

Button → Microcontroller (NodeMCU) → Mobile App -> Cloud (Azure Iot Hub) → Azure Function (moves IotHub to CosmosDB)

Button : Any simple momentary button switch. This can be any hardware to capture an event.

## Bluetooth Characteristics

**Device UUID:** 00afbae4-0000-4233-bb16-1e3500152342

### 0x01: SessionManagement

**Type:** Write, *Read*

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|SessionID|uint32|Unique session identifier, a new identifier will reset the session and all metrics.|
|4|StartTime|uint64|Session Start Time (millis since epoch 1970-01-01)|
|12|ObjectiveCount|u8|Number of objectives to map to buttons. Should not exceed 0x10/1 (physical count)|
|13|Objective[]| |Struct|

**Objective**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ID|uint32|Unique identifier for the objective|
|1|Name|char[16]|Human readable name for the objective|
|17|MetricType|u8|Enum identifier for type of metric being counted.|

**MetricType**
* 0 : Counter
* 1 : StopWatch
* 2 : // todo

### 0x02: SessionEnd

**Type:** Write

No payload. Sets the session end time as inspected on the SessionManagement.

### 0xd0-0xd*: Button

**Type:** Read, Notify

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ID|uint32|Unique identifier for the objective|
|1|Name|char[16]|Human readable name for the objective|
|17|MetricType|u8|Enum identifier for type of metric being counted.|
|18|Data*|u8|Union Type as defined below|

**CounterMetric**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Total|uint32|Number of events counted|
|1|LastEventTime|uint64|Last time the counter was clicked|

**DurationMetric**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|TotalTime|uint32|Total time in milliseconds that the feature has been pressed.|
|4|EventCount|uint32|Number of times the stopwatch has been started.|
|8|StartTime|uint64|Current Event start time (millis since epoch)|
|16|EndTime|uint64|Time the active stopwatch was ended, or 0 if still active.|

## Stretch Goal Characteristics

### 0x10: Device State

**Type:** Read

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Battery Level|u8|Level between 0-100 representing battery level|
|1|Buttons|u8|The number of physical 'button' types available on the device.|

### 0x11: Device Options

**Type:** Read/Write

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|LED Enabled|u8 (0/1)|Whether any LEDs associated with the device are to be active.|
|1|Screen Enabled|u8 (0/1)|Whether any screens associated with the device are to be active.|


### Addtional Features?
* Pause session?
* Physical inputs other than buttons?