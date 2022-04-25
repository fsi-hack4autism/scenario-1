import SwiftUI

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
            .shadow(radius: 5)
            .scaleEffect(tap ? 0.97 : 1)
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
