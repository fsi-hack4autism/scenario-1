import SwiftUI

struct DurationCard: View {
    @StateObject var timer: DurationTimer
    let color: Color
    
    private let formatter = DateComponentsFormatter()
    
    var body: some View {
        ObjectiveCard(objective: timer.objective, color: color, label: {
            HStack {
                if timer.running {
                    Image(systemName: "stopwatch")
                    Spacer()
                }
                
                Text("\(formatter.string(from: timer.totalTime)!)")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .layoutPriority(100)
            }
        }, action: timer.toggle)
    }
}
