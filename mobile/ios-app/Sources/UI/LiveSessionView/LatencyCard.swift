import SwiftUI

struct LatencyCard: View {
    @StateObject var timer: LatencyTimer
    let color: Color
    
    let formatter = DateComponentsFormatter()
    
    var body: some View {
        ObjectiveCard(objective: timer.objective, color: color, label: {
            Text("\(formatter.string(from: timer.lastInterval)!)")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.white)
        }, action: timer.toggle)
    }
}
