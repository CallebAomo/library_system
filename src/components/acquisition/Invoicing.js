// src/components/acquisition/Invoicing.js
import React, { useState } from 'react';

const Invoicing = () => {
    const [invoices, setInvoices] = useState([]);

    const generateInvoice = () => {
        setInvoices([...invoices, `Invoice #${invoices.length + 1}`]);
    };

    return (
        <div>
            <h2>Invoicing</h2>
            <button onClick={generateInvoice}>Generate Invoice</button>
            <ul>
                {invoices.map((invoice, index) => (
                    <li key={index}>{invoice}</li>
                ))}
            </ul>
        </div>
    );
};

export default Invoicing;
