import Foundation

class DurationTimer: ObservableObject {
    var objective: Objective
    var startTime: TimeInterval
    var closed = false
    
    @Published var totalTime: TimeInterval
    @Published var count: Int
    @Published var running: Bool
    
    private var prevTotalTime: TimeInterval = 0
    
    init(objective: Objective) {
        self.objective = objective
        self.totalTime = 0.0
        self.running = false
        self.count = 0
        self.startTime = 0.0
    }
    
    func toggle() {
        if !running {
            start()
        } else {
            stop()
        }
    }
    
    func update(now: Date) {
        if running {
            self.totalTime = self.prevTotalTime + (now.timeIntervalSinceReferenceDate - self.startTime)
        }
    }
    
    func start() {
        if closed {
            return
        }
        
        running = true
        count += 1
        startTime = Date().timeIntervalSinceReferenceDate
        prevTotalTime = totalTime
    }
    
    func stop() {
        running = false
    }
    
    func close() {
        if running {
            stop()
        }
        closed = true
    }
}
