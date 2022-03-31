import { useQuery } from "react-query";

import Patient from "../models/Patient";
import { getPatient } from "../mocks/store";

const fetchPatient = async (patientId: number) => {
    return getPatient(patientId);
}

const usePatient = (patientId: number) => {
    const { data, isError, isLoading } = useQuery<Patient|undefined>(`/patient/${patientId}`, async () => await fetchPatient(patientId), {
        enabled: !isNaN(patientId)
    });

    if (isNaN(patientId)) {
        return {
            patient: null,
            isError: true,
            isLoading: false
        };
    }

    return {
        patient: data,
        isError,
        isLoading
    };
}

export default usePatient;
