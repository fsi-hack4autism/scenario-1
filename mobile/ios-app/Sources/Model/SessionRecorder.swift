import Foundation

class SessionRecorder : ObservableObject {
    let id: Int
    var startTime: Date
    var endTime: Date?
    var measurements: [Caliper]
    
    @Published var duration: TimeInterval = 0
    @Published var complete = false
    
    init(id: Int, startTime: Date, objectives: [Objective]) {
        self.id = id
        self.startTime = startTime
        self.measurements = objectives.map { objective in SessionRecorder.createCaliper(objective: objective) }
    }
    
    func endSession() {
        complete = true
        endTime = Date()
        
        for measurement in measurements {
            switch (measurement) {
            case .counter(let counter): counter.close()
            case .duration(let timer): timer.close()
            case .latency(let timer): timer.close()
            }
        }
    }
}

extension SessionRecorder {
    enum Caliper {
        case counter(_ value: Counter)
        case duration(_ value: DurationTimer)
        case latency(_ value: LatencyTimer)
    }
    
    static func createCaliper(objective: Objective) -> Caliper {
        switch (objective.measurementType) {
        case .counter:  return .counter(Counter(objective: objective))
        case .duration: return .duration(DurationTimer(objective: objective))
        case .latency:  return .latency(LatencyTimer(objective: objective))
        }
    }
}
