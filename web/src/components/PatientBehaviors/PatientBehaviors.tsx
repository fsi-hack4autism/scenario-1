import Behavior from "../../models/Behavior";
import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";
import PatientBehaviorTrend from "../../models/PatientBehaviorTrend";
import PatientDetails from "../../models/PatientDetails";
import PatientBehavior from "../PatientBehavior/PatientBehavior";

const PatientBehaviors = ({patient, patientBehaviorTrend}: { patient: PatientDetails, patientBehaviorTrend?: PatientBehaviorTrend }) => {
    
    const GetDataForBehavior = (response: PatientBehaviorTrend, behavior: Behavior) : BehaviorReportDataItem[] => {
        
        return response.sessions
            .map(s => { return { sessionStart: s.sessionStart, behavior: s.behaviors.find(b => b.behaviorId === behavior.behaviorId)}})
            .filter(x => x.behavior !== undefined)
            .map(x => { return { date: x.sessionStart.getTime(), total: x.behavior!.behaviorTotal }});
    }

    return (
        <section>
            <h1>Behaviors</h1>
            <ol>
                {patient.behaviorsList.map(b => {
                    const data = (patientBehaviorTrend && GetDataForBehavior(patientBehaviorTrend, b));
                    return (
                        <li key={b.behaviorId}>
                            <PatientBehavior behavior={b} data={data} />
                        </li>
                    )
                })}
            </ol>
        </section>
    )

}

export default PatientBehaviors;