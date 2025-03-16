import React from "react";
import { Button } from "react-bootstrap";
import { FaShoppingCart, FaHistory, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardActions = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 header-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="d-flex gap-3">
        <Button variant="primary" onClick={() => navigate("/checkout")}>
          <FaShoppingCart className="me-2" /> New Sale
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate("/transactions")}>
          <FaHistory className="me-2" /> Transactions
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate("/analytics")}>
          <FaChartBar className="me-2" /> Analytics
        </Button>
      </div>
    </div>
  );
};

export default DashboardActions;