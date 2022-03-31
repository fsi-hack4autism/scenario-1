import { useQuery } from "react-query";
import PatientDetails from "../models/PatientDetails";

const fetchPatients = async () => {
    return [
        {
            patientId: 1,
            firstName: "mike",
            surname: "mickelson",
            behaviorsList: [
                {
                    behaviorId: 1,
                    description: "Behavior 1",
                    type: "Event",
                },
                {
                    behaviorId: 2,
                    description: "Behavior 2",
                    type: "Duration",
                }
            ]
        },
        {
            patientId: 2,
            firstName: "ken",
            surname: "lastname",
            behaviorsList: [
                {
                    behaviorId: 3,
                    description: "Behavior 3",
                    type: "TimeToResponse",
                }
            ]
        },
        {
            patientId: 3,
            firstName: "graham",
            surname: "alexander-thompson",
            behaviorsList: []
        }
    ] as PatientDetails[];
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
