import Behavior from "./Behavior"
import Patient from "./Patient";

type PatientDetails = {
    behaviorsList: Behavior[];
} & Patient;

export default PatientDetails;
