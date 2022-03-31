type Session = {
    sessionId: number;
    start: Date;
    end: Date;
    patientId: number;
    therapistId: number;
    eventSummary: number;
};

export default Session;
