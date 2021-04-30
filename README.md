# scenario-1

This scenario is targetted for creating a simple “clicker” that can help record/count events vital to helping in ABA therapy.  At the core, it is about having a dedicated device to record clicks and automatically share the information in a cloud.  Having a dedicated device with a physical button(s) removes all the distractions of an app on a shared device.

Button → Microcontroller (NodeMCU) → Cloud (Azure Iot Hub) → Azure Function (moves IotHub to CosmosDB)

There are a few basics one layer deeper.  The button needs to be wired and housed in a case with the microcontroller and a battery.  The microcontroller needs to be connected to a wireless network and have secure access.  The cloud needs to supply an endpoint to capture the data for later analysis.

For the intial version, we are looking at the following.

Button : Any simple momentary button switch.  This can be any hardware to capture an event.

NodeMCU:  https://www.nodemcu.com/  This controller is fully open source, fairly easy to load/program, has very low power consumption, and is inexpensive.  We can power it for the hackathon using any simple USB battery pack.  We will leverage the Arduino IDE to ease in programming.  https://www.arduino.cc/ 

Physical Case: While the proof of concept might be shown using a cardboard box or tupperware container, the hackathon will start the design of the custom case, which can be 3D printed.  The designs may use any modelling software.  We will start with FreeCAD or  Blender (https://www.blender.org/)  The native blender files as well as STL files for ease in 3D printing will be shared in the repository.

MQTT Protocol:  https://mqtt.org/ MQTT is becoming the standard for IoT devices.  Most Cloud providers have a platform for receiving these messages.  It is lightweight and allows for easy asynchronous communication streams.  Azure has a mechanism which can be used in the hackathon.

Data Analysis:  TDB. 



