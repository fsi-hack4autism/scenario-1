import React from "react";

import usePatients from "../../hooks/usePatients";
import PatientCard from "../PatientCard";
import "./PatientList.css";

const PatientList = () => {
    const { patients, isLoading, isError } = usePatients();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || patients == null) {
        return <div>Error!</div>
    }

    return (
        <div className="patient-list p-2">
            {patients.map(p => (<div className="patient-list__item"><PatientCard key={p.id} patient={p} /></div>))}
        </div>
    )
};

export default PatientList;
