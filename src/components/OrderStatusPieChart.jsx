import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/OrderStatusPieChart.css";

const OrderStatusPieChart = ({ transactions = [] }) => {
    const chartRef = useRef();
    const validTransactions = Array.isArray(transactions) ? transactions : [];

    const orderStatusData = validTransactions.reduce(
        (acc, transaction) => {
            const key = transaction.dispensed === 1 ? "Dispensed" : "Not Dispensed"; 
            acc[key] += 1; 
            return acc;
        },
        { Dispensed: 0, "Not Dispensed": 0 }
    );

    useEffect(() => {
        const totalQuantity = Object.values(orderStatusData).reduce((a, b) => a + b, 0);

        if (totalQuantity === 0) return;

        const chartData = Object.entries(orderStatusData).map(([key, value]) => ({
            status: key,
            value,
        }));

        d3.select(chartRef.current).selectAll("*").remove();

        const width = 260;
        const height = 260;
        const radius = Math.min(width, height) / 2;

        const svg = d3
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3
            .scaleOrdinal()
            .domain(chartData.map((d) => d.status))
            .range(["#408751", "#595959"]);

        const pie = d3
            .pie()
            .value((d) => d.value)(chartData);

        const arc = d3
            .arc()
            .innerRadius(0) 
            .outerRadius(radius);

        svg
            .selectAll("path")
            .data(pie)
            .join("path")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data.status))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        svg
            .selectAll("text")
            .data(pie)
            .join("text")
            .text((d) => `${((d.data.value / totalQuantity) * 100).toFixed(1)}%`)
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white");
    }, [orderStatusData]);

    const totalQuantity = Object.values(orderStatusData).reduce((a, b) => a + b, 0);

    if (totalQuantity === 0) {
        return <p className="no-data-message">No order data available to display.</p>;
    }

    return (
        <div className="pie-chart-container">
            <svg ref={chartRef}></svg>
            <div className="pie-chart-legend">
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: "#408751" }}
                    ></span>
                    <div className="legend-text-group">
                        <span className="legend-text">{orderStatusData.Dispensed}</span>
                        <p className="legend-label">Dispensed</p>
                    </div>
                </div>
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: "#595959" }}
                    ></span>
                    <div className="legend-text-group">
                        <span className="legend-text">{orderStatusData["Not Dispensed"]}</span>
                        <p className="legend-label">Not Dispensed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusPieChart;
