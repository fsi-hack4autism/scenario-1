import SessionEvent from "./SessionEvent";
import Session from "./Session";

type SessionDetails = {
    events: SessionEvent[];
} & Session;

export default SessionDetails;
