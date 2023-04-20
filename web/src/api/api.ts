import Objective from "../models/Objective";
import Patient from "../models/Patient";
import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import Session from "../models/Session";
import SessionDetails from "../models/SessionDetails";
import Therapist from "../models/Therapist";
import { ENDPOINT_URL } from "../configuration";
import ObjectiveData from "../models/ObjectiveData";
import moment from "moment";

const getPatients = async (): Promise<Patient[]> => {
  const response = await fetch(`${ENDPOINT_URL}/patients`);
  const json = await response.json();

  type ApiPatient = { id: string } & Pick<Patient, "firstName" | "surname">;

  const items = json.patients as ApiPatient[];

  return items.map((p) => ({
    patientId: p.id,
    surname: p.surname,
    firstName: p.firstName,
  }));
};

const createPatient = async (patient: {
  firstName: string;
  surname: string;
}): Promise<Patient> => {
  const response = await fetch(`${ENDPOINT_URL}/patients`, {
    method: "POST",
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    throw Error("Unable to create the patient");
  }

  return await response.json();
};

const getPatient = async (patientId: string): Promise<Patient> => {
  const response = await fetch(`${ENDPOINT_URL}/patients/${patientId}`);

  type ApiPatient = { id: string } & Pick<Patient, "firstName" | "surname">;

  const json = (await response.json()) as { patient: ApiPatient };

  return {
    patientId: json.patient.id,
    firstName: json.patient.firstName,
    surname: json.patient.surname,
  };
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

const getObjectives = async (patientId: string): Promise<Objective[]> => {
  const response = await fetch(
    `${ENDPOINT_URL}/patients/${patientId}/objectives`
  );

  const json = await response.json();

  type ApiObjective = { id: string } & Pick<Objective, "description" | "type">;

  const items = json.objectives as ApiObjective[];

  return items.map((o) => ({
    objectiveId: o.id,
    description: o.description,
    type: o.type,
  }));
};

const getObjective = async (
  patientId: string,
  objectiveId: string,
  includeData = false
): Promise<{ objective: Objective; data?: ObjectiveData[] }> => {
  const response = await fetch(
    `${ENDPOINT_URL}/patients/${patientId}/objectives/${objectiveId}?include-data=${includeData}`
  );

  type ApiObjective = { id: string } & Pick<Objective, "description" | "type">;
  type ApiData = { objectiveId: string; startTime: string; endTime: string };

  const json: { objective: ApiObjective; data?: ApiData[] } =
    await response.json();

  return {
    objective: {
      objectiveId: json.objective.id,
      description: json.objective.description,
      type: json.objective.type,
    },
    data: json.data?.map((d) => ({
      startTime: moment(d.startTime).toDate(),
      endTime: moment(d.endTime).toDate(),
    })),
  };
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

const getObjectiveData = async (
  patientId: string,
  objectiveId: string
): Promise<ObjectiveData[]> => {
  const response = await fetch(
    `${ENDPOINT_URL}/patients/${patientId}/objectives/${objectiveId}?include-data=true`
  );

  type ApiObjectiveData = { objective: Objective; data: ObjectiveData[] };

  const json: ApiObjectiveData = await response.json();

  return json.data;
};

export {
  getPatients,
  createPatient,
  getPatient,
  getTherapists,
  getObjective,
  getObjectives,
  getObjectiveData,
  getSessionsForPatient,
  getSession,
  getPatientBehaviorTrend,
};
