import SwiftUI

struct SettingsView: View {
    @StateObject private var model = ViewModel()
    
    @Environment(\.presentationMode)
    var presentationMode: Binding<PresentationMode>
    
    var body: some View {
        Form {
            Section(header: Text("User Feedback")) {
                Toggle("Therapy Indicator", isOn: $model.ledFeedback)
                Toggle("Haptic Feedback", isOn: $model.hapticFeedback)
            }
            
            Section(header: Text("Bluetooth Configuration")) {
                Toggle("Auto-Discover", isOn: $model.autoDiscovery)
            }
            
            Section {
                Button("Save") {
                    model.saveSettings()
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
        .navigationTitle("Device Options")
        .task {
            model.loadSettings()
        }
    }
}

extension SettingsView {
    class ViewModel : ObservableObject {
        @Published var ledFeedback: Bool = false
        @Published var hapticFeedback: Bool = false
        @Published var autoDiscovery: Bool = false
        
        func loadSettings() {
            print("Loading settings...")
            CricketDevice.shared.readSettings() { result in
                switch(result) {
                case .success(let settings):
                    self.ledFeedback = settings.ledFeedback
                    self.hapticFeedback = settings.hapticFeedback
                    self.autoDiscovery = settings.autoDiscovery
                case .failure(let error):
                    print("Error on read: \(error)")
                    break
                }
            }
        }
        
        func saveSettings() {
            print("Saving settings...")
            let settings = CricketDevice.Settings(ledFeedback: self.ledFeedback,
                                          hapticFeedback: self.hapticFeedback,
                                          autoDiscovery: self.autoDiscovery)
            
            CricketDevice.shared.saveSettings(settings) { result in
                switch result {
                case .success:
                    break // The write was succesful.
                case .failure(_):
                    break // An error happened while writting the data.
                }
            }
        }
        
        func disconnect() {
            CricketDevice.shared.disconnect()
        }
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}
