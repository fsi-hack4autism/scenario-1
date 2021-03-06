import React from "react";
import { useParams } from "react-router";
import { Row, Col } from "reactstrap";

import usePatient from "../../hooks/usePatient";
import useSessions from "../../hooks/useSessions";
import useBehaviorsData from "../../hooks/useBehaviorsData";

import PatientInfoBreadcrumb from "./PatientInfoBreadcrumb";
import PatientInfoHeader from "./PatientInfoHeader";
import PatientSessionsCard from "./PatientSessionsCard";
import PatientBehaviorGrid from "../PatientBehaviorGrid";

const PatientInfo = () => {
    const { patientId } = useParams();
    const { patient } = usePatient(patientId ?? "");
    const { sessions } = useSessions(patientId ?? "");
    const data = useBehaviorsData(patient);

    return (
        <div className="m-3">
            <PatientInfoBreadcrumb patient={patient} />
            <PatientInfoHeader patient={patient} />
            <Row>
                <Col sm="12" md="4" lg="3">
                    <PatientSessionsCard sessions={sessions} />
                </Col>
                <Col sm="12" md="8" lg="9">
                    { patient && data && (
                        <PatientBehaviorGrid patientId={patient.patientId} behaviorData={data} />
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default PatientInfo;
