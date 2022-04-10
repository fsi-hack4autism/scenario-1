import Foundation

class DurationTimer: ObservableObject {
    var objective: Objective
    var startTime: TimeInterval
    var closed = false
    
    @Published var totalTime: TimeInterval
    @Published var count: Int
    @Published var running: Bool
    
    private var timer: Timer?
    
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
    
    func start() {
        if closed {
            return
        }
        
        running = true
        startTime = Date().timeIntervalSinceReferenceDate
        count += 1
        
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true){ t in
            self.totalTime += 1
        }
    }
    
    func stop() {
        running = false
        
        if let t = timer {
            t.invalidate()
            timer = nil
        }
    }
    
    func close() {
        if running {
            stop()
        }
        closed = true
    }
}
