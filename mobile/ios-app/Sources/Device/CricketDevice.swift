import Foundation
import Lilliput
import SwiftyBluetooth
import CoreBluetooth

typealias OnConnectedCallback = (CricketDevice.DeviceInfo) -> Void

final class CricketDevice: NSObject {
    static let shared: CricketDevice = {
        // always configure restore identifier
        SwiftyBluetooth.setSharedCentralInstanceWith(restoreIdentifier: "com.github.fsi-hack4autism.Cricket")
        return CricketDevice()
    }()
    
    private var peripheral: Peripheral?
    private var buttonCallbacks: [CBUUID : ButtonCallback] = [:]
    
    private static let SERVICE_UUID = "00afbfe4-0000-4233-bb16-1e3500150000"
    
    public func scanForPeripherals(options: [String : Any]? = nil,
                                   timeoutAfter timeout: TimeInterval = 15,
                                   completion: @escaping PeripheralScanCallback) {
        print("Scanning peripherals...")
        SwiftyBluetooth.scanForPeripherals(withServiceUUIDs: [CricketDevice.SERVICE_UUID], options: options, timeoutAfter: timeout) { result in
            print("Scan update: \(result)")
            completion(result)
        }
    }
    
    func connect(peripheral: Peripheral, completion: @escaping OnConnectedCallback) {
        SwiftyBluetooth.stopScan()
        
        print("Connecting to \(peripheral.name!)...")
        peripheral.connect(withTimeout: 15) { result in
            switch result {
            case .success:
                self.onConnect(peripheral, completion: completion)
            case .failure(_):
                break
            }
        }
    }
    
    func onConnect(_ peripheral: Peripheral, completion: @escaping OnConnectedCallback) {
        self.peripheral = peripheral
        
        registerForNotifications()
        
        readDeviceInfo { result in
            switch(result) {
            case .success(let deviceInfo):
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
            
            peripheral.disconnect { result in
                // nothing special to do
                self.peripheral = nil
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
    private static let DEVICE_INFO_CHARACTERISTIC_ID = "00afbfe4-0010-4233-bb16-1e3500150000"
    
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
    private static let DEVICE_OPTIONS_CHARACTERISTIC_ID = "00afbfe4-0011-4233-bb16-1e3500150000"
    
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
    private static let START_SESSION_CHARACTERISTIC_ID  = "00afbfe4-0001-4233-bb16-1e3500150000"
    private static let END_SESSION_CHARACTERISTIC_ID    = "00afbfe4-0002-4233-bb16-1e3500150000"
    
    private class ObjectiveType {
        public static let COUNTER: UInt8 = 1
        public static let DURATION: UInt8 = 2
        public static let LATENCY: UInt8 = 3
    }
    
    struct SessionStart {
        let id: UInt32
        let startTime: UInt64
        let objectives: [Objective]
    }
    
    func startSession(_ sessionStart: SessionStart, completion: @escaping WriteRequestCallback) {
        let data = MemoryBuffer(count: 256)
        let stream = BufferOutputStream(buffer: data)
        
        // session header
        try! stream.writeUInt32(sessionStart.id)
        try! stream.writeUInt64(sessionStart.startTime)
        try! stream.writeUInt64(0)
        try! stream.writeUInt8(UInt8(sessionStart.objectives.count))
        // padding
        for _ in 0..<3 {
            try! stream.writeInt8(0)
        }
        
        // objectives
        for objective in sessionStart.objectives {
            try! stream.writeUInt32(UInt32(objective.id))
            let name = [UInt8](objective.title.padding(toLength: 16, withPad: " ", startingAt: 0).utf8)
            try! stream.write(bytes: name, count: 16)
            switch(objective.measurementType) {
            case .counter:  try! stream.writeUInt8(CricketDevice.ObjectiveType.COUNTER)
            case .duration: try! stream.writeUInt8(CricketDevice.ObjectiveType.DURATION)
            case .latency:  try! stream.writeUInt8(CricketDevice.ObjectiveType.LATENCY)
            }
            // padding
            for _ in 0..<3 {
                try! stream.writeInt8(0)
            }
        }
        
        writeValue(ofCharacWithUUID: CricketDevice.START_SESSION_CHARACTERISTIC_ID,
                   value: Data(bytes: data.bytes, count: data.count),
                   completion: completion)
    }
    
    func endSession() {
        writeValue(ofCharacWithUUID: CricketDevice.END_SESSION_CHARACTERISTIC_ID,
                   value: Data()) { result in
            // clean up
            self.buttonCallbacks.removeAll()
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
