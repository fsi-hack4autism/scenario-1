import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

import BehaviorSparkLine from "../BehaviorSparkLine";
import PatientBehaviorGridProps from "./PatientBehaviorGridProps";
import "./PatientBehaviorGrid.css"

const PatientBehaviorGrid = ({ behaviorData, patientId }: PatientBehaviorGridProps) => (
    <Row>
        {behaviorData.map(bd => (
            <Col lg="3" md="4" sm="6" xs="12">
                <Link
                    to={`/patient/${patientId}/behaviors/${bd.behavior.behaviorId}`}
                    className="behavior-grid__item text-decoration-none d-block px-1 py-2 rounded"
                >
                    <BehaviorSparkLine behavior={bd.behavior} data={bd.data} />
                </Link>
            </Col>
        ))}
    </Row>
);

export default PatientBehaviorGrid;
