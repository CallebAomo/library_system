// src/components/acquisition/OrderManagement.js
import React, { useState } from 'react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    const placeOrder = () => {
        setOrders([...orders, `Order #${orders.length + 1}`]);
    };

    return (
        <div>
            <h2>Order Management</h2>
            <button onClick={placeOrder}>Place Order</button>
            <ul>
                {orders.map((order, index) => (
                    <li key={index}>{order}</li>
                ))}
            </ul>
        </div>
    );
};

export default OrderManagement;
