import SwiftUI

struct ObjectiveCard<Label> : View where Label : View {
    let objective: Objective
    let color: Color
    let label: () -> Label
    let action: () -> Void
    
    init(objective: Objective, color: Color, label: @escaping () -> Label, action: @escaping () -> Void) {
        self.objective = objective
        self.color = color
        self.label = label
        self.action = action
    }
    
    var body: some View {
        ZStack {
            PulseRectangle(color: color, onTap: self.action)
            
            HStack {
                VStack(alignment: .leading) {
                    Text("ID #\(objective.id)")
                        .font(.caption)
                        .foregroundColor(.white)
                    Text(objective.title)
                        .font(.headline)
                        .foregroundColor(.white)
                        .fontWeight(.black)
                        .lineLimit(2)
                    Text("\(getMeasurementType(objective.measurementType))")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                Spacer()
                VStack {
                    label()
                }
            }.padding(20)
        }
    }
    
    func getMeasurementType(_ type: Objective.MeasurementType) -> String {
        switch(type) {
        case .counter: return "COUNTER"
        case .duration: return "DURATION"
        case .latency: return "LATENCY"
        }
    }
}


struct PulseRectangle: View {
    let color: Color
    let tapHandler: () -> Void
    
    @State var tap = false
    
    init(color: Color, onTap: @escaping () -> Void) {
        self.color = color
        self.tapHandler = onTap
    }
    
    var body: some View {
        RoundedRectangle(cornerRadius: 20)
            .fill(LinearGradient(
                gradient: .init(colors: [color, .black]),
                startPoint: .topLeading,
                endPoint: .init(x: 1.5, y: 1.3))
            )
            .scaleEffect(tap ? 1.05 : 1)
            .animation(.spring(response: 0.4, dampingFraction: 0.6), value: tap)
            .onTapGesture {
                self.tapHandler()
                
                // tap pulse effect
                tap = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    tap = false
                }
                
                // small haptic
                UIImpactFeedbackGenerator(style: .medium)
                    .impactOccurred()
            }
    }
}
