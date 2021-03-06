// This is a base for an iot device that can track button presses for "Applied Behavior Analysis"
//
// Note: PLEASE see https://github.com/Azure/azure-iot-arduino#simple-sample-instructions for detailed sample setup instructions.
//
// TODO:
// -Error handling and reconnect
// -Device setup --- how do we get initial wifi info and connection string on it.

#include <AzureIoTHub.h>
#include <stdio.h>
#include <stdlib.h>
#include <FastLED.h>

#include "iot_configs.h" // You must set your wifi SSID, wifi PWD, and your IoTHub Device Connection String in iot_configs.h
#include "sample_init.h"

#ifdef is_esp_board
  #include "Esp.h"
#endif

#include "AzureIoTProtocol_MQTT.h"
#include "iothubtransportmqtt.h"

#define BUTTON_1 5   // On NodeMCU #4 is labelled D1
#define BUTTON_2 4   // On NodeMCU #4 is labelled D2
#define STATUS_PIN 14   // On NodeMCU #14 is labelled D5

static const char ssid[] = IOT_CONFIG_WIFI_SSID;
static const char pass[] = IOT_CONFIG_WIFI_PASSWORD;

/* Define several constants/global variables */
static const char* connectionString = DEVICE_CONNECTION_STRING;
static size_t g_message_count_send_confirmations = 0;
static size_t g_message_count_send_out = 0;

unsigned long debounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 50;    // the debounce time; increase if the output flickers

IOTHUB_MESSAGE_HANDLE message_handle;
IOTHUB_DEVICE_CLIENT_LL_HANDLE device_ll_handle;

int receiveContext = 0;

#define BUTTON_COUNT 2
unsigned long buttonStart[BUTTON_COUNT]; // startTimes for each button 
int buttonPin[BUTTON_COUNT];
#define QUEUE_SIZE 10
String message_queue[QUEUE_SIZE];
int message_put_position = 0;
int message_send_position = 0;

// Initialize status light
CRGB leds[1];

void setup() { 

  buttonPin[0] = BUTTON_1;
  pinMode(buttonPin[0], INPUT_PULLUP);
  buttonPin[1] = BUTTON_2;
  pinMode(buttonPin[1], INPUT_PULLUP);

  FastLED.addLeds<WS2812B, STATUS_PIN, GRB>(leds, 1);
  //leds[0] = CRGB::Blue;
  leds[0] = CRGB(20,0,0); // Dim red
  FastLED.show(); 
  
    // Select the Protocol to use with the connection
    IOTHUB_CLIENT_TRANSPORT_PROVIDER protocol = MQTT_Protocol;

    sample_init(ssid, pass);

    // Used to initialize IoTHub SDK subsystem
    (void)IoTHub_Init();
    // Create the iothub handle here
    device_ll_handle = IoTHubDeviceClient_LL_CreateFromConnectionString(connectionString, protocol);
    LogInfo("Creating IoTHub Device handle\r\n");

    if (device_ll_handle == NULL) {
        LogInfo("Error AZ002: Failure creating Iothub device. Hint: Check you connection string.\r\n");
    } else {
        // Set any option that are neccessary.
        // For available options please see the iothub_sdk_options.md documentation in the main C SDK
        
        // turn off diagnostic sampling
        int diag_off = 0;
        IoTHubDeviceClient_LL_SetOption(device_ll_handle, OPTION_DIAGNOSTIC_SAMPLING_PERCENTAGE, &diag_off);

        // Setting the Trusted Certificate.
        IoTHubDeviceClient_LL_SetOption(device_ll_handle, OPTION_TRUSTED_CERT, certificates);

        //Setting the auto URL Encoder (recommended for MQTT). Please use this option unless
        //you are URL Encoding inputs yourself.
        bool urlEncodeOn = true;
        IoTHubDeviceClient_LL_SetOption(device_ll_handle, OPTION_AUTO_URL_ENCODE_DECODE, &urlEncodeOn);

        /* Setting Message call back, so we can receive Commands. */
        if (IoTHubClient_LL_SetMessageCallback(device_ll_handle, receive_message_callback, &receiveContext) != IOTHUB_CLIENT_OK)
        {
            LogInfo("ERROR: IoTHubClient_LL_SetMessageCallback..........FAILED!\r\n");
        }

        // Setting connection status callback to get indication of connection to iothub
        (void)IoTHubDeviceClient_LL_SetConnectionStatusCallback(device_ll_handle, connection_status_callback, NULL);
    }
        LogInfo("Setup complete\r\n");

    for (int i = 0; i < QUEUE_SIZE; i++) {
      message_queue[message_put_position];
    }  
    leds[0] = CRGB(0,20,0); // Dim green

  FastLED.show(); 

}

void loop(void) {
  // Check the button status
  if(millis() > debounceTime) {
    checkButton(0);   // Loop through all the buttons...
    checkButton(1);
  }
  sendFromQueue();
}

void checkButton(int i) {
  // Check to see if the 
  int state = digitalRead(buttonPin[i]);
  if(state == LOW && buttonStart[i] == 0) {
    buttonStart[i] = time(NULL);
    debounceTime = millis() + debounceDelay;
  } else if(state == HIGH && buttonStart[i] != 0) {
    queueMessage(i, buttonStart[i], time(NULL));
    buttonStart[i] = 0;
    debounceTime = millis() + debounceDelay;
  }
}

void queueMessage(int button, unsigned long startTime, unsigned long endTime) {
    String message = "{\"device_id\":";
    message += 1;
    message += ",\"button_id\":";
    message += button;
    message += ",\"start_time\":";
    message += startTime;
    message += ",\"end_time\":";
    message += endTime;
    message += "}";
    message_queue[message_put_position] = message;
    message_put_position = (message_put_position + 1) % QUEUE_SIZE;
    Serial.println(message);
}

void sendFromQueue() {
  if(message_queue[message_send_position] != "") {
      sendEventToHub(message_queue[message_send_position].c_str());
      message_queue[message_send_position] = "";
      message_send_position = (message_send_position + 1) % QUEUE_SIZE;
  }   
}

/* -- receive_message_callback --
 * Callback method which executes upon receipt of a message originating from the IoT Hub in the cloud. 
 * Note: Modifying the contents of this method allows one to command the device from the cloud. 
 */
static IOTHUBMESSAGE_DISPOSITION_RESULT receive_message_callback(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
{
    int* counter = (int*)userContextCallback;
    const unsigned char* buffer;
    size_t size;
    const char* messageId;

    // Message properties
    if ((messageId = IoTHubMessage_GetMessageId(message)) == NULL)
    {
        messageId = "<null>";
    }

    // Message content
    if (IoTHubMessage_GetByteArray(message, (const unsigned char**)&buffer, &size) != IOTHUB_MESSAGE_OK)
    {
        LogInfo("unable to retrieve the message data\r\n");
    }
    else
    {
        LogInfo("Received Message [%d]\r\n Message ID: %s\r\n Data: <<<%.*s>>> & Size=%d\r\n", *counter, messageId, (int)size, buffer, (int)size);
    }

    /* Some device specific action code goes here... */
    (*counter)++;
    return IOTHUBMESSAGE_ACCEPTED;
}


/* -- send_confirm_callback --
 * Callback method which executes upon confirmation that a message originating from this device has been received by the IoT Hub in the cloud.
 */
static void send_confirm_callback(IOTHUB_CLIENT_CONFIRMATION_RESULT result, void* userContextCallback)
{
    (void)userContextCallback;
    // When a message is sent this callback will get envoked
    g_message_count_send_confirmations++;
    LogInfo("Confirmation callback received for message %lu with result %s\r\n", (unsigned long)g_message_count_send_confirmations, MU_ENUM_TO_STRING(IOTHUB_CLIENT_CONFIRMATION_RESULT, result));
}

/* -- connection_status_callback --
 * Callback method which executes on receipt of a connection status message from the IoT Hub in the cloud.
 */
static void connection_status_callback(IOTHUB_CLIENT_CONNECTION_STATUS result, IOTHUB_CLIENT_CONNECTION_STATUS_REASON reason, void* user_context)
{
    (void)reason;
    (void)user_context;
    // This DOES NOT take into consideration network outages.
    if (result == IOTHUB_CLIENT_CONNECTION_AUTHENTICATED)
    {
        LogInfo("The device client is connected to iothub\r\n");
    }
    else
    {
        LogInfo("The device client has been disconnected\r\n");
    }
}

static void sendEventToHub(const char* message)
{
    int result = 0;

    // Construct the iothub message from a string or a byte array
    message_handle = IoTHubMessage_CreateFromString(message);
  g_message_count_send_out++;
  
    LogInfo("Sending message %lu to IoTHub \r\n", g_message_count_send_out);
    result = IoTHubDeviceClient_LL_SendEventAsync(device_ll_handle, message_handle, send_confirm_callback, NULL);
    // The message is copied to the sdk so the we can destroy it
    IoTHubMessage_Destroy(message_handle);
    IoTHubDeviceClient_LL_DoWork(device_ll_handle);

    LogInfo("Done sending");
}
