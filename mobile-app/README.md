# Dev env setup:
- Install mobile dev kit in VS - Instructions (ignore all the other steps): https://dotnet.microsoft.com/en-us/learn/xamarin/hello-world-tutorial/install
- Connect phone via USB, enable dev mode - Instructions (ignore all other steps): https://dotnet.microsoft.com/en-us/learn/xamarin/hello-world-tutorial/devicesetup
- If you want to see/use your phone on your PC, install Vysor for screen mirror - https://www.vysor.io/

# App UI requirements:
- Connect page
	- expose bluetooth scan button
	- list bluetooth devices
	- on tap, connect
  - display connected
- Session page
	- Choose Patient from dropdown
	- Load Profile (button mappings, objectives list)

Mock\-up:
## Patient Name [Button - Start/Stop Session]
| Action                     | Behavior  | Button                   |
|----------------------------|-----------|--------------------------|
| [increment counter]        | [say dog] | [#] or [Button - Assign] |
| [mark start] or [mark end] |           | [2]                      |

# App functionality requirements
- Connect page
  - Handle scan button tap
  - Connect to BLE device
  - Check for connected
- Session page
  - MVP - button assignments hard-coded
  - Patient dropdown handler should load patient profile from API
    - stretch goal -- and button mappings from local cache
  - "Start session" button should generate a new session ID and associate all behaviors recorded afterward with it
  - "Increment" counter button (or number control or whatever) and "Start" and "End session" buttons should post or queue event to event API
  - stretch goal -- "Assign" button in session behavior table should list available buttons or wait for user to press desired button on hardware device

# Reference
The contract for messages from the BluetoothLE device can be found here: https://github.com/Nasdaq/fsi-hack4autism/tree/main/device/cricket