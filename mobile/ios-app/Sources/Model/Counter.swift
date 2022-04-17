import Foundation

class Counter: ObservableObject {
    var objective: Objective
    private var closed = false
    
    @Published private(set) var value: Int
    
    init(objective: Objective) {
        self.objective = objective
        self.value = 0
    }
    
    func increment() {
        if !closed {
            self.value += 1
        }
    }
    
    func count() -> Int {
        return self.value
    }
    
    func close() {
        closed = true
    }
}
