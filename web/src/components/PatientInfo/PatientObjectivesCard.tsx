import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

import Objective from "../../models/Objective";
import Patient from "../../models/Patient";

const PatientObjectivesCard = ({
  patient,
  objectives,
}: {
  patient: Patient;
  objectives: Objective[];
}) => (
  <Card className="border m-1">
    <CardBody>
      <CardTitle className="border-bottom">
        <h3>Objectives</h3>
      </CardTitle>
      <CardText tag="div">
        {objectives && (
          <ul>
            {objectives.map((obj) => (
              <li key={obj.objectiveId}>
                <Link
                  to={`/patient/${patient.patientId}/objective/${obj.objectiveId}`}
                >
                  {obj.description}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardText>
    </CardBody>
  </Card>
);

export default PatientObjectivesCard;
