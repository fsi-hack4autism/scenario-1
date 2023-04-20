import React from "react";
import { Row, Col } from "reactstrap";

import Patient from "../../models/Patient";
import Objective from "../../models/Objective";

import PatientInfoHeader from "./PatientInfoHeader";
import PatientObjectivesCard from "./PatientObjectivesCard";

const PatientInfo = ({ patient, objectives }: { patient: Patient, objectives: Objective[] }) => (
        <div className="m-3">
            <PatientInfoHeader patient={patient} />
            <Row>
                <Col sm="12" md="4" lg="3">
                    <PatientObjectivesCard patient={patient} objectives={objectives} />
                </Col>
            </Row>
        </div>
    )

export default PatientInfo;
