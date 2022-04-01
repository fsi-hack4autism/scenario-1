import React from "react";
import { Link } from "react-router-dom";

import PatientDetails from "../../models/PatientDetails";

const PatientInfoBreadcrumb = ({ patient }: { patient?: PatientDetails | null }) => (
    <div className="m-2 d-flex flex-wrap align-items-center">
        <Link to="/home">Patients</Link>
        <span className="mx-1">&gt;</span>
        <p className="text-muted text-capitalize mb-0">
            {patient?.firstName}
            &nbsp;
            {patient?.surname}
        </p>
    </div>
);

export default PatientInfoBreadcrumb;
