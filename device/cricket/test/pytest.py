import asyncio
from bleak import BleakClient, BleakScanner
import platform
import struct
from time import time

from enum import Enum
from collections import namedtuple

SERVICE_UUID = "00afbfe4-0000-4233-bb16-1e3500150000"
SESSION_START_UUID = "00afbfe4-0001-4233-bb16-1e3500150000"
DEVICE_INFO_UUID = "00afbfe4-0010-4233-bb16-1e3500150000"
DEVICE_OPTIONS_UUID = "00afbfe4-0011-4233-bb16-1e3500150000"
BUTTON0_UUID = "00afbfe4-00d0-4233-bb16-1e3500150000"
BUTTON1_UUID = "00afbfe4-00d1-4233-bb16-1e3500150000"
BUTTON2_UUID = "00afbfe4-00d2-4233-bb16-1e3500150000"
BUTTON3_UUID = "00afbfe4-00d3-4233-bb16-1e3500150000"

Objective = namedtuple("Objective", ["id", "name", "metric_type"])

ADDRESS = (
    "44:17:93:8C:16:2A"
    if platform.system() != "Darwin"
    #else "4E6ED3BE-65A9-34DC-AC4B-2AD871768A35"
    else "2CF94D87-A3BE-EF06-6D3E-DC28B5E6095C"
)


def on_notification(sender, data):
    objective_id, metric_type = struct.unpack("<IBxxx", data[:8])

    if metric_type == 0:
        # counter update
        timestamp, total = struct.unpack("<QI", data[8:20])
        print("%d: Count: objective_id=%d, total=%d" % (timestamp, objective_id, total))

    elif metric_type == 1:
        # duration update
        start_timestamp, end_timestamp, event_count, total_time = struct.unpack("<QQII", data[8:32])
        print("%d: Duration: objective_id=%d, event_count=%d, total_time=%d" % (start_timestamp, objective_id, event_count, total_time))


async def main():
    # devices = await BleakScanner.discover()
    # for d in devices:
    #     print("%s %s %s" % (d.name, d.address, d.rssi))

    async with BleakClient(ADDRESS) as client:
        print("Client established")

        # general device stats
        device_info = await client.read_gatt_char(DEVICE_INFO_UUID)
        print("battery: %d%%, buttons: %d" % struct.unpack("<BB", device_info))
        await asyncio.sleep(1)       

        # disable leds
        lcd_enabled = False
        led_enabled = True
        await client.write_gatt_char(DEVICE_OPTIONS_UUID, struct.pack("<BB", lcd_enabled, led_enabled))

        # begin session
        session_id = 1
        start_time = int(time() * 1000)
        objectives = [
            Objective(1, "Test 1", 0), 
            Objective(2, "Test 2", 0),
            Objective(3, "Test 3", 1),
            Objective(4, "Test 4", 0),
        ]
        objective_data = b"".join([struct.pack("<I16sBxxx", obj.id, obj.name.encode("utf-8"), obj.metric_type) for obj in objectives])
        session_data = struct.pack("<IQQBxxx", session_id, start_time, 0, len(objectives)) + objective_data
        await client.write_gatt_char(SESSION_START_UUID, session_data)
        
        # passively poll for notifications
        await client.start_notify(BUTTON0_UUID, on_notification)
        await client.start_notify(BUTTON1_UUID, on_notification)
        await client.start_notify(BUTTON2_UUID, on_notification)
        await client.start_notify(BUTTON3_UUID, on_notification)

        while True:        
            await asyncio.sleep(1)

asyncio.run(main())