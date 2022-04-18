import SwiftUI

struct SessionView: View {
    @ObservedObject var session: SessionRecorder
    
    @State private var confirmationShown = false
    
    private let formatter: DateComponentsFormatter = {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.minute, .second]
        formatter.unitsStyle = .abbreviated
        formatter.zeroFormattingBehavior = .pad
        return formatter
    }()
    
    init(session: SessionRecorder) {
        self.session = session
    }
    
    let columns = [
        GridItem(.adaptive(minimum: 300))
    ]
    
    var body: some View {
        if session.complete {
            SessionSummaryView(session: session)
            
        } else {
            ScrollView {
                let measurements = Array(session.measurements.enumerated())
                LazyVGrid(columns: columns, spacing: 10) {
                    ForEach(measurements, id: \.0) { index, measurement in
                        let color = getButtonColor(index)
                        switch(measurement) {
                        case .counter(let counter): CounterCard(counter: counter, color: color)
                        case .duration(let timer): DurationCard(timer: timer, color: color)
                        case .latency(let timer): LatencyCard(timer: timer, color: color)
                        }
                    }
                }
            }
            .padding(20)
            .navigationTitle(Text("Live Session"))
            .navigationBarBackButtonHidden(true)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarLeading) {
                    if CricketDevice.shared.isConnected() {
                        NavigationLink(destination: SettingsView()) {
                            Image(systemName: "antenna.radiowaves.left.and.right")
                        }
                    }
                }
                
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    Button(action: {
                        confirmationShown = true
                    }) {
                        Text("\(formatter.string(from: session.duration)!)")
                        Image(systemName: "xmark.circle")
                    }
                    .confirmationDialog("Are you sure you want to end the session?",
                                        isPresented: $confirmationShown,
                                        titleVisibility: .visible) {
                        Button("Confirm", role: .destructive) {
                            // stop the timer
                            session.endSession()
                        }
                    }
                }
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
            Objective(id: 1, title: "Undecipherable Language", measurementType: .counter),
            Objective(id: 2, title: "Tantrum", measurementType: .duration),
            Objective(id: 3, title: "New Words Read", measurementType: .counter),
            Objective(id: 4, title: "Time to Get Ready", measurementType: .latency)
        ]))
        .preferredColorScheme(.dark)
        .previewInterfaceOrientation(.portrait)
    }
}
