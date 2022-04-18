import Foundation

struct Objective: Identifiable, Decodable {
    let id: Int
    let title: String
    let measurementType: MeasurementType
}

extension Objective {
    enum MeasurementType: Decodable {
        case counter
        case duration
        case latency
    }
}
