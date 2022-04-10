import Foundation

class LatencyTimer: ObservableObject {
    var objective: Objective
    var startTime: TimeInterval
    var closed = false
    
    private var timer: Timer?
    
    @Published var lastInterval: TimeInterval
    @Published var count: Int
    @Published var running: Bool
    
    init(objective: Objective) {
        self.objective = objective
        self.lastInterval = 0.0
        self.running = false
        self.startTime = 0.0
        self.count = 0
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
        lastInterval = 0
        count += 1
        
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true){ t in
            self.lastInterval += 1
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
