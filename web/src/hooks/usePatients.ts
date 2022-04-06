import { useQuery } from "react-query";

import Patient from "../models/Patient";
import { getPatients } from "../api";

const usePatients = () => {
  const { data, isError, isLoading } = useQuery<Patient[]>(
    ["/patients"],
    getPatients
  );

  return {
    patients: data,
    isError,
    isLoading,
  };
};

export default usePatients;
