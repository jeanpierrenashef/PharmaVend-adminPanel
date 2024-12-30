import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/DonutChart.css";

const DonutChart = ({ transactions }) => {
    const chartRef = useRef();

    useEffect(() => {
        const data = transactions.reduce(
        (acc, transaction) => {
            const key = transaction.dispensed ? "Dispensed" : "Not Dispensed";
            acc[key] += parseFloat(transaction.total_price);
            return acc;
        },
        { Dispensed: 0, "Not Dispensed": 0 }
        );

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
        .domain(Object.keys(data))
        .range(["#408751", "#595959"]);

        const pie = d3
        .pie()
        .value((d) => d[1])(Object.entries(data));

        const arc = d3
        .arc()
        .innerRadius(radius - 40) 
        .outerRadius(radius);

        svg
        .selectAll("path")
        .data(pie)
        .join("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data[0]))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

        svg
        .selectAll("text")
        .data(pie)
        .join("text")
        .text((d) => `${Math.round((d.data[1] / d3.sum(Object.values(data))) * 100)}%`)
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "white");
    }, [transactions]);

    return (
        <div className="donut-chart-container">
        <svg ref={chartRef}></svg>
        <div className="donut-chart-legend">
            <div className="legend-item">
            <span
                className="legend-box"
                style={{ backgroundColor: "#408751" }}
            ></span>
            <span className="legend-text">Dispensed</span>
            </div>
            <div className="legend-item">
            <span
                className="legend-box"
                style={{ backgroundColor: "#595959" }}
            ></span>
            <span className="legend-text">Not Dispensed</span>
            </div>
        </div>
        </div>
    );
};

export default DonutChart;
