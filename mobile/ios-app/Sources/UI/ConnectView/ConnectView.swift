import Combine
import SwiftUI
import SwiftyBluetooth

struct ConnectView: View {
    @StateObject private var viewModel = ViewModel()
    
    var body: some View {
        // todo: we can do better than this
        switch (viewModel.state) {
        case .disconnected:
            Button("Connect") {
                viewModel.scan()
            }
            .buttonStyle(.bordered)
            .tint(.green)
            
        case .scanning:
            Text("Scanning...")
            
        case .connected:
            LiveSessionView(session: viewModel.session!)
        }
    }
}

extension ConnectView {
    enum ConnectionState {
        case disconnected
        case scanning
        case connected
    }
    
    class ViewModel : ObservableObject {
        @Published var state: ConnectionState = .disconnected
        @Published var maxButtons = 0
        @Published var session: Optional<SessionRecorder> = nil
        
        var endSessionSink: AnyCancellable?
        
        func scan() {
            self.state = .scanning
            CricketDevice.shared.scanForPeripherals { scanResult in
                switch scanResult {
                case .scanStarted:
                    break
                case .scanResult(let peripheral, _, _):
                    // todo: fixme: there may be multiple matches
                    self.onDeviceFound(peripheral: peripheral)
                case .scanStopped(_, let error):
                    // The scan stopped, an error is passed if the scan stopped unexpectedly
                    print("Scan stopped: \(String(describing: error))!")
                    self.state = .disconnected
                    break
                }
            }
        }
        
        func disconnect() {
            CricketDevice.shared.disconnect()
            self.state = .disconnected
        }
        
        private func onDeviceFound(peripheral: Peripheral) {
            CricketDevice.shared.connect(peripheral: peripheral) { deviceInfo in
                print("Connected to device with \(deviceInfo)")
                self.maxButtons = Int(deviceInfo.maxButtons)
                self.session = self.initSession()
                self.state = .connected
            }
        }
        
        private func initSession() -> SessionRecorder {
            let sessionId = 1
            let objectives = [
                Objective(id: 42, title: "Undecipherable Language", measurementType: .counter),
                Objective(id: 50, title: "Tantrum", measurementType: .duration),
                Objective(id: 60, title: "New Words Read", measurementType: .counter),
                Objective(id: 7, title: "Time to Get Ready", measurementType: .latency),
                Objective(id: 8, title: "Rare Event", measurementType: .counter),
            ]
            
            let session = SessionRecorder(id: sessionId, startTime: Date(), objectives: objectives)
            
            // init the bluetooth listeners
            let device = CricketDevice.shared
            device.startSession(CricketDevice.SessionStart(id: 0, startTime: 0, objectives: Array(objectives.prefix(maxButtons)))) { result in
                switch(result) {
                case .success(_):
                    for (index, measurement) in Array(session.measurements.enumerated().prefix(self.maxButtons)) {
                        device.subscribeButton(buttonId: index) { data in
                            switch(measurement) {
                            case .counter(let value): value.increment()
                            case .duration(let value): value.toggle()
                            case .latency(let value): value.toggle()
                            }
                        }
                    }
                    
                case .failure(_): break
                }
            }
            
            self.endSessionSink = session.$complete.sink { isComplete in
                if isComplete {
                    device.endSession()
                    self.endSessionSink?.cancel()
                    self.endSessionSink = nil
                }
            }
            
            return session
        }
    }
}

struct ConnectView_Previews: PreviewProvider {
    static var previews: some View {
        ConnectView()
    }
}
