import React from "react";
import { useParams } from "react-router";
import { Table } from "reactstrap";
import usePatient from "../../hooks/usePatient";
import useSession from "../../hooks/useSession";
import SessionDetailsBreadcrumb from "./SessionDetailsBreadcrumb";

const SessionDetails = () => {
    const { sessionId } = useParams();
    const { session } = useSession(Number(sessionId));
    const { patient } = usePatient(session?.patientId ?? "");

    if (!session || !patient) {
        return null;
    }

    return (
        <div className="m-2">
            <SessionDetailsBreadcrumb session={session} patient={patient} />

            <Table>
                <thead>
                    <tr>
                        <th>Behavior</th>
                        <th>Start</th>
                        <th>Stop</th>
                    </tr>
                </thead>
                <tbody>
                    {session.events.map(e => (
                        <tr key={e.start.toISOString() + e.behaviorId}>
                            <td>{patient.behaviorsList.find(b => b.behaviorId === e.behaviorId)?.description ?? "Unknown"}</td>
                            <td>{e.start.toISOString()}</td>
                            <td>{e.end?.toISOString() ?? "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
};

export default SessionDetails;
