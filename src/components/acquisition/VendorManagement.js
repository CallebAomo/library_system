// src/components/acquisition/VendorManagement.js
import React, { useState } from 'react';

const VendorManagement = () => {
    const [vendors, setVendors] = useState(["Vendor A", "Vendor B"]);

    const addVendor = () => {
        setVendors([...vendors, `Vendor ${vendors.length + 1}`]);
    };

    return (
        <div>
            <h2>Vendor Management</h2>
            <button onClick={addVendor}>Add Vendor</button>
            <ul>
                {vendors.map((vendor, index) => (
                    <li key={index}>{vendor}</li>
                ))}
            </ul>
        </div>
    );
};

export default VendorManagement;
