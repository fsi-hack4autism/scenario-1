import { useQuery } from "react-query";

import Session from "../models/Session";
import { getSessionsForPatient } from "../api";

const useSessions = (patientId: string) => {
  const { data, isError, isLoading } = useQuery<Session[]>(
    [`/sessions?patient=${patientId}`],
    () => getSessionsForPatient(patientId)
  );

  return {
    sessions: data,
    isError,
    isLoading,
  };
};

export default useSessions;
