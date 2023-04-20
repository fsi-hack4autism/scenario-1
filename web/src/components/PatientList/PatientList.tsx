import React from "react";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";

import useFilteredPatients from "../../hooks/useFilteredPatients";
import Icon from "../Icon";

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
        <div className="patient-list__wrapper p-2 text-center m-3 mt-5">
            <h3>Recent Learners</h3>
            <div className="patient-list__filter">
                <Input
                    className="patient-list__filter-input"
                    onChange={f => setFilter(f.target.value)}
                    placeholder="Filter..."
                />
            </div>
            <div className="patient-list mt-4">
                {patients.map(p => (
                    <div 
                        className="patient-list__item"
                        key={p.patientId}
                    >
                        <PatientCard patient={p} />
                    </div>
                ))}
                <div className="patient-list__item">
                <Link
                    to="/patient"
                    className="patient-list__filter-link"
                >
                    <Icon name="plus" /> New Learner
                </Link>
                </div>
            </div>
            
        </div>
    )
};

export default PatientList;
