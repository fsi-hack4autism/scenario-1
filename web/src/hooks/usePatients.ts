import { useQuery } from "react-query";

import PatientDetails from "../models/PatientDetails";
import { getPatients } from "../mocks/store";

const fetchPatients = async () => {
    return getPatients();
}

const usePatients = () => {
    const { data, isError, isLoading } = useQuery<PatientDetails[]>(["/patients"], fetchPatients);

    return {
        patients: data,
        isError,
        isLoading
    };
}

export default usePatients;
