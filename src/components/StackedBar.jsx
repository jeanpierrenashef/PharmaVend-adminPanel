import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/StackedBar.css";

const StackedBarChart = ({ orderStatusData }) => {
    const chartRef = useRef();

    useEffect(() => {
        const totalQuantity = Object.values(orderStatusData).reduce((a, b) => a + b, 0);

        const chartData = Object.entries(orderStatusData).map(([key, value]) => ({
            status: key,
            value,
        }));

        d3.select(chartRef.current).selectAll("*").remove();

        const width = 400;
        const height = 30;

        const svg = d3
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height);

        const xScale = d3
            .scaleLinear()
            .domain([0, totalQuantity])
            .range([0, width]);

        const color = d3
            .scaleOrdinal()
            .domain(["Dispensed", "Not Dispensed"])
            .range(["#408751", "#595959"]);

        let cumulative = 0;
        svg
            .selectAll("rect")
            .data(chartData)
            .join("rect")
            .attr("x", (d) => {
                const xPos = xScale(cumulative);
                cumulative += d.value;
                return xPos;
            })
            .attr("y", 0)
            .attr("width", (d) => xScale(d.value))
            .attr("height", height)
            .attr("fill", (d) => color(d.status));

        cumulative = 0;

        svg
            .selectAll("text")
            .data(chartData)
            .join("text")
            .attr("x", (d) => {
                const xPos = xScale(cumulative + d.value / 2);
                cumulative += d.value;
                return xPos;
            })
            .attr("y", height / 2)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .text((d) => `${((d.value / totalQuantity) * 100).toFixed(1)}%`);
    }, [orderStatusData]);

    return (
        <div className="stacked-bar-chart-container">
            <svg ref={chartRef}></svg>
            <div className="stacked-bar-chart-legend">
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

export default StackedBarChart;
