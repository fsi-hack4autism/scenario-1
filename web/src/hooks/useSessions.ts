import {useQuery} from "react-query";

import Session from "../models/Session";
import {getSessionsForPatient} from "../api/mockApi";

const useSessions = (patientId: number) => {
    const {data, isError, isLoading} = useQuery<Session[]>(
        [`/sessions?patient=${patientId}`],
        () => getSessionsForPatient(patientId)
    );

    return {
        sessions: data,
        isError,
        isLoading,
    };
};

export default useSessions;
