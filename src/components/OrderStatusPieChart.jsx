import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/OrderStatusPieChart.css";

const OrderStatusPieChart = ({ orderStatusData }) => {
    const chartRef = useRef();

    useEffect(() => {
        const totalQuantity = Object.values(orderStatusData).reduce((a, b) => a + b, 0);

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
            .innerRadius(0) // Full pie chart, no inner radius
            .outerRadius(radius);

        // Draw pie chart
        svg
            .selectAll("path")
            .data(pie)
            .join("path")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data.status))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // Add percentage labels
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
