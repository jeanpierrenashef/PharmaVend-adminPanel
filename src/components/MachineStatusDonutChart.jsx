import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/DonutChart.css";

const MachineStatusDonutChart = ({ machineStatusData }) => {
    const chartRef = useRef();

    useEffect(() => {
        const totalMachines = Object.values(machineStatusData).reduce((a, b) => a + b, 0);
        const chartData = Object.entries(machineStatusData);

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

        const color = d3
            .scaleOrdinal()
            .domain(chartData.map(([key]) => key))
            .range(["#408751", "#d9534f"]);

        const pie = d3
            .pie()
            .value((d) => d[1])(chartData);

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
            .text((d) => `${((d.data[1] / totalMachines) * 100).toFixed(1)}%`)
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white");

        svg
            .append("text")
            .attr("text-anchor", "middle")
            .style("font-size", "19px")
            .style("font-weight", "bold")
            .text(`${totalMachines} Machines`);

        svg
            .append("text")
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#666")
            .attr("y", "18")
            .text("Total");
    }, [machineStatusData]);

    return (
        <div className="donut-chart-container">
            <svg ref={chartRef}></svg>
            <div className="donut-chart-legend">
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: "#408751" }}
                    ></span>
                    <div className="legend-text-group">
                        <span className="legend-text">{machineStatusData.Active} Active</span>
                        
                    </div>
                </div>
                <div className="legend-item">
                    <span
                        className="legend-box"
                        style={{ backgroundColor: "#d9534f" }}
                    ></span>
                    <div className="legend-text-group">
                        <span className="legend-text">{machineStatusData.Inactive} Inactive</span>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineStatusDonutChart;
