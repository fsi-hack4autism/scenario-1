import SwiftUI

struct SessionView: View {
    @ObservedObject var session: SessionRecorder
    
    @State private var confirmationShown = false
    
    private let formatter: DateComponentsFormatter = {
        let formatter = DateComponentsFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter
    }()
    
    init(session: SessionRecorder) {
        self.session = session
        self.session.beginSession()
    }
    
    let columns = [
        GridItem(.adaptive(minimum: 300))
    ]
    
    var body: some View {
        ScrollView {
            VStack {
                let measurements = Array(session.measurements.enumerated())
                LazyVGrid(columns: columns, spacing: 10) {
                    ForEach(measurements, id: \.0) { index, measurement in
                        let buttonColor = getButtonColor(index)
                        switch(measurement) {
                        case .counter(let counter): CounterCard(counter: counter, color: buttonColor)
                        case .duration(let timer): DurationCard(timer: timer, color: buttonColor)
                        case .latency(let timer): LatencyCard(timer: timer, color: buttonColor)
                        }
                    }
                }
                Spacer()
                
                if !session.complete {
                    Button("End Session") {
                        confirmationShown = true
                    }
                    .buttonStyle(.bordered)
                    .tint(.blue)
                    .confirmationDialog("Are you sure you want to end the session?",
                                        isPresented: $confirmationShown) {
                        Button("Confirm") {
                            // stop the timer
                            session.endSession()
                            
                            // todo: move onto next nav phase
                        }
                        .padding(10)
                    }
                }
            }
        }
        .navigationTitle("Session")
        .navigationBarBackButtonHidden(true)
        .padding(10)
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarLeading) {
                Text("\(formatter.string(from: session.duration)!)")
            }
            ToolbarItemGroup(placement: .navigationBarTrailing) {
                NavigationLink(destination: SettingsView()) {
                    Image(systemName: "gear")
                }
                
                Button(action: {
                    CricketDevice.shared.disconnect()
                }, label: {
                    Image(systemName: "antenna.radiowaves.left.and.right.slash")
                        .foregroundColor(.red)
                })
                
            }
        }
    }
    
    func getButtonColor(_ index: Int) -> Color {
        switch(index) {
        case 0: return .green
        case 1: return .yellow
        case 2: return .red
        case 3: return .blue
        default: return .gray
        }
    }
}

struct SessionView_Previews: PreviewProvider {
    static var previews: some View {
        SessionView(session: SessionRecorder(id: 1, objectives: [
            Objective(id: 42, title: "Undecipherable Language", measurementType: .counter),
            Objective(id: 50, title: "Tantrum", measurementType: .duration),
            Objective(id: 60, title: "New Words Read", measurementType: .counter),
            Objective(id: 7, title: "Time to Get Ready", measurementType: .latency)
        ]))
        .preferredColorScheme(.dark)
        .previewInterfaceOrientation(.portrait)
    }
}
