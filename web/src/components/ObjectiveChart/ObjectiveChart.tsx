import React from "react";

import useObjective from "../../hooks/useObjective";
import CounterChart from "./CounterChart";

const ObjectiveChart = ({
  patientId,
  objectiveId,
}: {
  patientId: string;
  objectiveId: string;
}) => {
  const { objective, data, isLoading, isError } = useObjective(
    patientId,
    objectiveId,
    true
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || objective == null || data == null) {
    return <div>An unexpected error occurred</div>;
  }

  switch (objective.type) {
    case "Counter":
      return (
        <div className="m-3">
          <h3>{objective.description}</h3>
          <CounterChart data={data} />
        </div>
      );
    default:
      // TODO: Make a chart for all types
      return <div>Chart type {objective?.type} is not yet supported.</div>;
  }
};

export default ObjectiveChart;
