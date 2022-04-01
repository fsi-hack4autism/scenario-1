import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import usePatient from "../../hooks/usePatient";
import useSessions from "../../hooks/useSessions";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(Number(patientId));
    const { sessions } = useSessions(Number(patientId));

    return (
        <div className="m-3">
            <div>
                <Link to="/home">Patients</Link>
                <span className="mx-1">&gt;</span>
                <span className="text-muted text-capitalize">
                    {patient?.firstName}
                    &nbsp;
                    {patient?.surname}
                </span>
            </div>
            <br />
            <h2 className="text-capitalize">{patient?.firstName} {patient?.surname}</h2>
            <h3>Behaviors</h3>
            <ul>
                {patient?.behaviorsList.map(b => <li key={b.behaviorId}>{b.description}</li>)}
            </ul>
            <h3>Sessions</h3>
            <ul>
                {sessions?.map(s => <a href="/calendar"><li key={s.sessionId}>{new Date(s.start).toDateString()}</li></a>)}
            </ul>
        </div>
    )
}

export default PatientInfo;
