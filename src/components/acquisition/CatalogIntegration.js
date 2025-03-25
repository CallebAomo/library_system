// src/components/acquisition/CatalogIntegration.js
import React, { useState } from 'react';

const CatalogIntegration = () => {
    const [catalog, setCatalog] = useState(["Book X", "Book Y"]);

    const addToCatalog = () => {
        setCatalog([...catalog, `Book ${catalog.length + 1}`]);
    };

    return (
        <div>
            <h2>Catalog Integration</h2>
            <button onClick={addToCatalog}>Add Book to Catalog</button>
            <ul>
                {catalog.map((book, index) => (
                    <li key={index}>{book}</li>
                ))}
            </ul>
        </div>
    );
};

export default CatalogIntegration;
