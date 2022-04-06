import React from "react";
import Icon from "../Icon";

import PatientCardProps from "./PatientCardProps";
import "./PatientCard.css";
import { Link } from "react-router-dom";

const PatientCard = ({ patient }: PatientCardProps) => (
    <Link to={`/patient/${patient.patientId}`} className="patient-card border rounded-1 p-1 m-1">
        <Icon
            name="user-circle-o"
            color="text-muted"
            className="patient-card__icon fa-fw"
        />
        <span className="patient-card__name text-black">{patient.firstName} {patient.surname}</span>
    </Link>
);

export default PatientCard;
