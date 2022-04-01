import {useQuery} from "react-query";

import Session from "../models/Session";
import {getSessionsByPatientId} from "../mocks/sessionStore";

const fetchSessions = async (patientId: number) => {
    return getSessionsByPatientId(patientId);
};

const useSessions = (patientId: number) => {
    const {data, isError, isLoading} = useQuery<Session[]>(
        [`/sessions?patient=${patientId}`],
        () => fetchSessions(patientId)
    );

    return {
        sessions: data,
        isError,
        isLoading,
    };
};

export default useSessions;
