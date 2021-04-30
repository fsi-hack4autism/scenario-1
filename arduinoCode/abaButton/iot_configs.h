// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

#ifndef IOT_CONFIGS_H
#define IOT_CONFIGS_H

/** WiFi setup */
#define IOT_CONFIG_WIFI_SSID            "xxx"
#define IOT_CONFIG_WIFI_PASSWORD        "xxx"

/**
 * IoT Hub Device Connection String setup
 * Find your Device Connection String by going to your Azure portal, creating (or navigating to) an IoT Hub, 
 * navigating to IoT Devices tab on the left, and creating (or selecting an existing) IoT Device. 
 * Then click on the named Device ID, and you will have able to copy the Primary or Secondary Device Connection String to this sample.
 */
//#define DEVICE_CONNECTION_STRING    "HostName=AustismHackathon.azure-devices.net;DeviceId=clickSymmetric;SharedAccessKey=0ItpTjtOK94+UYWp8c1s/QX4jnZdYG3bT7oElTGq2uc="
//#define DEVICE_CONNECTION_STRING    "HostName=iothubhackathon.azure-devices.net;DeviceId=clicker2;SharedAccessKey=F/oxvFFy5vRMQsw/R013UtRsNEJ3bV9d5iJyqOwy9O4="
#define DEVICE_CONNECTION_STRING    "HostName=pierreiothub.azure-devices.net;DeviceId=1ewypd2z1c7;SharedAccessKey=eZtkpWV+MD7FnHp9OQErYqzbqAX4CtCbM+rRhZSdy00="

#endif /* IOT_CONFIGS_H */
