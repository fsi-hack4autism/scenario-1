import React from "react";
import { useParams } from "react-router";

import PatientInfo from "../../components/PatientInfo";
import usePatient from "../../hooks/usePatient";

const PatientPage = () => {
    const { patientId } = useParams();

    const { patient, objectives, isLoading, isError } = usePatient(patientId ?? "", true);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || patient == null || objectives == null) {
        return <div>Unexpected error!</div>;
    }

    return <PatientInfo patient={patient} objectives={objectives} />
}

export default PatientPage;
