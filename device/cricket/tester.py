import asyncio
from bleak import BleakClient, BleakScanner
import platform
import struct
from time import time

DEVICE_UUID = "00AFBFE4-0000-4233-BB16-1E3500152342"
SESSION_START_UUID = "00000001-0000-1000-8000-00805f9b34fb"
DEVICE_INFO_UUID = "00000010-0000-1000-8000-00805f9b34fb"
DEVICE_OPTIONS_UUID = "00000011-0000-1000-8000-00805f9b34fb"
BUTTON0_UUID = "000000d0-0000-1000-8000-00805f9b34fb"

ADDRESS = (
    "24:71:89:cc:09:05"
    if platform.system() != "Darwin"
    else "4E6ED3BE-65A9-34DC-AC4B-2AD871768A35"
)

async def main():
    # devices = await BleakScanner.discover()
    # for d in devices:
    #     print("%s %s %s %s" % (d.name, d.address, d.rssi, d.metadata))

    async with BleakClient(ADDRESS) as client:
        print("Client established")
        
        # general device stats
        device_info = await client.read_gatt_char(DEVICE_INFO_UUID)
        print("battery: %d%%, buttons: %d" % struct.unpack("<BB", device_info))
        await asyncio.sleep(1)

        # disable leds
        lcd_enabled = False
        led_enabled = False
        await client.write_gatt_char(DEVICE_OPTIONS_UUID, struct.pack("<BB", lcd_enabled, led_enabled))

        # begin session
        session_id = 1
        start_time = int(time() * 1000)
        objectives = struct.pack("<I20sB", 1, "Hello World".encode("utf-8"), 0)
        await client.write_gatt_char(SESSION_START_UUID, struct.pack("<IQQBxxx", session_id, start_time, 0, 1) + objectives)
        
        # actively poll for notifications (for now)
        while True:
            data = await client.read_gatt_char(BUTTON0_UUID)
            if len(data) == 0:
                continue

            print("Click: objective_id=%d, metric_type=%d, time=%d, total=%d" % struct.unpack("<IBxxxQI", data[:20]))
            await asyncio.sleep(1)

asyncio.run(main())


