import Foundation

class LatencyTimer: ObservableObject {
    var objective: Objective
    var startTime: Date?
    var closed = false
    
    var samples: [Sample] = []
    
    @Published var lastInterval: TimeInterval
    @Published var running: Bool
    
    init(objective: Objective) {
        self.objective = objective
        self.lastInterval = 0.0
        self.running = false
    }
    
    func toggle() {
        if !running {
            start()
        } else {
            stop()
        }
    }
    
    func start() {
        if closed {
            return
        }
        
        running = true
        startTime = Date()
    }
    
    func stop() {
        if running {
            samples.append(Sample(start: startTime!, duration: lastInterval))
            startTime = nil
        }
        running = false
    }
    
    func update(now: Date) {
        if running {
            self.lastInterval = now.timeIntervalSince(self.startTime!)
        }
    }
    
    func count() -> Int {
        return samples.count
    }
    
    func getAverageLatency() -> TimeInterval {
        return samples.map{$0.duration}.reduce(0, +) / Double(samples.count)
    }
    
    func close() {
        if running {
            stop()
        }
        closed = true
    }
    
    struct Sample {
        let start: Date
        let duration: TimeInterval
    }
}
