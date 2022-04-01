import {useQuery} from "react-query";

import PatientDetails from "../models/PatientDetails";
import {getPatients, getBehaviors} from "../api/api";

const fetchPatient = async (patientId: string) => {
    const patients = await getPatients();
    return patients.find((p) => p.patientId === patientId);
};

const usePatient = (patientId: string) => {
    const {data, isError, isLoading} = useQuery<PatientDetails | undefined>(
        `/patient/${patientId}`,
        async () => {
            const patient = await fetchPatient(patientId);
            const behaviors = await getBehaviors();

            // For now, join all behvaiors with the patient.
            return {
                ...patient,
                behaviorsList: behaviors,
            } as PatientDetails;
        }
    );

    return {
        patient: data,
        isError,
        isLoading,
    };
};

export default usePatient;
