import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../style/Dashboard.css";

const Header = () => {
  return (
    <Navbar className="header-navbar" expand="lg"> {/* Remova fixed-top */}
      <Container className="d-flex justify-content-between align-items-center">
        <h4 className="header-title">Dashboard</h4>
        <FaUserCircle size={24} className="user-icon" />
      </Container>
    </Navbar>
  );
};

export default Header;