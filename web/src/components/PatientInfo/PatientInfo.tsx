import React from "react";
import { useParams } from "react-router";
import usePatient from "../../hooks/usePatient";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(Number(patientId));

    return (
        <div>Patient Info For: {patient?.firstName} {patient?.surname}</div>
    )
}

export default PatientInfo;
