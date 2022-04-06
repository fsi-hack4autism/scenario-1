import Behavior from "../../models/Behavior";
import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";

interface PatientBehaviorGridProps {
    patientId: string;
    behaviorData: { behavior: Behavior, data: BehaviorReportDataItem[] }[];
}

export default PatientBehaviorGridProps;
