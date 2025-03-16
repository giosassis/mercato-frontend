import React from "react";
import { Nav } from "react-bootstrap";
import { FaTachometerAlt, FaShoppingCart, FaHistory, FaChartBar } from "react-icons/fa";
import "../style/Dashboard.css";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: "250px", height: "100vh" }}>
      <Nav className="flex-column">
        <Nav.Link href="/dashboard" className="text-body d-flex align-items-center sidebar-item">
          <FaTachometerAlt className="me-2 text-body" /> Dashboard
        </Nav.Link>
        <Nav.Link href="/checkout" className="text-body d-flex align-items-center sidebar-item">
          <FaShoppingCart className="me-2 text-body" /> Checkout
        </Nav.Link>
        <Nav.Link href="/transactions" className="text-body d-flex align-items-center sidebar-item">
          <FaHistory className="me-2 text-body" /> Transactions
        </Nav.Link>
        <Nav.Link href="/analytics" className="text-body d-flex align-items-center sidebar-item">
          <FaChartBar className="me-2 text-body" /> Analytics
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;