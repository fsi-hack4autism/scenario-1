import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

import Session from "../../models/Session";

const PatientSessionsCard = ({ sessions }: { sessions?: Session[] }) => (
    <Card className="border m-1">
        <CardBody>
            <CardTitle className="border-bottom">
                <h3>Sessions</h3>
            </CardTitle>
            <CardText>
                {sessions == null
                    ? <p>No sessions added yet!</p>
                    : <ul>
                        {sessions?.map(s => (<li key={s.sessionId}>
                            <Link to={`/sessions/${s.sessionId}`}>
                                {new Date(s.start).toDateString()}
                            </Link>
                        </li>))}
                    </ul>
                }
            </CardText>
        </CardBody>
    </Card>
);

export default PatientSessionsCard;
