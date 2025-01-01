import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/CustomerPieChart.css";

const CustomerPieChart = ({ customers, transactions }) => {
    const chartRef = useRef();

    useEffect(() => {
        const engagement = {
            "At least 1 order": 0,
            "At least 5 orders": 0,
            "At least 10 orders": 0,
        };

        customers.forEach((customer) => {
            const orderCount = transactions.filter((t) => t.user_id === customer.id).length;
            if (orderCount >= 1) engagement["At least 1 order"]++;
            if (orderCount >= 5) engagement["At least 5 orders"]++;
            if (orderCount >= 10) engagement["At least 10 orders"]++;
        });
        
        const data = Object.entries(engagement).map(([key, value]) => ({
            label: key,
            value,
        }));

        const totalCustomers = customers.length;
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
            .attr("fill-opacity", 1)   
            .attr("stroke", "white")
            .style("stroke-width", "2px");
            ;


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
            .text(`Total: ${totalCustomers}`);

    }, [customers]);

    return (
        <div className="customer-pie-chart-container">
            <svg ref={chartRef}></svg>
            <div className="customer-pie-chart-legend">
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: d3.schemeCategory10[0] }}
                    ></span>
                    <p>At least 1 order</p>
                </div>
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: d3.schemeCategory10[1] }}
                    ></span>
                    <p>At least 5 orders</p>
                </div>
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: d3.schemeCategory10[2] }}
                    ></span>
                    <p>At least 10 orders</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerPieChart;
