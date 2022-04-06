import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

import PatientDetails from "../../models/PatientDetails";

const PatientBehaviorsCard = ({ patient }: { patient: PatientDetails }) => (
    <Card className="border m-1">
        <CardBody>
            <CardTitle className="border-bottom">
                <h3>Behaviors</h3>
            </CardTitle>
            <CardText>
                { patient?.behaviorsList &&
                    <ul>
                        {patient.behaviorsList.map(b => (
                            <li key={b.behaviorId}>
                                <Link to={`/patient/${patient.patientId}/behaviors/${b.behaviorId}`}>{b.description}</Link>
                            </li>
                        ))}
                    </ul>
                }
            </CardText>
        </CardBody>
    </Card>
);

export default PatientBehaviorsCard;
