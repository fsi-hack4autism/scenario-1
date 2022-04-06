import Behavior from "../models/Behavior";
import Patient from "../models/Patient";
import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import Session from "../models/Session";
import SessionDetails from "../models/SessionDetails";
import Therapist from "../models/Therapist";
import { ENDPOINT_URL } from "../configuration";

const getPatients = async () => {
  const response = await fetch(`${ENDPOINT_URL}/patients`);
  const json = await response.json();
  const items = json.data as any[];

  return items.map((d) => ({
    patientId: d.id,
    surname: d.lastname,
    firstName: d.firstname,
  })) as Patient[];
};

const getTherapists = async () => {
  const response = await fetch(`${ENDPOINT_URL}/therapists`);
  const json = await response.json();
  const items = json.data as any[];

  return items.map((d) => ({
    therapistId: d.id,
    surname: d.surname,
    firstName: d["first name"],
  })) as Therapist[];
};

const getBehaviors = async () => {
  const response = await fetch(`${ENDPOINT_URL}/behaviors`);
  const json = await response.json();
  const items = json.data as any[];

  return items.map((d) => ({
    behaviorId: Number(d.id),
    description: d.description,
    type: d.type,
  })) as Behavior[];
};

const getSessionsForPatient = async (patientId: string) => {
  const response = await fetch(
    `${ENDPOINT_URL}/sessions?patientId=${patientId}`
  );
  const json = await response.json();
  const items = json.data as any[];

  return items.map((d) => ({
    sessionId: d.id,
    start: new Date(d.start),
    end: new Date(d.end),
    patientId: d.patientId,
    therapistId: d.therapistId,
  })) as Session[];
};

const getSession = async (sessionId: number) => {
  const response = await fetch(`${ENDPOINT_URL}/sessions/${sessionId}`);
  const json = await response.json();
  const items = json.data as any[];

  return items
    .map((d) => ({
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
    }))
    .find((s) => s.sessionId === sessionId) as SessionDetails;
};

const getPatientBehaviorTrend = async (patientId: string) => {
  const response = await fetch(
    `${ENDPOINT_URL}/reports/patientBehaviorTrend?patientId=${patientId}`
  );
  const json = await response.json();
  const items = json.data as any[];

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
