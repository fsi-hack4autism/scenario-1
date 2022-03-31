import React from "react";

import usePatients from "../../hooks/usePatients";

const PatientList = () => {
    const { patients, isLoading, isError } = usePatients();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || patients == null) {
        return <div>Error!</div>
    }

    return (
        <>
            <h2>Patients:</h2>
            <ul>
                {patients.map(p => (<li key={p.id}>{p.name}</li>))}
            </ul>
        </>
    )
};

export default PatientList;
