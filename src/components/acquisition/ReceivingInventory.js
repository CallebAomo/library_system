// src/components/acquisition/ReceivingInventory.js
import React, { useState } from 'react';

const ReceivingInventory = () => {
    const [inventory, setInventory] = useState(["Book A", "Book B"]);

    const receiveItem = () => {
        setInventory([...inventory, `Book ${inventory.length + 1}`]);
    };

    return (
        <div>
            <h2>Receiving & Inventory</h2>
            <button onClick={receiveItem}>Receive New Book</button>
            <ul>
                {inventory.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ReceivingInventory;
