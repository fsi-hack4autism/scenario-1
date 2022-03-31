import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import usePatient from "../../hooks/usePatient";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(Number(patientId));

    return (
        <div className="mx-1">
            <div>
                <Link to="/">Patients</Link>
                <span className="mx-1">&gt;</span>
                <span className="text-muted text-capitalize">
                    {patient?.firstName}
                    &nbsp;
                    {patient?.surname}
                </span>
            </div>
            <br />
            <h2 className="text-capitalize">{patient?.firstName} {patient?.surname}</h2>
        </div>
    )
}

export default PatientInfo;
