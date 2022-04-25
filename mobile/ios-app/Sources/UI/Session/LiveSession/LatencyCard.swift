import SwiftUI

struct LatencyCard: View {
    @StateObject var timer: LatencyTimer
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
                            Image(systemName: "hourglass")
                                .foregroundColor(.white)
                        }
                    }
                    Text("LATENCY")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                Spacer()
                VStack {
                    Text("\(formatter.string(from: timer.lastInterval)!)")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }.padding(20)
        }
    }
}

struct LatencyCard_Previews: PreviewProvider {
    static var previews: some View {
        let timer = LatencyTimer(
            objective: Objective(id: 42, title: "Timed Event", measurementType: .duration))
        
        LatencyCard(timer: timer, color: .yellow)
            .preferredColorScheme(.dark)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
        
        LatencyCard(timer: timer, color: .yellow)
            .preferredColorScheme(.light)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
            .previewInterfaceOrientation(.portraitUpsideDown)
    }
}
