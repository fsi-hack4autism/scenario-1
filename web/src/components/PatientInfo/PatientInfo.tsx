import React from "react";
import { useParams } from "react-router";

const PatientInfo = () => {
    const { patientId } = useParams();

    return (
        <div>Patient Info For: {patientId}</div>
    )
}

export default PatientInfo;
