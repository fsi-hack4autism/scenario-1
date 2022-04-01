type Session = {
  sessionId: number;
  start: Date;
  end: Date;
  patientId: number;
  therapistId: number;
  eventSummary: Map<number, number>;
};

export default Session;
