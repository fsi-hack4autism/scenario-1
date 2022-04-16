import SwiftUI

struct LatencyCard: View {
    @StateObject var timer: LatencyTimer
    let color: Color
    
    private let formatter = DateComponentsFormatter()
    
    var body: some View {
        ObjectiveCard(objective: timer.objective, color: color, label: {
            HStack {
                if timer.running {
                    Image(systemName: "hourglass")
                    Spacer()
                }
                
                Text("\(formatter.string(from: timer.lastInterval)!)")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .layoutPriority(100)
            }
        }, action: timer.toggle)
    }
}
