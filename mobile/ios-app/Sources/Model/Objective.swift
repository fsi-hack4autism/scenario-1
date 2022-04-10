import Foundation

struct Objective {
    let id: Int
    let title: String
    let measurementType: MeasurementType
}

extension Objective {
    enum MeasurementType {
        case counter
        case duration
        case latency
    }
}
