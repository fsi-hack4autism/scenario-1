import React from "react";
import { useParams } from "react-router";
import { Table } from "reactstrap";
import usePatient from "../../hooks/usePatient";
import useSession from "../../hooks/useSession";

const SessionDetails = () => {
    const { sessionId } = useParams();
    const { session } = useSession(sessionId);
    const { patient } = usePatient(session?.patientId ?? "");

    if (!session || !patient) {
        return null;
    }

    return (
        <Table className="m-2">
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
    )
};

export default SessionDetails;
