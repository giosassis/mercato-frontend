import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getTotalSalesPerDay } from "../services/api";
import DashboardActions from "../components/DashboardActions";
import Header from "../components/Header";
import "../style/Dashboard.css";

const DashboardPage = () => {
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        getTotalSalesPerDay()
            .then((data) => {
                const total = data.reduce((acc, sale) => acc + sale.total_sales, 0);
                setTotalSales(total);
            })
            .catch((error) => console.error("Erro ao buscar vendas diárias:", error));
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    <DashboardActions />
                    <p>Bem-vindo ao painel do Mercato!</p>
                    <div className="mt-4">
                        <h4>Vendas de Hoje</h4>
                        <p>{`R$ ${totalSales.toFixed(2)}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;