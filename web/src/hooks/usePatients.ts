import { useQuery } from "react-query";

const fetchPatients = async () => {
    return [
        { id: "1", name: "mike" },
        { id: "2", name: "ken" },
        { id: "3", name: "graham" }
    ];
}

const usePatients = () => {
    const { data, isError, isLoading } = useQuery(["/patients"], fetchPatients);

    return {
        patients: data,
        isError,
        isLoading
    };
}

export default usePatients;
