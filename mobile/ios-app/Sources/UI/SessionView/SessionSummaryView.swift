import SwiftUI

struct SessionSummaryView: View {
    @ObservedObject var session: SessionRecorder
    
    @Environment(\.presentationMode)
    var presentationMode: Binding<PresentationMode>
    
    private static let formatter: DateComponentsFormatter = {
        let formatter = DateComponentsFormatter()
        formatter.unitsStyle = .short
        return formatter
    }()
    
    var body: some View {
        Form {
            if let startTime = session.startTime {
                Section(header: Text("Summary")) {
                    HStack {
                        Text("Start Time")
                        Spacer()
                        Text(startTime, style: .time)
                    }
                    HStack {
                        Text("Duration")
                        Spacer()
                        Text("\(SessionSummaryView.formatter.string(from: session.duration)!)")
                    }
                }
            }
            
            ForEach(Array(session.measurements.enumerated()), id: \.0) { index, measurement in
                switch(measurement) {
                case .counter(let counter):
                    CounterView(counter: counter, sessionDuration: session.duration)
                case .duration(let timer):
                    DurationView(timer: timer)
                case .latency(let timer):
                    LatencyView(timer: timer)
                }
            }
            
            Section {
                Button("Done") {
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
        .navigationTitle("Session Overview")
    }
    
    struct CounterView : View {
        let counter: Counter
        let sessionDuration: TimeInterval
        
        var body: some View {
            Section(header: Text(counter.objective.title)) {
                HStack {
                    Text("Count")
                    Spacer()
                    Text("\(counter.value)")
                }
//                HStack {
//                    Text("Rate (p/h)")
//                    Spacer()
//                    Text("\(Int((Double(counter.value) * 3600.0) / sessionDuration))")
//                }
            }
        }
    }
    
    struct DurationView : View {
        let timer: DurationTimer
        
        var body: some View {
            Section(header: Text(timer.objective.title)) {
                HStack {
                    Text("Count")
                    Spacer()
                    Text("\(timer.count)")
                }
                HStack {
                    Text("Total Time")
                    Spacer()
                    Text("\(formatter.string(from: timer.totalTime)!)")
                }
            }
        }
    }
    
    struct LatencyView : View {
        let timer: LatencyTimer
        
        var body: some View {
            Section(header: Text(timer.objective.title)) {
                HStack {
                    Text("Count")
                    Spacer()
                    Text("\(timer.count())")
                }
                HStack {
                    Text("Latency")
                    Spacer()
                    Text("\(formatter.string(from: timer.lastInterval)!)")
                }
            }
        }
    }
}

struct SessionSummaryView_Previews: PreviewProvider {
    static var previews: some View {
        SessionSummaryView(session: SessionRecorder(id: 1, objectives: [
            Objective(id: 42, title: "Undecipherable Language", measurementType: .counter),
            Objective(id: 50, title: "Tantrum", measurementType: .duration),
            Objective(id: 60, title: "New Words Read", measurementType: .counter),
            Objective(id: 7, title: "Time to Get Ready", measurementType: .latency)
        ]))
        .preferredColorScheme(.dark)
        .previewInterfaceOrientation(.portrait)
    }
}
