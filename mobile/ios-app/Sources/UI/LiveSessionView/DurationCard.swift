import SwiftUI

struct DurationCard: View {
    @StateObject var timer: DurationTimer
    let color: Color
    
    let formatter = DateComponentsFormatter()
    
    var body: some View {
        ObjectiveCard(objective: timer.objective, color: color, label: {
            Text("\(formatter.string(from: timer.totalTime)!)")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.white)
        }, action: timer.toggle)
    }
}
