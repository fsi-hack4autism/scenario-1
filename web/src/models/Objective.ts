type Objective = {
    objectiveId: string;
    description: string;
    type: "Counter" | "Duration" | "Latency";
}

export default Objective;
