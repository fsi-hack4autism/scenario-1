import Combine
import SwiftUI
import SwiftyBluetooth

struct PairDeviceView: View {
    @StateObject private var device = CricketDevice.shared
    @StateObject private var viewModel = ViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                // todo: we can do better than this
                switch (device.state) {
                case .disconnected:
                    Button(action: viewModel.scan) {
                        Text("Connect")
                    }
                    .buttonStyle(.bordered)
                    .tint(.green)
                    
                case .scanning:
                    Text("Scanning...").padding()
                    Button(action: viewModel.stopScan) {
                        Text("Stop")
                    }
                    .buttonStyle(.bordered)
                    .tint(.red)
                    
                case .connected:
                    HStack {
                        NavigationLink(destination: SettingsView()) {
                            Text("Settings")
                        }
                        .buttonStyle(.bordered)
                        .tint(.blue)
                        
                        Button(action: viewModel.disconnect) {
                            Text("Disconnect")
                        }
                        .buttonStyle(.bordered)
                        .tint(.red)
                    }
                }
            }
            .navigationTitle("Device Management")
            .navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }
}

extension PairDeviceView {
    class ViewModel : ObservableObject {
        func scan() {
            CricketDevice.shared.scanForPeripherals { scanResult in
                switch scanResult {
                case .scanStarted:
                    break
                case .scanResult(let peripheral, _, _):
                    // todo: fixme: there may be multiple matches
                    self.onDeviceFound(peripheral: peripheral)
                case .scanStopped(_, let error):
                    // The scan stopped, an error is passed if the scan stopped unexpectedly
                    if error != nil {
                        print("Scan stopped: \(String(describing: error))!")
                    }
                    break
                }
            }
        }
        
        func stopScan() {
            CricketDevice.shared.disconnect()
        }
        
        private func onDeviceFound(peripheral: Peripheral) {
            CricketDevice.shared.connect(peripheral: peripheral) { deviceInfo in
                print("Connected to device with \(deviceInfo)")
                CricketDevice.shared.maxButtons = Int(deviceInfo.maxButtons)
            }
        }
        
        func disconnect() {
            CricketDevice.shared.disconnect()
        }
    }
}

struct PairDeviceView_Previews: PreviewProvider {
    static var previews: some View {
        PairDeviceView()
    }
}
