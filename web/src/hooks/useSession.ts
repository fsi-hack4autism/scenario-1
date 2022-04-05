import { useQuery } from "react-query";

import { getSession } from "../api";
import SessionDetails from "../models/SessionDetails";

const useSession = (sessionId?: number) => {
  const { data, isError, isLoading } = useQuery<SessionDetails>(
    [`/sessions?session=${sessionId}`],
    () => getSession(sessionId ?? 0),
    {
      refetchInterval: 5000,
      enabled: sessionId != null,
    }
  );

  if (!sessionId) {
    return {
      session: undefined,
      isError: true,
      isLoading: false,
    };
  }

  return {
    session: data,
    isError,
    isLoading,
  };
};

export default useSession;
