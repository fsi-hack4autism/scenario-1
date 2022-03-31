import { useQuery } from "react-query";
import Patient from "../models/Patient";

const fetchPatients = async () => {
    return [
        { id: "1", name: "mike" },
        { id: "2", name: "ken" },
        { id: "3", name: "graham" }
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
