import SwiftUI

struct CounterCard: View {
    @StateObject var counter: Counter
    let color: Color
    
    var body: some View {
        ZStack {
            PulseRectangle(color: color, onTap: counter.increment)
            HStack {
                VStack(alignment: .leading) {
                    Text(counter.objective.title)
                        .font(.headline)
                        .foregroundColor(.white)
                        .fontWeight(.black)
                        .lineLimit(1)
                    Text("COUNTER")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                Spacer()
                VStack {
                    Text("\(counter.count())")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }.padding(20)
        }
    }
}

struct CounterCard_Previews: PreviewProvider {
    static var previews: some View {
        let counter = Counter(objective: Objective(id: 42, title: "Undecipherable Language", measurementType: .counter))
        
        CounterCard(counter: counter, color: .blue)
            .preferredColorScheme(.dark)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
        
        CounterCard(counter: counter, color: .blue)
            .preferredColorScheme(.light)
            .previewLayout(PreviewLayout.fixed(width: 400, height: 100))
            .padding()
    }
}
