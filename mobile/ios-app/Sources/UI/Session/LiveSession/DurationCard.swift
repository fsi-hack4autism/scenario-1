import SwiftUI

struct DurationCard: View {
    @StateObject var timer: DurationTimer
    let color: Color
    
    private let formatter = DateComponentsFormatter()
    
    var body: some View {
        ZStack {
            PulseRectangle(color: color, onTap: timer.toggle)
            HStack {
                VStack(alignment: .leading) {
                    HStack {
                        Text(timer.objective.title)
                            .font(.headline)
                            .foregroundColor(.white)
                            .fontWeight(.black)
                            .lineLimit(1)
                        
                        if timer.running {
                            Image(systemName: "stopwatch")
                                .foregroundColor(.white)
                        }
                    }
                    Text("DURATION")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                Spacer()
                VStack {
                    Text("\(formatter.string(from: timer.totalTime)!)")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }.padding(20)
        }
    }
}

struct DurationCard_Previews: PreviewProvider {
    static var previews: some View {
        let timer = DurationTimer(objective: Objective(id: 42, title: "Timed Event", measurementType: .duration))
        
        DurationCard(timer: timer, color: .green)
            .preferredColorScheme(.dark)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
        
        DurationCard(timer: timer, color: .green)
            .preferredColorScheme(.light)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
    }
}
