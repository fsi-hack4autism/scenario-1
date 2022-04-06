import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

import BehaviorSparkLine from "../BehaviorSparkLine";
import PatientBehaviorGridProps from "./PatientBehaviorGridProps";
import "./PatientBehaviorGrid.css"

const PatientBehaviorGrid = ({ behaviorData, patientId }: PatientBehaviorGridProps) => (
    <Row className="m-2">
        {behaviorData.map(bd => (
            <Col xs="12">
                <Row className="border-bottom">
                    <Col className="d-flex align-items-center">
                        <Link to={`/patient/${patientId}/behaviors/${bd.behavior.behaviorId}`}>
                            {bd.behavior.description}
                        </Link>
                    </Col>
                    <Col xs="4" className="d-flex align-items-center">
                        <BehaviorSparkLine behavior={bd.behavior} data={bd.data} />
                    </Col>
                </Row>
            </Col>
        ))}
    </Row>
);

export default PatientBehaviorGrid;
