import SwiftUI

struct LogoView: View {
    var body: some View {
        VStack {
            HStack {
                Block(text: "A", color: .green)
                Block(text: "B", color: .yellow)
            }
            HStack {
                Block(text: "A", color: .red)
                Block(text: "C", color: .blue)
            }
        }
        .padding(20)
        .frame(width: 300, height: 300, alignment: .center)
    }
}

struct Block: View {
    var text: String
    var color: Color
    
    var body: some View {
        ZStack {
            PulseRectangle(color: color) {}
            Text(text)
                .font(.largeTitle)
                .fontWeight(.bold)
        }
    }
}

struct LogoView_Previews: PreviewProvider {
    static var previews: some View {
        LogoView()
            .preferredColorScheme(.dark)
    }
}
