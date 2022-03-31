import {useQuery} from "react-query";

import Patient from "../models/Patient";
import {getPatients} from "../mocks/patientStore";

const fetchPatients = async () => {
    return getPatients();
};

const usePatients = () => {
    const {data, isError, isLoading} = useQuery<Patient[]>(
        ["/patients"],
        fetchPatients
    );

    return {
        patients: data,
        isError,
        isLoading,
    };
};

export default usePatients;
