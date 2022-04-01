import React from "react";
import PatientDetails from "../../models/PatientDetails";
import UserImage from "../UserImage";

const PatientInfoHeader = ({ patient }: { patient?: PatientDetails | null }) => (
    <div className="d-flex flex-row align-items-stretch border-top border-start border-end rounded p-1 m-1" style={{ borderBottom: "solid 5px #333399" }}>
        <div className="m-1 me-3">
            <UserImage height="5rem" />
        </div>

        <div className="d-flex flex-column justify-content-center">
            <h2 className="text-capitalize mb-0">{patient?.firstName} {patient?.surname}</h2>
            <p className="text-muted mb-0">{patient?.behaviorsList.length ?? 0} behavior(s) tracked</p>
        </div>
    </div>
);

export default PatientInfoHeader;
