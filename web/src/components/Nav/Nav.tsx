import React from "react";
import { Link } from "react-router-dom";

const Nav = () => (
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
    </ul>
);

export default Nav;