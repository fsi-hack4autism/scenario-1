import SwiftUI

struct CounterCard: View {
    @StateObject var counter: Counter
    let color: Color
    
    var body: some View {
        ObjectiveCard(objective: counter.objective, color: color, label: {
            Text("\(counter.value)")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .layoutPriority(100)
        }, action: counter.increment)
    }
}
