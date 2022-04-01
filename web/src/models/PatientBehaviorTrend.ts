type PatientBehaviorTrend = {
    sessions: {
        sessionStart: Date;
        behaviors: {
            behaviorId: number;
            behaviorTotal: number;
        }[];
    }[];
};

export default PatientBehaviorTrend;
