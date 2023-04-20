import { useQuery } from "react-query";

import { getObjectives, getPatient } from "../api/api";
import Objective from "../models/Objective";
import Patient from "../models/Patient";

const usePatient = (patientId: string, includeObjectives = false) => {
  const { data: patient, isError: isPatError, isLoading: isPatLoading } = useQuery<Patient>(
    `/patient/${patientId}`,
    async () => await getPatient(patientId)
  );

   const { data: objectives, isError: isObjError, isLoading: isObjLoading } = useQuery<Objective[]>(
     `/patient/${patientId}/objectives`,
     async () => await getObjectives(patientId),
     { enabled: includeObjectives }
   );

  return {
    patient,
    objectives,
    isError: isPatError || isObjError,
    isLoading: isPatLoading || (!includeObjectives && isObjLoading),
  };
};

export default usePatient;
