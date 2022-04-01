import Behavior from "../models/Behavior";
import Patient from "../models/Patient";
import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import Session from "../models/Session";
import SessionDetails from "../models/SessionDetails";
import Therapist from "../models/Therapist";

const endpointUrl = "http://domain.com/api/v1";

const getPatients = async () => {
    const response = await fetch(`${endpointUrl}/patients`);
    const json = await response.json();
    const items = json as any[];

    return items.map((d) => ({
        patientId: d.id,
        surname: d.surname,
        firstName: d["first name"],
    })) as Patient[];
};

const getTherapists = async () => {
    const response = await fetch(`${endpointUrl}/therapists`);
    const json = await response.json();
    const items = json as any[];

    return items.map((d) => ({
        therapistId: d.id,
        surname: d.surname,
        firstName: d["first name"],
    })) as Therapist[];
};

const getBehaviors = async () => {
    const response = await fetch(`${endpointUrl}/behaviors`);
    const json = await response.json();
    const items = json as any[];

    return items.map((d) => ({
        behaviorId: d.behaviorId,
        description: d.description,
        type: d.type,
    })) as Behavior[];
};

const getSessionsForPatient = async (patientId: number) => {
    const response = await fetch(
        `${endpointUrl}/sessions?patientId=${patientId}`
    );
    const json = await response.json();
    const items = json as any[];

    return items.map((d) => ({
        sessionId: d.id,
        start: new Date(d.start),
        end: new Date(d.end),
        patientId: d.patientId,
        therapistId: d.therapistId,
    })) as Session[];
};

const getSession = async (sessionId: number) => {
    const response = await fetch(`${endpointUrl}/sessions/${sessionId}`);
    const json = await response.json();
    const items = json as any[];

    return items.map((d) => ({
        sessionId: d.id,
        start: new Date(d.start),
        end: new Date(d.end),
        patientId: d.patientId,
        therapistId: d.therapistId,
        events: (d.events as any[]).map((e) => ({
            behaviorId: e.behaviorId,
            start: new Date(e.start),
            end: e.end ? new Date(e.end) : null,
        })),
    })) as SessionDetails[];
};

const getPatientBehaviorTrend = async (patientId: number) => {
    const response = await fetch(
        `${endpointUrl}/reports/patientBehaviorTrend?patientId=${patientId}`
    );
    const json = await response.json();
    const items = json as any[];

    return {
        sessions: items.map((d) => ({
            sessionStart: new Date(d.sessionStart),
            behaviors: d.behaviors, // property name missing from spec.
        })),
    } as PatientBehaviorTrend;
};

export {
    getPatients,
    getTherapists,
    getBehaviors,
    getSessionsForPatient,
    getSession,
    getPatientBehaviorTrend,
};
