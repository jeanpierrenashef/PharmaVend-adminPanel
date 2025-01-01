import React from "react";

const Customers = () => {
    const customers = useSelector((state) => state.users.list);
    const transactions = useSelector((state) => state.transactions.list);

    return (
        <div className="customers-page">
            <Navbar />
            <div className="main-content">
                <h1>Customers</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total Orders</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customersWithOrderCount.map((customer) => (
                            <CustomerRow key={customer.id} customer={customer} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Customers;