import React from "react";

import usePatients from "../../hooks/usePatients";

const Profile = () => {
    const { patients, isError, isLoading } = usePatients();

    if (isError) {
        return "An unknown error occurred"
    }

    if (isLoading) {
        return <div className="m-3">Loading...</div>
    }

    return (
        <div className="m-3">
            <h2 className="text-capitalize">Ken Lejnieks</h2>
            <br />
            <h3>Patients</h3>
            <ul>
                {patients?.map(p => <li key={p.patientId}>{p.firstName} {p.surname}</li>) ?? null}
            </ul>
        </div>
    )
}

export default Profile;
