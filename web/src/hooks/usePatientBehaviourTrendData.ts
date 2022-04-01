import {useQuery} from "react-query";

import PatientBehaviorTrend from "../models/PatientBehaviorTrend";
import {getPatientBehaviorTrend} from "../api/mockApi";

const usePatientBehaviorTrendData = (patientId?: number) => {
    const {data, isError, isLoading} = useQuery<PatientBehaviorTrend>(
        [`/trend?patient=${patientId}`],
        () => getPatientBehaviorTrend(patientId!)
    );

    return {
        trendData: data,
        isError,
        isLoading,
    };
};

export default usePatientBehaviorTrendData;
