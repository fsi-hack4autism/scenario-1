import Behavior from "../models/Behavior";
import BehaviorReportDataItem from "../models/BehaviorReportDataItem";

const patientBehaviorTrendData = {
    sessions: [
        {
            sessionStart: new Date("2022-02-25T11:00:00-07:00"),
            behaviors: [
                {
                    behaviorId: 1, behaviorTotal: 10
                },
                {
                    behaviorId: 2, behaviorTotal: 5
                }
            ]
        },
        {
            sessionStart: new Date("2022-02-26T11:00:00-07:00"),
            behaviors: [
                {
                    behaviorId: 1, behaviorTotal: 3
                },
                {
                    behaviorId: 2, behaviorTotal: 4
                }
            ]
        },
        {
            sessionStart: new Date("2022-02-28T11:00:00-07:00"),
            behaviors: [
                {
                    behaviorId: 2, behaviorTotal: 5
                }
            ]
        },
        {
            sessionStart: new Date("2022-03-31T10:00:00-07:00"),
            behaviors: [
                {
                    behaviorId: 1, behaviorTotal: 8
                },
                {
                    behaviorId: 2, behaviorTotal: 8
                }
            ]
        }
    ]
}

const GetDataForBehavior = (behavior: Behavior): { behavior: Behavior, data: BehaviorReportDataItem[] } => {

    return ({ behavior, data: patientBehaviorTrendData.sessions
        .map(s => ({ sessionStart: s.sessionStart, behavior: s.behaviors.find(b => b.behaviorId === behavior.behaviorId)}))
        .filter(x => x.behavior !== undefined)
        .map(x => ({ date: x.sessionStart.getTime(), total: x.behavior!.behaviorTotal }))
    });
}

const useBehaviorsData = (behaviors?: Behavior[]) => {
    if (!behaviors) {
        return [];
    }

    return behaviors.map(GetDataForBehavior);
}

export default useBehaviorsData;
