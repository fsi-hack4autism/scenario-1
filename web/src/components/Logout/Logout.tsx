import React from "react";
import { Link } from "react-router-dom";

import "./Logout.css";

const Logout = () => (
    <Link to={`/login`} className="p-1 m-1">
        <span className="patient-card__name text-black">Login</span>
    </Link>
);

export default Logout;
