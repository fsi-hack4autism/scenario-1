import React from "react";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

import Behavior from "../../models/Behavior";

const PatientBehaviorsCard = ({ behaviorList }: { behaviorList?: Behavior[] }) => (
    <Card className="border m-1">
        <CardBody>
            <CardTitle className="border-bottom">
                <h3>Behaviors</h3>
            </CardTitle>
            <CardText>
                {behaviorList == null
                    ? <p>No behaviors added yet!</p>
                    : <ul>
                        {behaviorList?.map(b => (<li key={b.behaviorId}>{b.description}</li>))}
                    </ul>
                }
            </CardText>
        </CardBody>
    </Card>
);

export default PatientBehaviorsCard;
