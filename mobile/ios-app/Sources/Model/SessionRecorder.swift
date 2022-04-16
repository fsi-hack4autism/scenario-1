import Foundation

class SessionRecorder : ObservableObject {
    let id: Int
    var startTime: Date?
    var endTime: Date?
    var measurements: [Caliper]
    
    @Published var duration: TimeInterval = 0
    @Published var complete = false
    
    private var timer: Timer?
    
    init(id: Int, objectives: [Objective]) {
        self.id = id
        
        self.measurements = objectives.map { objective in SessionRecorder.createCaliper(objective: objective) }
    }
    
    func beginSession() {
        self.startTime = Date()
        
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true){ t in
            self.duration += 1
        }
    }
    
    func endSession() {
        complete = true
        endTime = Date()
        
        if let t = timer {
            t.invalidate()
            timer = nil
        }
        
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
