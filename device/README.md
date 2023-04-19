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

### Session (UUID: 00afbfe4-0001-4233-bb16-1e3500150000)

**Type:** Write, *Read*

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|SessionID|uint32|Unique session identifier, a new identifier will reset the session and all metrics.|
|4|Active|uint32|0x0 = Active, 0x1 = Inactive|
|8|EventCount|uint32|The number of remote acknowledgements of clicks that have been received. Not all clicks necessarily come from the IOT device.|

### Button (UUID: 00afbfe4-00d0-4233-bb16-1e3500150000 ..)

**Type:** Read, Notify

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|ClickCount|uint32|Number of unique clicks on the IOT device for this button.|

### Device Options (UUID: 00afbfe4-0011-4233-bb16-1e3500150000)

**Type:** Write, *Read*

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Flags|uint32|FLAG_LED = 0x1, FLAG_HAPTICS = 0x2, FLAG_AUTO_ADVERTISE = 0x4|

### Device State (UUID: 00afbfe4-0010-4233-bb16-1e3500150000)

**Type:** Read

|Offset|Name|Data Type|Notes|
|------|----|---------|-----|
|0|Battery Level|u8|Level between 0-100 representing battery level -- not yet implemented.|
|1|Buttons|u8|The number of physical 'button' types available on the device.|

