import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav as Navigation, NavItem, NavLink as BsNavLink, NavbarBrand } from "reactstrap";
import Icon from "../Icon";

import "./Nav.css";

const User = {
    firstName: "Ken"
}

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(b => !b);

    return (
        <Navbar color="light" light expand="md">
            <NavbarBrand>
                <img
                    className="logo-container"
                    alt="logo"
                    src="https://scontent-lga3-1.xx.fbcdn.net/v/t1.6435-9/67416025_2358458134237435_1334625056751353856_n.png?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=LYCbI71E0aoAX9aSwo5&_nc_ht=scontent-lga3-1.xx&oh=00_AT_qhVmCScb7hZG_v-5xjEBMG2LL3EUuMmU_k5EB8aukIA&oe=626C8CEB"
                />
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Navigation className="ml-auto" navbar>
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/home">Home</BsNavLink>
                    </NavItem>
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/calendar">Calendar</BsNavLink>
                    </NavItem>
                </Navigation>
                <div className="navbar-spacer"></div>
                <Navigation className="justify-content-end">
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/profile">
                            <span className="text-muted">Welcome back {User.firstName}</span>
                            <Icon name="user" color="text-muted" className="patient-card__icon fa-fw" />
                        </BsNavLink>
                    </NavItem>
                    <NavItem>
                        <BsNavLink>
                            <span className="text-muted">|</span>
                        </BsNavLink>
                    </NavItem>
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/logout">
                            <span className="text-muted">logout</span>
                        </BsNavLink>
                    </NavItem>
                </Navigation>
            </Collapse>
        </Navbar>
    );
}

export default Nav;