import Objective from "../../models/Objective";
import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";

interface PatientBehaviorGridProps {
    patientId: string;
    behaviorData: { behavior: Objective, data: BehaviorReportDataItem[] }[];
}

export default PatientBehaviorGridProps;
