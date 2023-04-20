import Objective from "../models/Objective";
import ObjectiveData from "../models/ObjectiveData";
import Patient from "../models/Patient";

const createPatient = async (patient: {
  firstName: string;
  surname: string;
}): Promise<Patient> => {
  return Promise.resolve({
    patientId: "User1",
    firstName: "John",
    surname: "Smith",
  });
};

const getPatient = async (patientId: string): Promise<Patient> => {
  return Promise.resolve({
    patientId: "User1",
    firstName: "John",
    surname: "Smith",
  });
};

const getObjectives = async (patientId: string): Promise<Objective[]> => {
  return Promise.resolve([
    {
      description: "Tantrum",
      type: "Duration",
      objectiveId: "objective-1",
    },
  ]);
};

const getObjective = async (
  patientId: string,
  objectiveId: string,
  includeData = false
): Promise<{ objective: Objective; data?: ObjectiveData[] }> => {
  const data: ObjectiveData[] | undefined = includeData
    ? [
        {
          startTime: new Date("2023-04-19T17:32:28Z"),
        },
        {
          startTime: new Date("2023-04-19T17:34:28Z"),
        },
        {
          startTime: new Date("2023-04-19T17:38:28Z"),
        },
        {
          startTime: new Date("2023-04-19T17:42:28Z"),
        },
        {
          startTime: new Date("2023-04-19T17:42:50Z"),
        },
        {
          startTime: new Date("2023-04-19T17:44:50Z"),
        },
      ]
    : undefined;

  return Promise.resolve({
    objective: {
      description: "Tantrum",
      type: "Duration",
      objectiveId: "objective-1",
    },
    data: data,
  });
};

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

export { getPatient, getPatients, getObjectives, getObjective, createPatient };
