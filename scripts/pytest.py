#
# This tool is used for testing the hardware device. In the real world it will be replaced by a mobile Application.
#
import asyncio
from bleak import BleakClient, BleakScanner
from collections import namedtuple
from enum import Enum
import hexdump
import logging
import struct
from time import time

# BLE Device specific UUIDs
DEVICE_NAME         = "ABA Cricket"
SERVICE_UUID        = "00afbfe4-0000-4233-bb16-1e3500150000"
SESSION_START_UUID  = "00afbfe4-0001-4233-bb16-1e3500150000"
DEVICE_INFO_UUID    = "00afbfe4-0010-4233-bb16-1e3500150000"
DEVICE_OPTIONS_UUID = "00afbfe4-0011-4233-bb16-1e3500150000"
BUTTON_UUIDS = [
    "00afbfe4-00d0-4233-bb16-1e3500150000",
    "00afbfe4-00d1-4233-bb16-1e3500150000",
    "00afbfe4-00d2-4233-bb16-1e3500150000",
    "00afbfe4-00d3-4233-bb16-1e3500150000"
]

# Constants
COUNTER_TYPE = 0
DURATION_TYPE = 1
Objective = namedtuple("Objective", ["id", "name", "metric_type"])

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.INFO)


def on_notification(sender, data):
    """Push notification on a button event."""
    # print(hexdump.dump(data))
    objective_id, metric_type = struct.unpack("<IBxxx", data[:8])
    if metric_type == COUNTER_TYPE:
        # counter update
        timestamp, total = struct.unpack("<QI", data[8:20])
        logging.info("Count: objective_id=%d, ts=%d, total=%d" %
                     (objective_id, timestamp, total))
    elif metric_type == DURATION_TYPE:
        # duration update
        start_timestamp, end_timestamp, event_count, total_time = struct.unpack("<QQII", data[8:32])
        if end_timestamp == 0:
            logging.info("StartInterval: objective_id=%d, ts=%d" %
                         (objective_id, start_timestamp))
        else:
            logging.info("EndInterval: objective_id=%d, ts=%d, event_count=%d, total_time=%d" % (
                objective_id, start_timestamp, event_count, total_time))


async def main():
    # Used for device discovery and determining an appropriate address.
    logging.info("Searching for \"%s\" device..." % DEVICE_NAME)
    devices = await BleakScanner.discover()
    address = None
    for d in devices:
        if d.name == DEVICE_NAME:
            address = d.address
            break

    if not address:
        logging.info("Device not found!!")
        return

    logging.info("Connecting to device at address %s..." % address)

    async with BleakClient(address) as client:
        # general device stats
        device_info = await client.read_gatt_char(DEVICE_INFO_UUID)
        _battery, button_count = struct.unpack("<BB", device_info)
        logging.info("Device has %d buttons..." % (button_count))
        await asyncio.sleep(1)

        # example device toggle, haptic feedback/leds can be controlled here
        logging.info("Applying feedback defaults")
        led_enabled = True
        haptics_enabled = False
        await client.write_gatt_char(DEVICE_OPTIONS_UUID, struct.pack("<BB", led_enabled, haptics_enabled))

        # initiate a therapy session, test objectives mapped to buttons.
        # see Data.h for the struct mangling here.
        session_id = 1
        start_time = int(time() * 1000)
        objectives = [
            Objective(1, "Test 1", COUNTER_TYPE),
            Objective(2, "Test 2", COUNTER_TYPE),
            Objective(3, "Test 3", DURATION_TYPE),
            Objective(4, "Test 4", COUNTER_TYPE),
        ]
        objective_data = b"".join([struct.pack("<I16sBxxx", obj.id, obj.name.encode("utf-8"), obj.metric_type) for obj in objectives])
        session_data = struct.pack("<IQQBxxx", session_id, start_time, 0, len(objectives)) + objective_data
        
        logging.info("Sending start of session")
        await client.write_gatt_char(SESSION_START_UUID, session_data)

        # passively poll for notifications
        logging.info("Subscribing to all button notifications...")
        for button_uuid in BUTTON_UUIDS:
            await client.start_notify(button_uuid, on_notification)

        # perpetually await notifications
        while True:
            await asyncio.sleep(1)


asyncio.run(main())
