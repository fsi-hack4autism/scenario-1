import React from "react";
import { useParams } from "react-router";
import { Row, Col } from "reactstrap";

import usePatient from "../../hooks/usePatient";
import useSessions from "../../hooks/useSessions";

import PatientInfoBreadcrumb from "./PatientInfoBreadcrumb";
import PatientInfoHeader from "./PatientInfoHeader";
import PatientSessionsCard from "./PatientSessionsCard";
import PatientBehaviorsCard from "./PatientBehaviorsCard";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(Number(patientId));
    const { sessions } = useSessions(Number(patientId));

    return (
        <div className="m-3">
            <PatientInfoBreadcrumb patient={patient} />
            <PatientInfoHeader patient={patient} />
            <Row>
                <Col sm="12" md="6">
                    { patient && (
                        <PatientBehaviorsCard patient={patient} />
                    )}
                </Col>

                <Col sm="12" md="6">
                    <PatientSessionsCard sessions={sessions} />
                </Col>
            </Row>
        </div>
    )
}

export default PatientInfo;
