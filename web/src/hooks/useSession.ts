import { useQuery } from "react-query";

import { getSession } from "../api/mockApi";
import SessionDetails from "../models/SessionDetails";

const useSession = (sessionId?: string) => {
    const { data, isError, isLoading } = useQuery<SessionDetails>(
        [`/sessions?session=${sessionId}`],
        () => getSession(sessionId ?? ""),
        {
            refetchInterval: 5000,
            enabled: sessionId != null
        }
    );

    if (!sessionId) {
        return {
            session: undefined,
            isError: true,
            isLoading: false
        }
    }

    return {
        session: data,
        isError,
        isLoading,
    };
};

export default useSession;
