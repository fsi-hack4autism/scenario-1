import Combine
import SwiftUI
import SwiftyBluetooth

struct SessionView: View {
    @StateObject private var viewModel = ViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                NavigationLink("Begin Session",
                               destination: NavigationLazyView(LiveSessionView(session: viewModel.initSession())))
                .buttonStyle(.bordered)
                .tint(.green)
            }
            .navigationTitle("Session Management")
            .navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }
}

extension SessionView {
    class ViewModel : ObservableObject {
        var endSessionSink: AnyCancellable?
        
        func initSession() -> SessionRecorder {
            let sessionId = 1
            let objectives = [
                Objective(id: 42, title: "Undecipherable Language", measurementType: .counter),
                Objective(id: 50, title: "Tantrum", measurementType: .duration),
                Objective(id: 60, title: "New Words Read", measurementType: .counter),
                Objective(id: 7, title: "Time to Get Ready", measurementType: .latency),
                Objective(id: 8, title: "Rare Event", measurementType: .counter),
            ]
            
            let session = SessionRecorder(id: sessionId, objectives: objectives)
            session.beginSession()
            
            // init the bluetooth listeners
            let device = CricketDevice.shared
            if device.isConnected() {
                device.startSession(CricketDevice.SessionStart(id: 0, startTime: 0, objectives: Array(objectives.prefix(device.maxButtons)))) { result in
                    switch(result) {
                    case .success(_):
                        for (index, measurement) in Array(session.measurements.enumerated().prefix(device.maxButtons)) {
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
            }
            return session
        }
    }
}

struct SessionView_Previews: PreviewProvider {
    static var previews: some View {
        SessionView()
    }
}
