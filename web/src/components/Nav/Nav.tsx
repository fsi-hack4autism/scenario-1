import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav as Navigation, NavItem, NavLink as BsNavLink } from "reactstrap";

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(b => !b);

    return (
        <Navbar color="light" light expand="md">
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Navigation className="ml-auto" navbar>
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/">Home</BsNavLink>
                    </NavItem>
                    <NavItem>
                        <BsNavLink tag={NavLink} to="/calendar">Calendar</BsNavLink>
                    </NavItem>
                </Navigation>
            </Collapse>
        </Navbar>
    );
}

export default Nav;