import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  Nav as Navigation,
  NavItem,
  NavLink as BsNavLink,
  NavbarBrand,
} from "reactstrap";
import Icon from "../Icon";

import "./Nav.css";

const User = {
  firstName: "Ken",
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((b) => !b);

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand tag={NavLink} to="/">
        <img
          className="logo-container"
          alt="Scenario 1 IoT"
          src="autism-awareness.svg"
        />
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Navigation className="ml-auto" navbar>
          <NavItem>
            <BsNavLink tag={NavLink} to="/patients">
              Learners
            </BsNavLink>
          </NavItem>
          <NavItem>
            <BsNavLink tag={NavLink} to="/calendar">
              Calendar
            </BsNavLink>
          </NavItem>
        </Navigation>
        <div className="navbar-spacer"></div>
        <Navigation className="justify-content-end">
          <NavItem>
            <BsNavLink tag={NavLink} to="/profile">
              <span className="text-muted">Welcome, {User.firstName}</span>
              <Icon
                name="user"
                color="text-muted"
                className="patient-card__icon fa-fw"
              />
            </BsNavLink>
          </NavItem>
          <NavItem>
            <BsNavLink className="px-0">
              <span className="text-muted">|</span>
            </BsNavLink>
          </NavItem>
          <NavItem>
            <BsNavLink tag={NavLink} to="/">
              <span className="text-muted">Logout</span>
            </BsNavLink>
          </NavItem>
        </Navigation>
      </Collapse>
    </Navbar>
  );
};

export default Nav;
