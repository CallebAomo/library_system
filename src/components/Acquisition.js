import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { FaBook, FaUsers, FaMoneyBillAlt, FaClipboardCheck, FaFileInvoice, FaThLarge } from 'react-icons/fa';
import './acquisition.css';

// Import sub-modules
import VendorManagement from './acquisition/VendorManagement';
import BudgetControl from './acquisition/BudgetControl';
import ReceivingInventory from './acquisition/ReceivingInventory';
import Invoicing from './acquisition/Invoicing';
import CatalogIntegration from './acquisition/CatalogIntegration';
import OrderManagement from './acquisition/OrderManagement';

const Acquisition = () => {
    const navigate = useNavigate();  // Use useNavigate for navigation

    const subModules = [
        { name: 'Order Management', path: 'orders', icon: <FaClipboardCheck /> },
        { name: 'Vendor Management', path: 'vendors', icon: <FaUsers /> },
        { name: 'Budget Control', path: 'budgets', icon: <FaMoneyBillAlt /> },
        { name: 'Receiving and Inventory', path: 'receiving', icon: <FaBook /> },
        { name: 'Invoicing', path: 'invoicing', icon: <FaFileInvoice /> },
        { name: 'Catalog Integration', path: 'catalog', icon: <FaThLarge /> },
    ];

    return (
        <div className="acquisition-container">
            <h2 className="acquisition-title">Acquisition Sub-Modules</h2>

            {/* Sub-module navigation */}
            <ul className="acquisition-list">
                {subModules.map((subModule, index) => (
                    <li key={index} className="acquisition-item" onClick={() => navigate(`/acquisition/${subModule.path}`)}>
                        <span className="icon">{subModule.icon}</span>
                        <span className="module-name">{subModule.name}</span>
                    </li>
                ))}
            </ul>

            {/* Define Routes */}
            <Routes>
                <Route path="orders" element={<OrderManagement />} />
                <Route path="vendors" element={<VendorManagement />} />
                <Route path="budgets" element={<BudgetControl />} />
                <Route path="receiving" element={<ReceivingInventory />} />
                <Route path="invoicing" element={<Invoicing />} />
                <Route path="catalog" element={<CatalogIntegration />} />
            </Routes>
        </div>
    );
};

export default Acquisition;
