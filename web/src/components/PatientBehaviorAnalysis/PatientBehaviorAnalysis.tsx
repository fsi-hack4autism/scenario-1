import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import usePatient from "../../hooks/usePatient";
import Behavior from "../../models/Behavior";
import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";
import BehaviorChart from "../BehaviorChart";

import PatientBehaviorTrendData from "../PatientInfo/PatientBehaviorTrendData";
import PatientBehaviorAnalysisBreadcrumb from "./PatientBehaviorAnalysisBreadcrumb";

const GetDataForBehavior = (behavior: Behavior): BehaviorReportDataItem[] => {

    return PatientBehaviorTrendData.sessions
        .map(s => { return { sessionStart: s.sessionStart, behavior: s.behaviors.find(b => b.behaviorId === behavior.behaviorId) } })
        .filter(x => x.behavior !== undefined)
        .map(x => { return { date: x.sessionStart.getTime(), total: x.behavior!.behaviorTotal } });
}

const PatientBehaviorAnalysis = () => {
    const { patientId, behaviorId } = useParams();
    const { patient } = usePatient(patientId ?? "");
    const behavior = useMemo(() => patient?.behaviorsList.find(b => b.behaviorId === Number(behaviorId)), [behaviorId, patient]);

    const navigate = useNavigate();

    if (patient == null || behavior == null) {
        navigate("/");
        return null;
    }

    const data = GetDataForBehavior(behavior);

    return (
        <div className="m-1">
            <PatientBehaviorAnalysisBreadcrumb patient={patient} behavior={behavior} />
            <h2 className="text-capitalize">{behavior.description}</h2>
            <BehaviorChart data={data} />
        </div>);
}

export default PatientBehaviorAnalysis;
