import React from "react";
import { useParams } from "react-router";

import usePatient from "../../hooks/usePatient";
import useSessions from "../../hooks/useSessions";
import PatientBehaviors from "../PatientBehaviors";

import PatientInfoBreadcrumb from "./PatientInfoBreadcrumb";
import PatientInfoHeader from "./PatientInfoHeader";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(Number(patientId));
    const { sessions } = useSessions(Number(patientId));

    const patientBehaviorTrend = {
        sessions: [
            {
                sessionStart: new Date("2022-02-25T11:00:00-07:00"),
                behaviors: [
                    { behaviorId: 1, behaviorTotal: 10 },
                    { behaviorId: 2, behaviorTotal: 5 }
                ]
            },
            {
                sessionStart: new Date("2022-02-26T11:00:00-07:00"),
                behaviors: [
                    { behaviorId: 1, behaviorTotal: 3 },
                    { behaviorId: 2, behaviorTotal: 4 }
                ]
            },
            {
                sessionStart: new Date("2022-02-28T11:00:00-07:00"),
                behaviors: [
                    { behaviorId: 2, behaviorTotal: 5 }
                ]
            },
            {
                sessionStart: new Date("2022-03-31T10:00:00-07:00"),
                behaviors: [
                    { behaviorId: 1, behaviorTotal: 8 },
                    { behaviorId: 2, behaviorTotal: 8 }
                ]
            }
        ]
    }

    return (
        <div className="m-3">
            <PatientInfoBreadcrumb patient={patient} />
            <PatientInfoHeader patient={patient} />
            <h3>Behaviors</h3>
            { patient && (
                <PatientBehaviors patient={patient} patientBehaviorTrend={patientBehaviorTrend} />
            )}
            <h3>Sessions</h3>
            <ul>
                {sessions?.map(s => <a href="/calendar"><li key={s.sessionId}>{new Date(s.start).toDateString()}</li></a>)}
            </ul>
        </div>
    )
}

export default PatientInfo;
