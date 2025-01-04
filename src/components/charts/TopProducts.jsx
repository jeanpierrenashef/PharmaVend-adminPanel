import React from "react";
import "../../styles/TopProducts.css";

const TopProducts = ({ machineId, products, transactions }) => {
    if (!products.length || !transactions.length) {
        return <p>Loading...</p>;
    }

    
    const productSales = products.map((product) => {
        const totalSold = transactions
            .filter(
                (transaction) =>
                    (!machineId || transaction.machine_id === machineId) && 
                    transaction.product_id === product.id
            )
            .reduce((acc, transaction) => acc + transaction.quantity, 0);

        return { ...product, totalSold };
    });

    const topProducts = productSales
        .filter((product) => product.totalSold > 0)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

    return (
        <ul className="top-products-list">
            {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                    <li key={product.id} className={`rank-${index + 1}`}>
                        <div className="product-row">
                            <span className="product-name">
                                {index + 1}. {product.name}
                            </span>
                            <span className="product-sales">
                                {product.totalSold} sold
                            </span>
                        </div>
                    </li>
                ))
            ) : (
                <p>No sales data available{machineId ? " for this machine" : ""}.</p>
            )}
        </ul>
    );
};

export default TopProducts;
