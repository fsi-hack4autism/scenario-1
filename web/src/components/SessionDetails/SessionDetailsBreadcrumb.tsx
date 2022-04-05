import React from "react";
import { Link } from "react-router-dom";
import Patient from "../../models/Patient";
import Session from "../../models/Session";

const SessionDetailsBreadcrumb = ({ session, patient }: { session: Session, patient: Patient }) => (
    <div className="m-2 d-flex flex-wrap align-items-center">
        <Link to="/patients">Patients</Link>
        <span className="mx-1">&gt;</span>
        <Link to={`/patient/${patient.patientId}`}>
            {patient?.firstName}
            &nbsp;
            {patient?.surname}
        </Link>
        <span className="mx-1">&gt;</span>
        <p className="text-muted text-capitalize mb-0">
            {session.start.toDateString()} Session
        </p>
    </div>
);

export default SessionDetailsBreadcrumb;
