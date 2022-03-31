import Patient from "../models/Patient";
import PatientDetails from "../models/PatientDetails";

const getPatient = (patientId: number): PatientDetails | undefined =>
  getPatients().find((p) => p.patientId === patientId);

const getPatients = (): PatientDetails[] =>
  JSON.parse(localStorage.getItem("patients") ?? "[]");

const createPatient = (patient: Patient) => {
  const patientId =
    getPatients().reduce(
      (max, patient) => (patient.patientId > max ? patient.patientId : max),
      0
    ) + 1;

  setPatient({
    ...patient,
    patientId,
    behaviorsList: [],
  });

  return patientId;
};

const setPatient = (patient: PatientDetails) => {
  let existing = getPatients();

  if (!existing.some((p) => p.patientId === patient.patientId)) {
    existing = [...existing, patient];
  } else {
    existing = existing.map((p) =>
      p.patientId !== patient.patientId ? p : patient
    );
  }

  localStorage.setItem("patients", JSON.stringify(existing));
};

// seed the mock data
if (localStorage.getItem("patients") == null) {
  const patients: PatientDetails[] = [
    {
      patientId: 1,
      firstName: "mike",
      surname: "mickelson",
      behaviorsList: [
        {
          behaviorId: 1,
          description: "Behavior 1",
          type: "Event",
        },
        {
          behaviorId: 2,
          description: "Behavior 2",
          type: "Duration",
        },
      ],
    },
    {
      patientId: 2,
      firstName: "ken",
      surname: "lastname",
      behaviorsList: [
        {
          behaviorId: 3,
          description: "Behavior 3",
          type: "TimeToResponse",
        },
      ],
    },
    {
      patientId: 3,
      firstName: "graham",
      surname: "alexander-thomson",
      behaviorsList: [],
    },
  ];

  localStorage.setItem("patients", JSON.stringify(patients));
}

export {createPatient, getPatient, getPatients, setPatient};
