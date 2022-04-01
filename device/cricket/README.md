# ABA Therapy: Bluetooth LE Device Specification

## Introduction

This interface is targetted for creating a simple “clicker” that can help record/count events vital to helping in ABA therapy.  Having a dedicated device with a physical button(s) removes all the distractions of an app on a shared device.

Button → Microcontroller (NodeMCU) → Mobile App -> Cloud (Azure Iot Hub) → Azure Function (moves IotHub to CosmosDB)

Button : Any simple momentary button switch. This can be any hardware to capture an event.

## Bluetooth Characteristics

**Device UUID:** 00afbfe4-0000-4233-bb16-1e3500150000

### Session (00afbfe4-0001-4233-bb16-1e3500150000)

**Type:** Write, *Read*

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|SessionID|uint32|Unique session identifier, a new identifier will reset the session and all metrics.|
|4|StartTime|uint64|Session Start Time (millis since epoch 1970-01-01)|
|12|EndTime|uint64|Session Start Time (millis since epoch 1970-01-01)|
|20|ObjectiveCount|uint8|Number of objectives to map to physical buttons.|
|21|*padding*|uint8[7]|...|
|28|Objective[5]| |Struct|

**Objective**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ID|uint32_t|Unique identifier for the objective|
|4|Name|char[16]|Human readable name for the objective|
|20|MetricType|u8|Enum identifier for type of metric being counted.|
|21|*padding*|byte[7]|...|

**MetricType**
* 0 : Counter
* 1 : StopWatch
* 2 : // todo

### SessionEnd (00afbfe4-0002-4233-bb16-1e3500150000)

**Type:** Write

No payload. Sets the session end time as inspected on the SessionManagement.

### Device State (00afbfe4-0010-4233-bb16-1e3500150000)

**Type:** Read

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Battery Level|u8|Level between 0-100 representing battery level|
|1|Buttons|u8|The number of physical 'button' types available on the device.|

### Device Options (00afbfe4-0011-4233-bb16-1e3500150000)

**Type:** Read/Write

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|LED Enabled|u8 (0/1)|Whether any LEDs associated with the device are to be active.|
|1|Screen Enabled|u8 (0/1)|Whether any screens associated with the device are to be active.|

### Button (00afbfe4-00d0-4233-bb16-1e3500150000 ..)

**Type:** Read, Notify

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ObjectiveID|uint32|Unique identifier for the objective|
|4|MetricType|MetricType|Enum identifier for type of metric being counted.|
|5|*padding*|byte[3]|...|
|8|Data*|u8|Union Type of `CounterMetric` and `DurationMetric`|

**CounterMetric**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|LastEventTime|uint64|Last time the counter was clicked|
|8|Total|uint32|Number of events counted|

**DurationMetric**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|StartTime|uint64|Current Event start time (millis since epoch)|
|8|EndTime|uint64|Time the active stopwatch was ended, or 0 if still active.|
|12|EventCount|uint32|Number of times the stopwatch has been started.|
|16|TotalTime|uint32|Total time in milliseconds that the feature has been pressed.|

### Addtional Features?
* Pause session?
* Physical inputs other than buttons?
