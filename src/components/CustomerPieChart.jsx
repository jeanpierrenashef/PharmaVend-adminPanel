import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/CustomerPieChart.css";

const CustomerPieChart = ({ customers, transactions }) => {
    const chartRef = useRef();
    const totalCustomers = customers.length;
    useEffect(() => {
        const engagement = {
            "0 orders": 0,
            "1 to 5 orders": 0,
            "6 to 10 orders": 0,
            "10+ orders": 0,
        };

        customers.forEach((customer) => {
            const orderCount = transactions.filter((t) => t.user_id === customer.id).length;

            if (orderCount === 0) {
                engagement["0 orders"]++;
            } else if (orderCount >= 1 && orderCount <= 5) {
                engagement["1 to 5 orders"]++;
            } else if (orderCount >= 6 && orderCount <= 10) {
                engagement["6 to 10 orders"]++;
            } else if (orderCount > 10) {
                engagement["10+ orders"]++;
            }
        });

        const data = Object.entries(engagement).map(([key, value]) => ({
            label: key,
            value,
        }));

        
        const width = 260;
        const height = 260;
        const radius = Math.min(width, height) / 2;

        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value((d) => d.value)(data);

        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        svg.selectAll("path")
            .data(pie)
            .join("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        svg.selectAll("text")
            .data(pie)
            .join("text")
            .text((d) => `${Math.round((d.data.value / totalCustomers) * 100)}%`)
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white");

        svg.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", "19px")
            .style("font-weight", "bold")
    }, [customers, transactions, totalCustomers],);

    return (
        <div className="customer-pie-chart-container">
            <h3>Total Customers: {totalCustomers}</h3>
            <svg ref={chartRef}></svg>
            <div className="customer-pie-chart-legend">
                {["0 orders", "1 to 5 orders", "6 to 10 orders", "10+ orders"].map(
                    (label, index) => (
                        <div className="customer-legend-item" key={index}>
                            <span
                                className="customer-legend-box"
                                style={{
                                    backgroundColor: d3.schemeCategory10[index],
                                }}
                            ></span>
                            <p>{label}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CustomerPieChart;
