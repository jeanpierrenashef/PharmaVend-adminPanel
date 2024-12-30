import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css"; 

const Navbar = () => {
    return (
        <div className="navbar">
        <div className="navbar-header">
            <h2>Mate</h2>
        </div>
        <nav className="navbar-links">
            <NavLink to="/dashboard" activeClassName="active-link">
            <i className="icon-dashboard"></i> Dashboard
            </NavLink>
            <NavLink to="/orders" activeClassName="active-link">
            <i className="icon-orders"></i> Orders
            </NavLink>
            <NavLink to="/inventory" activeClassName="active-link">
            <i className="icon-inventory"></i> Inventory
            </NavLink>
            <NavLink to="/machines" activeClassName="active-link">
            <i className="icon-machines"></i> Machines
            </NavLink>
            <NavLink to="/customers" activeClassName="active-link">
            <i className="icon-customers"></i> Customers
            </NavLink>
            <NavLink to="/settings" activeClassName="active-link">
            <i className="icon-settings"></i> Settings
            </NavLink>
        </nav>
        <div className="navbar-footer">
            <NavLink to="/help" activeClassName="active-link">
            <i className="icon-help"></i> Help & Support
            </NavLink>
        </div>
        </div>
    );
};

export default Navbar;
