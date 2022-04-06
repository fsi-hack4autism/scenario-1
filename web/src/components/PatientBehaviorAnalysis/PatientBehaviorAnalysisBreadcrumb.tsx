import React from "react";
import { Link } from "react-router-dom";
import Behavior from "../../models/Behavior";

import PatientDetails from "../../models/PatientDetails";

const PatientBehaviorAnalysisBreadcrumb = ({ patient, behavior }: { patient: PatientDetails, behavior: Behavior }) => (
    <div className="m-2 d-flex flex-wrap align-items-center">
        <Link to="/patients">Patients</Link>
        <span className="mx-1">&gt;</span>
        <Link to={`/patient/${patient?.patientId}`} className="text-capitalize">
            {patient?.firstName}
            &nbsp;
            {patient?.surname}
        </Link>
        <span className="mx-1">&gt;</span>
        <p className="text-muted text-capitalize mb-0">
            {behavior.description}
        </p>
    </div>
);

export default PatientBehaviorAnalysisBreadcrumb;
