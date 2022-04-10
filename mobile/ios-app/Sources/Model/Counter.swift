import Foundation

class Counter: ObservableObject {
    var objective: Objective
    @Published var value: Int
    var closed = false
    
    init(objective: Objective) {
        self.objective = objective
        self.value = 0
    }
    
    func increment() {
        if !closed {
            self.value += 1
        }
    }
    
    func close() {
        closed = true
    }
}
