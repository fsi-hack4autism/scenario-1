import React from "react";
import { useParams } from "react-router";

import ObjectiveChart from "../../components/ObjectiveChart";

const ViewObjectivePage = () => {
  const { patientId, objectiveId } = useParams();

  if (patientId == null || objectiveId == null) {
    return <div>"Whoops. Bad URL"</div>;
  }

  return (
    <div>
      <ObjectiveChart objectiveId={objectiveId} patientId={patientId} />
    </div>
  );
};

export default ViewObjectivePage;
