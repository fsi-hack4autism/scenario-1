#
# This tool is used for testing the hardware device. In the real world it will be replaced by a mobile Application.
#
import asyncio
from bleak import BleakClient, BleakScanner
from collections import namedtuple
from enum import Enum, Flag
import hexdump
import logging
import random
import struct
from time import time

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.INFO)

# BLE Device specific UUIDs
DEVICE_NAME = "ABA Cricket"
SERVICE_UUID = "00afbfe4-0000-4233-bb16-1e3500150000"
SESSION_STATE_UUID = "00afbfe4-0001-4233-bb16-1e3500150000"
DEVICE_INFO_UUID = "00afbfe4-0010-4233-bb16-1e3500150000"
DEVICE_OPTIONS_UUID = "00afbfe4-0011-4233-bb16-1e3500150000"
BUTTON_UUIDS = [
    "00afbfe4-00d0-4233-bb16-1e3500150000",
    "00afbfe4-00d1-4233-bb16-1e3500150000",
    "00afbfe4-00d2-4233-bb16-1e3500150000",
    "00afbfe4-00d3-4233-bb16-1e3500150000"
]

# Feature flags
FEATURE_LED = 0x1
FEATURE_HAPTICS = 0x2
FEATURE_AUTO_ADVERTISE = 0x4

# session state
client = None
session_id = random.randint(1,100)
ack_count = 0

async def on_notification(sender, data):
    """Push notification on a button event."""
    click_count = struct.unpack("<I", data)[0]
    logging.info("%s: Click: total=%d" % (sender.uuid, click_count))

    global ack_count
    ack_count += 1
    await client.write_gatt_char(SESSION_STATE_UUID, struct.pack("<III", session_id, 0x1, ack_count))


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

    global client
    async with BleakClient(address) as client:
        # general device stats
        device_info = await client.read_gatt_char(DEVICE_INFO_UUID)
        _battery, button_count = struct.unpack("<BB", device_info)
        logging.info("Device has %d buttons..." % (button_count))
        await asyncio.sleep(1)

        # example device toggle, haptic feedback/leds can be controlled here
        features = FEATURE_LED | FEATURE_HAPTICS | FEATURE_AUTO_ADVERTISE
        logging.info("Applying feedback defaults: 0x%X" % features)
        await client.write_gatt_char(DEVICE_OPTIONS_UUID, struct.pack("<I", features))

        # initiate a therapy session, test objectives mapped to buttons.
        # see Data.h for the struct mangling here.
        logging.info("Sending start of session: %d" % session_id)
        await client.write_gatt_char(SESSION_STATE_UUID, struct.pack("<III", session_id, 0x1, 0))

        # passively poll for notifications
        logging.info("Subscribing to all button notifications...")
        for button_uuid in BUTTON_UUIDS:
            await client.start_notify(button_uuid, on_notification)

        # perpetually await notifications
        while True:
            await asyncio.sleep(1)


asyncio.run(main())
