import Objective from "../models/Objective";
import Patient from "../models/Patient";
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

export {
  getPatients,
  createPatient,
  getPatient,
  getObjective,
  getObjectives,
};
