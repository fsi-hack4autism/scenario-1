import { useQuery } from "react-query";

import { getObjective } from "../api/api";

const usePatient = (
  patientId: string,
  objectiveId: string,
  includeData = false
) => {
  const { data, isError, isLoading } = useQuery(
    `/patient/${patientId}/objectives/${objectiveId}?include-data=${includeData}`,
    async () => await getObjective(patientId, objectiveId, includeData)
  );

  return {
    objective: data?.objective,
    data: data?.data,
    isError,
    isLoading,
  };
};

export default usePatient;
