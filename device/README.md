# ABA "Cricket" Device

This interface is targetted for creating a simple “clicker” that can help record/count events vital to helping in ABA therapy.  Having a dedicated device with a physical button(s) removes all the distractions of an app on a shared device.

The general flow would be: *Button → Microcontroller (NodeMCU) → Mobile App -> Cloud (Azure Iot Hub) → Azure Function (moves IotHub to CosmosDB)*

![Cricket in Hand](art/iot-cricket-1.jpg?raw=true)
![Cricket Half Boxed](art/iot-cricket-2.jpg?raw=true)
![Cricket Unboxed](art/iot-cricket-3.jpg?raw=true)

## Hardware

* [TTGO T7 v1.3 ESP32 board](https://docs.platformio.org/en/stable/boards/espressif32/ttgo-t7-v13-mini32.html)
  * [Amazon](https://www.amazon.com/HiLetgo-Mini-ESP32-Bluetooth-Module/dp/B082216QGR) (Rebadged by HiLetgo)
  * [Aliexpress](https://www.aliexpress.com/item/32846710180.html?spm=a2g0o.productlist.0.0.14b86d6aEJ5k3W)
* [1000mah Lithium-ion battery with JST1.25 connector](https://www.amazon.com/MakerFocus-Rechargable-Protection-Insulated-Development/dp/B07CXNQ3ZR)
* 4 x [6x6x6.5mm Tactile Switches with Caps](https://www.amazon.com/OCR-Tactile-Momentary-Switches-Colorful/dp/B07CMZCQS5)
* [Adafruit Perma-Proto Quarter-sized Breadboard](https://www.adafruit.com/product/589) (Cut in half)
* [61x36x25mm Project Box](https://www.amazon.com/Zulkit-Project-Plastic-Electrical-Junction/dp/B07Q11F7DS?th=1)
  
### Device Schematics

TODO

## Software

Open the project in VSCode and install the [Platform IO Extension](https://platformio.org/install/ide?install=vscode).

## Bluetooth LE Specification

The following describes the BLE GATT. Note that all structures are Little Endian and aligned to a 4 byte word.

Device UUID: 00afbfe4-0000-4233-bb16-1e3500150000

### Session Initiation (UUID: 00afbfe4-0001-4233-bb16-1e3500150000)

**Type:** Write, *Read*

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|SessionID|uint32|Unique session identifier, a new identifier will reset the session and all metrics.|
|4|StartTime|uint64|Session Start Time (millis since epoch 1970-01-01)|
|12|EndTime|uint64|Session End Time, or 0 on initiation.|
|20|ObjectiveCount|uint8|Number of objectives to map to physical buttons.|
|21|*padding*|byte[3]|...|
|28|Objective[5]| |Struct|

**Objective**

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ID|uint32_t|Unique identifier for the objective|
|4|Name|char[16]|Human readable name for the objective|
|20|MetricType|u8|Enum identifier for type of metric being counted.|
|21|*padding*|byte[3]|...|

**MetricType**
* 0 : Counter
* 1 : StopWatch
* 2 : // Latency? .. future

### Session End (UUID: 00afbfe4-0002-4233-bb16-1e3500150000)

**Type:** Write

No payload. Sets the session end time as inspected on the SessionManagement.

### Device State (UUID: 00afbfe4-0010-4233-bb16-1e3500150000)

**Type:** Read

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Battery Level|u8|Level between 0-100 representing battery level -- not yet implemented.|
|1|Buttons|u8|The number of physical 'button' types available on the device.|

### Device Options (UUID: 00afbfe4-0011-4233-bb16-1e3500150000)

**Type:** Read/Write

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|LED Enabled|u8 (0/1)|Whether any LEDs associated with the device are to be active.|
|1|Haptics Enabled|u8 (0/1)|Whether any physical haptics associated with the device are to be active.|

### Button (UUID: 00afbfe4-00d0-4233-bb16-1e3500150000 ..)

**Type:** Read, Notify

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ObjectiveID|uint32|Unique identifier for the objective|
|4|MetricType|MetricType|Enum identifier for type of metric being counted.|
|5|*padding*|byte[3]|...|
|8|Data*|...|Union Type of `CounterMetric` and `DurationMetric` (see below)|

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

### Addtional Features to consider?
* Pause session?
* Physical inputs other than buttons?
