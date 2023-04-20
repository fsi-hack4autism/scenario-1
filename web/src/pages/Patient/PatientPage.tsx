import React from "react";
import { useParams } from "react-router";

import PatientInfo from "../../components/PatientInfo";
import usePatient from "../../hooks/usePatient";

const PatientPage = () => {
  const { patientId } = useParams();

  const { patient, objectives, isLoading, isError } = usePatient(
    patientId ?? "",
    true
  );
  if (isError) {
    return <div>Unexpected error!</div>;
  }

  if (isLoading || patient == null || objectives == null) {
    return <div>Loading...</div>;
  }

  return <PatientInfo patient={patient} objectives={objectives} />;
};

export default PatientPage;
