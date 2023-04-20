import Foundation
import Lilliput
import SwiftyBluetooth
import CoreBluetooth

typealias OnConnectedCallback = (CricketDevice.DeviceInfo) -> Void


final class CricketDevice: ObservableObject {
    static let shared: CricketDevice = {
        // always configure restore identifier
        SwiftyBluetooth.setSharedCentralInstanceWith(restoreIdentifier: "com.github.fsi-hack4autism.Cricket")
        return CricketDevice()
    }()
    
    private var peripheral: Peripheral?
    private var buttonCallbacks: [CBUUID : ButtonCallback] = [:]
    public var maxButtons = 4
    
    private var session_id: UInt32 = 0
    private var ack_count: UInt32 = 0
    
    @Published var state: ConnectionState = .disconnected
    
    private static let SERVICE_UUID = CBUUID(string: "00afbfe4-0000-4233-bb16-1e3500150000")
    
    enum ConnectionState {
        case disconnected
        case scanning
        case connected
    }
    
    public func scanForPeripherals(timeoutAfter timeout: TimeInterval = 15,
                                   completion: @escaping PeripheralScanCallback) {
        print("Scanning peripherals...")
        SwiftyBluetooth.scanForPeripherals(withServiceUUIDs: [CricketDevice.SERVICE_UUID], options: [:], timeoutAfter: timeout) { result in
            switch result {
            case .scanStarted:
                self.state = .scanning
            case .scanResult:
                break
            case .scanStopped(let peripherals, _):
                // The scan stopped, an error is passed if the scan stopped unexpectedly
                if peripherals.isEmpty {
                    self.state = .disconnected
                }
                break
            }
            completion(result)
        }
    }
    
    func connect(peripheral: Peripheral, completion: @escaping OnConnectedCallback) {
        SwiftyBluetooth.stopScan()
        
        print("Connecting to \(peripheral)...")
        peripheral.connect(withTimeout: 15) { result in
            switch result {
            case .success:
                self.onConnect(peripheral, completion: completion)
            case .failure(_):
                break
            }
        }
    }
    
    private func onConnect(_ peripheral: Peripheral, completion: @escaping OnConnectedCallback) {
        self.peripheral = peripheral
        
        registerForNotifications()
        
        readDeviceInfo { result in
            switch(result) {
            case .success(let deviceInfo):
                self.state = .connected
                completion(deviceInfo)
            case .failure(_):
                // todo: error handling
                break
            }
        }
    }
    
    func disconnect() {
        SwiftyBluetooth.stopScan()
        if let peripheral = self.peripheral {
            // todo: remove from notification center?
            endSession()
            
            peripheral.disconnect { result in
                // nothing special to do
                self.peripheral = nil
                self.state = .disconnected
            }
        }
    }
    
    func isConnected() -> Bool {
        return self.peripheral != nil
    }
    
    private func readValue(ofCharacWithUUID characUUID: CBUUIDConvertible, completion: @escaping ReadCharacRequestCallback) {
        if let peripheral = self.peripheral {
            peripheral.readValue(ofCharacWithUUID: characUUID,
                                 fromServiceWithUUID: CricketDevice.SERVICE_UUID,
                                 completion: completion)
        }
    }
    
    private func writeValue(ofCharacWithUUID characUUID: CBUUIDConvertible,
                            value: Data,
                            type: CBCharacteristicWriteType = .withResponse,
                            completion: @escaping WriteRequestCallback)
    {
        if let peripheral = self.peripheral {
            peripheral.writeValue(ofCharacWithUUID: characUUID,
                                  fromServiceWithUUID: CricketDevice.SERVICE_UUID,
                                  value: value,
                                  type: type,
                                  completion: completion)
        }
    }
}

/** Device info */
extension CricketDevice {
    private static let DEVICE_INFO_CHARACTERISTIC_ID = CBUUID(string: "00afbfe4-0010-4233-bb16-1e3500150000")
    
    public typealias DeviceInfoCallback = (_ result: Result<CricketDevice.DeviceInfo, Error>) -> Void
    
    public struct DeviceInfo {
        let batteryLevel: UInt8
        let maxButtons: UInt8
    }
    
    func readDeviceInfo(completion: @escaping DeviceInfoCallback) {
        readValue(ofCharacWithUUID: CricketDevice.DEVICE_INFO_CHARACTERISTIC_ID) { result in
            completion(
                result.map { data in
                    return DeviceInfo(
                        batteryLevel: data[0],
                        maxButtons: data[1]
                    )
                })
        }
    }
}


/** Settings handling */
extension CricketDevice {
    private static let DEVICE_OPTIONS_CHARACTERISTIC_ID = CBUUID(string: "00afbfe4-0011-4233-bb16-1e3500150000")
    
    typealias SettingsCallback = (_ result: Result<CricketDevice.Settings, Error>) -> Void
    
    struct Settings {
        let ledFeedback: Bool
        let hapticFeedback: Bool
        let autoDiscovery: Bool
    }
    
    func readSettings(completion: @escaping SettingsCallback) {
        readValue(ofCharacWithUUID: CricketDevice.DEVICE_OPTIONS_CHARACTERISTIC_ID) { result in
            completion(
                result.map { data in
                    let flags = Int(data.withUnsafeBytes { $0.load(as: Int32.self ) })
                    print("Loading Device Options (flags=\(flags))...")
                    return CricketDevice.Settings(
                        ledFeedback: (flags & DeviceFlags.LED) == DeviceFlags.LED,
                        hapticFeedback: (flags & DeviceFlags.HAPTICS) == DeviceFlags.HAPTICS,
                        autoDiscovery: (flags & DeviceFlags.AUTO_ADVERTISE) == DeviceFlags.AUTO_ADVERTISE
                    )
                })
        }
    }
    
    func saveSettings(_ settings: Settings, completion: @escaping WriteRequestCallback) {
        var mask = 0
        if settings.ledFeedback {
            mask |= CricketDevice.DeviceFlags.LED
        }
        if settings.hapticFeedback {
            mask |= CricketDevice.DeviceFlags.HAPTICS
        }
        if settings.autoDiscovery {
            mask |= CricketDevice.DeviceFlags.AUTO_ADVERTISE
        }
        
        let data = withUnsafeBytes(of: Int32(mask)) { Data($0) }
        writeValue(ofCharacWithUUID: CricketDevice.DEVICE_OPTIONS_CHARACTERISTIC_ID,
                   value: data,
                   completion: completion)
    }
    
    private class DeviceFlags {
        public static let LED            = 1 << 0
        public static let HAPTICS        = 1 << 1
        public static let AUTO_ADVERTISE = 1 << 2
    }
}

/** Session management */
extension CricketDevice {
    private static let SESSION_STATE_CHARACTERISTIC_ID  = CBUUID(string: "00afbfe4-0001-4233-bb16-1e3500150000")
    
    func startSession(_ id: UInt32) {
        self.session_id = id
        self.ack_count = 0
        self.writeSessionState()
    }
    
    func endSession() {
        self.session_id = 0
        self.ack_count = 0
        
        let data = MemoryBuffer(count: 12)
        let stream = BufferOutputStream(buffer: data)
        try! stream.writeUInt32(self.session_id)
        try! stream.writeUInt32(0x0)
        try! stream.writeUInt32(0)
        
        writeValue(ofCharacWithUUID: CricketDevice.SESSION_STATE_CHARACTERISTIC_ID,
                   value: Data()) { result in
            // clean up
            self.buttonCallbacks.removeAll()
        }
    }
    
    func ack() {
        self.ack_count += 1;
        self.writeSessionState()
    }
    
    private func writeSessionState() {
        let data = MemoryBuffer(count: 12)
        let stream = BufferOutputStream(buffer: data)
        try! stream.writeUInt32(self.session_id)
        try! stream.writeUInt32(0x1)
        try! stream.writeUInt32(self.ack_count)
        
        writeValue(ofCharacWithUUID: CricketDevice.SESSION_STATE_CHARACTERISTIC_ID,
                   value: Data(bytes: data.bytes, count: data.count)) { result in
            
        }
    }
}

/** Button handling */
extension CricketDevice {
    private static let BUTTON_UUIDS = [
        CBUUID(string: "00afbfe4-00d0-4233-bb16-1e3500150000"),
        CBUUID(string: "00afbfe4-00d1-4233-bb16-1e3500150000"),
        CBUUID(string: "00afbfe4-00d2-4233-bb16-1e3500150000"),
        CBUUID(string: "00afbfe4-00d3-4233-bb16-1e3500150000"),
        CBUUID(string: "00afbfe4-00d4-4233-bb16-1e3500150000")
    ]
    
    public typealias ButtonCallback = (_ data: Data) -> Void
    
    private func registerForNotifications() {
        // prep for notifications
        NotificationCenter.default.addObserver(forName: Peripheral.PeripheralCharacteristicValueUpdate,
                                               object: peripheral,
                                               queue: nil) { (notification) in
            let charac = notification.userInfo!["characteristic"] as! CBCharacteristic
            if let callback = self.buttonCallbacks[charac.uuid] {
                callback(charac.value!)
                self.ack();
            }
        }
    }
    
    func subscribeButton(buttonId: Int, onNotify: @escaping ButtonCallback) {
        let buttonUUID = CricketDevice.BUTTON_UUIDS[buttonId]
        guard let peripheral = self.peripheral else {
            print("Peripheral is not ready for subscription!")
            return
        }
        
        self.buttonCallbacks[buttonUUID] = onNotify
        
        peripheral.setNotifyValue(toEnabled: true,
                                  forCharacWithUUID: buttonUUID,
                                  ofServiceWithUUID: CricketDevice.SERVICE_UUID) { result in
            // nothing to do
        }
    }
}
