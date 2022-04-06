import Behavior from "../../models/Behavior";
import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";
import BehaviorChart from "../BehaviorChart";

const PatientBehavior = ({behavior, data}: {behavior: Behavior, data?: BehaviorReportDataItem[]}) =>
    <>
        <p>{behavior.description}</p>
        {data && <BehaviorChart data={data}/>}
    </>


export default PatientBehavior;