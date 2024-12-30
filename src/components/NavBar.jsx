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
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src={require("../styles/assets/dashboard.png")} className="nav-icon" height={20}/>
          Dashboard
        </NavLink>
        <NavLink 
          to="/orders" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src={require("../styles/assets/orders.png")} className="nav-icon" height={20}/>
          Orders
        </NavLink>
        <NavLink 
          to="/inventory" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src={require("../styles/assets/inventories.png")} className="nav-icon" height={20}/>
          Inventory
        </NavLink>
        <NavLink 
          to="/machines" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src={require("../styles/assets/settings.png")} className="nav-icon" height={20}/>
          Machines
        </NavLink>
        <NavLink 
          to="/customers" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src={require("../styles/assets/customers.png")} className="nav-icon" height={20}/>
          Customers
        </NavLink>
      </nav>
      <div className="navbar-footer">
        <NavLink 
          to="/help" 
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          <img src="/icons/help.png" className="nav-icon" />
          Help & Support
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
