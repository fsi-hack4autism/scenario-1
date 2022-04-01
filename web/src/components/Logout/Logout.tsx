import React from "react";
import Icon from "../Icon";

import "./Logout.css";
import { Link } from "react-router-dom";

const Logout = () => (
    <Link to={`/login`} className="p-1 m-1">
            <span className="patient-card__name text-black">Login</span>
    </Link>
);

export default Logout;
