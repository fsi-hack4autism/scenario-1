import Objective from "./Objective"
import Patient from "./Patient";

type PatientDetails = {
    behaviorsList: Objective[];
} & Patient;

export default PatientDetails;
