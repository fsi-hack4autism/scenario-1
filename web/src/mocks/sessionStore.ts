import Session from "../models/Session";
import SessionDetails from "../models/SessionDetails";

const getSession = (sessionId: number): SessionDetails | undefined =>
    retrieve().find((s) => s.sessionId === sessionId);

const getSessionsByPatientId = (patientId: number): Session[] =>
    retrieve().filter((s) => s.patientId === patientId);

const retrieve = (): SessionDetails[] =>
    JSON.parse(localStorage.getItem("sessions") ?? "[]");

// seed the mock data
if (localStorage.getItem("sessions") == null) {
    const sessions: SessionDetails[] = [
        {
            sessionId: 1,
            start: new Date("2022-03-31T10:00:00-07:00"),
            end: new Date("2022-03-31T11:00:00-07:00"),
            patientId: 1,
            therapistId: 1,
            eventSummary: new Map<number, number>([[1, 3]]),
            events: [
                {
                    behaviorId: 1,
                    start: new Date("2022-03-31T10:03:00-07:00"),
                    end: new Date("2022-03-31T11:03:00-07:00"),
                },
                {
                    behaviorId: 1,
                    start: new Date("2022-03-31T10:17:00-07:00"),
                    end: new Date("2022-03-31T11:17:00-07:00"),
                },
                {
                    behaviorId: 1,
                    start: new Date("2022-03-31T10:54:00-07:00"),
                    end: new Date("2022-03-31T11:54:00-07:00"),
                },
            ],
        },
    ];

    localStorage.setItem("sessions", JSON.stringify(sessions));
}

export {getSession, getSessionsByPatientId};
