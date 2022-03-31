import { useQuery } from "react-query";
import Patient from "../models/Patient";

const fetchPatient = async (patientId: number) => {
    const patients = [
        { patientId: 1, firstName: "mike", surname: "mickelson" },
        { patientId: 2, firstName: "ken", surname: "lastname" },
        { patientId: 3, firstName: "graham", surname: "alexander-thompson" }
    ];

    return patients.filter(p => p.patientId === patientId)[0];
}

const usePatient = (patientId: number) => {
    const { data, isError, isLoading } = useQuery<Patient>(`/patient/${patientId}`, async () => await fetchPatient(patientId), {
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
