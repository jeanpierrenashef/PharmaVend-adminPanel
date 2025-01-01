import React from "react";
import "../styles/TopProducts.css"

const TopProducts = ({ machineId, products, transactions }) => {
    if (!machineId || !products.length || !transactions.length) {
        return <p>Loading...</p>;
    }

    const productSales = products.map((product) => {
        const totalSold = transactions
            .filter(
                (transaction) =>
                    transaction.machine_id === machineId &&
                    transaction.product_id === product.id
            )
            .reduce((acc, transaction) => acc + transaction.quantity, 0);

        return { ...product, totalSold };
    });

    const topProducts = productSales
        .filter((product) => product.totalSold > 0)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 3);

    return (
        <ul className="top-products-list">
            {topProducts.length > 0 ? (
                topProducts.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong>: {product.totalSold} sold
                    </li>
                ))
            ) : (
                <p>No sales data available for this machine.</p>
            )}
        </ul>
    );
};

export default TopProducts;
