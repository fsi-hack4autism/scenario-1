import SwiftUI

struct MainView: View {
    var body: some View {
        TabView {
            SessionView()
                .tabItem {
                    Label("Session", systemImage: "record.circle")
                }
            
            CalendarView()
                .tabItem {
                    Label("Dashboard", systemImage: "calendar")
                }
            
            PairDeviceView()
                .tabItem {
                    Label("Device", systemImage: "antenna.radiowaves.left.and.right")
                }
        }
    }
}
