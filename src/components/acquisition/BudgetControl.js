// src/components/acquisition/BudgetControl.js
import React, { useState } from 'react';

const BudgetControl = () => {
    const [budget, setBudget] = useState(10000);

    const allocateBudget = () => {
        setBudget(budget - 500);
    };

    return (
        <div>
            <h2>Budget Control</h2>
            <p>Current Budget: ${budget}</p>
            <button onClick={allocateBudget}>Allocate $500</button>
        </div>
    );
};

export default BudgetControl;
