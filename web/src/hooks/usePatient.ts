import {useQuery} from "react-query";

import PatientDetails from "../models/PatientDetails";
import {getPatient} from "../mocks/patientStore";

const fetchPatient = async (patientId: number) => {
    return getPatient(patientId);
};

const usePatient = (patientId: number) => {
    const {data, isError, isLoading} = useQuery<PatientDetails | undefined>(
        `/patient/${patientId}`,
        async () => await fetchPatient(patientId),
        {
            enabled: !isNaN(patientId),
        }
    );

    if (isNaN(patientId)) {
        return {
            patient: null,
            isError: true,
            isLoading: false,
        };
    }

    return {
        patient: data,
        isError,
        isLoading,
    };
};

export default usePatient;
