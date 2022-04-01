const PatientBehaviorTrendData = {
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

export default PatientBehaviorTrendData;
