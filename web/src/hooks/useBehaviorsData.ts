import Behavior from "../models/Behavior";
import BehaviorReportDataItem from "../models/BehaviorReportDataItem";
import PatientDetails from "../models/PatientDetails";
import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import usePatientBehaviorTrendData from "./usePatientBehaviourTrendData";

const GetDataForBehavior = (
    patientBehaviorTrendData: PatientBehaviorTrend,
    behavior: Behavior
): {behavior: Behavior; data: BehaviorReportDataItem[]} => {
    return {
        behavior,
        data: patientBehaviorTrendData.sessions
            .map((s) => ({
                sessionStart: s.sessionStart,
                behavior: s.behaviors.find(
                    (b) => b.behaviorId === behavior.behaviorId
                ),
            }))
            .filter((x) => x.behavior !== undefined)
            .map((x) => ({
                date: x.sessionStart.getTime(),
                total: x.behavior!.behaviorTotal,
            })),
    };
};

const useBehaviorsData = (patient?: PatientDetails) => {
    const {trendData} = usePatientBehaviorTrendData(patient?.patientId);

    if (!trendData) {
        return [];
    }

    const GetDataForBehaviorWithData = (behavior: Behavior) =>
        GetDataForBehavior(trendData, behavior);

    console.log(trendData);

    return patient?.behaviorsList.map(GetDataForBehaviorWithData);
};

export default useBehaviorsData;
