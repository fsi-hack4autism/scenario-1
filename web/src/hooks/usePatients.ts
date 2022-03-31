import { useQuery } from "react-query";
import Patient from "../models/Patient";

const fetchPatients = async () => {
    return [
        { patientId: "1", firstName: "mike", surname: "mickelson" },
        { patientId: "2", firstName: "ken", surname: "lastname" },
        { patientId: "3", firstName: "graham", surname: "alexander-thompson" }
    ];
}

const usePatients = () => {
    const { data, isError, isLoading } = useQuery<Patient[]>(["/patients"], fetchPatients);

    return {
        patients: data,
        isError,
        isLoading
    };
}

export default usePatients;
