import Objective from "../models/Objective";
import Patient from "../models/Patient";
import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import Session from "../models/Session";
import SessionDetails from "../models/SessionDetails";
import Therapist from "../models/Therapist";

const getPatients = async () => {
  return Promise.resolve([
    {
      patientId: "User1",
      firstName: "John",
      surname: "Smith",
    },
    {
      patientId: "User2",
      firstName: "Alice",
      surname: "Jones",
    },
  ] as Patient[]);
};

const getTherapists = async () => {
  return Promise.resolve([
    {
      therapistId: "User3",
      firstName: "John",
      surname: "Smith",
    },
    {
      therapistId: "User4",
      firstName: "Alice",
      surname: "Jones",
    },
  ] as Therapist[]);
};

const getObjectives = async (): Promise<Objective[]> => {
  return Promise.resolve([
    {
      objectiveId: "objective-1",
      description: "Hits head with fist.",
      type: "Counter",
    },
    {
      objectiveId: "objective-2",
      description: "Tantrum",
      type: "Duration",
    },
  ]);
};

const getSessionsForPatient = async (patientId: string) => {
  return Promise.resolve([
    {
      sessionId: 1,
      patientId: patientId,
      therapistId: "User3",
      start: new Date("2022-02-24T10:00:00-07:00"),
      end: new Date("2022-02-24T11:00:00-07:00"),
    },
    {
      sessionId: 2,
      patientId: patientId,
      therapistId: "User3",
      start: new Date("2022-03-01T10:00:00-07:00"),
      end: new Date("2022-03-01T11:00:00-07:00"),
    },
    {
      sessionId: 3,
      patientId: patientId,
      therapistId: "User3",
      start: new Date("2022-03-08T10:00:00-07:00"),
      end: new Date("2022-03-08T11:00:00-07:00"),
    },
    {
      sessionId: 4,
      patientId: patientId,
      therapistId: "User3",
      start: new Date("2022-03-15T10:00:00-07:00"),
      end: new Date("2022-03-15T11:00:00-07:00"),
    },
  ] as Session[]);
};

const getSession = async (sessionId: number) => {
  return Promise.resolve({
    sessionId: 4,
    patientId: "User1",
    therapistId: "User3",
    start: new Date("2022-03-15T10:00:00-07:00"),
    end: new Date("2022-03-15T11:00:00-07:00"),
    events: [
      {
        behaviorId: 1,
        start: new Date("2022-03-15T10:01:03-07:00"),
        end: null,
      },
      {
        behaviorId: 1,
        start: new Date("2022-03-15T10:08:06-07:00"),
        end: null,
      },
      {
        behaviorId: 1,
        start: new Date("2022-03-15T10:23:23-07:00"),
        end: null,
      },
      {
        behaviorId: 1,
        start: new Date("2022-03-15T10:53:44-07:00"),
        end: null,
      },
      {
        behaviorId: 2,
        start: new Date("2022-03-15T10:30:00-07:00"),
        end: new Date("2022-03-15T10:37:00-07:00"),
      },
    ],
  } as SessionDetails);
};

const getPatientBehaviorTrend = async (patientId: string) => {
  return Promise.resolve({
    sessions: [
      {
        sessionStart: new Date("2022-02-24T11:00:00-07:00"),
        behaviors: [
          {
            behaviorId: 1,
            behaviorTotal: 10,
          },
          {
            behaviorId: 2,
            behaviorTotal: 5,
          },
        ],
      },
      {
        sessionStart: new Date("2022-03-01T11:00:00-07:00"),
        behaviors: [
          {
            behaviorId: 1,
            behaviorTotal: 3,
          },
          {
            behaviorId: 2,
            behaviorTotal: 4,
          },
        ],
      },
      {
        sessionStart: new Date("2022-03-08T11:00:00-07:00"),
        behaviors: [
          {
            behaviorId: 2,
            behaviorTotal: 5,
          },
        ],
      },
      {
        sessionStart: new Date("2022-03-15T10:00:00-07:00"),
        behaviors: [
          {
            behaviorId: 1,
            behaviorTotal: 2,
          },
          {
            behaviorId: 2,
            behaviorTotal: 1,
          },
        ],
      },
    ],
  } as PatientBehaviorTrend);
};

export {
  getPatients,
  getTherapists,
  getObjectives,
  getSessionsForPatient,
  getSession,
  getPatientBehaviorTrend,
};
