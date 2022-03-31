import React from "react";
import { Input } from "reactstrap";

import useFilteredPatients from "../../hooks/useFilteredPatients";

import PatientCard from "../PatientCard";
import "./PatientList.css";

const PatientList = () => {
    const { patients, isLoading, isError, setFilter } = useFilteredPatients();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || patients == null) {
        return <div>Error!</div>
    }

    return (
        <div className="patient-list__wrapper p-2">
            <div className="patient-list__filter">
                <Input
                    className="patient-list__filter-input"
                    onChange={f => setFilter(f.target.value)}
                    placeholder="Filter..."
                />
            </div>
            <div className="patient-list">
                {patients.map(p => (
                    <div 
                        className="patient-list__item"
                        key={p.patientId}
                    >
                        <PatientCard patient={p} />
                    </div>
                ))}
            </div>
        </div>
    )
};

export default PatientList;
