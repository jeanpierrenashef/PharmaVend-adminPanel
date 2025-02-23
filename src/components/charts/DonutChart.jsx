import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../../styles/DonutChart.css";

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

        const totalPrice = Object.values(data).reduce((a, b) => a + b, 0);

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
        .domain(Object.keys(data))
        .range(["#20B573", "#595959"]);

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
        .text((d) => `${Math.round((d.data[1] / totalPrice) * 100)}%`)
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "white");

        svg
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "19px")
        .style("font-weight", "bold")
        .text(`$${totalPrice.toFixed(2)}`);

        svg
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#666")
        .attr("y", "18") 
        .text("Total Orders");
    }, [transactions]);
    

    const data = transactions.reduce(
        (acc, transaction) => {
        const key = transaction.dispensed ? "Dispensed" : "Not Dispensed";
        acc[key] += parseFloat(transaction.total_price);
        return acc;
        },
        { Dispensed: 0, "Not Dispensed": 0 }
    );

    return (
        <div className="donut-chart-container">
            <svg ref={chartRef}></svg>
            <div className="donut-chart-legend">
                <div className="donut-legend-item">
                    <span
                        className="donut-legend-box"
                        style={{ backgroundColor: "#408751" }}
                    ></span>
                    <div className="donut-legend-text-group">
                        <span className="donut-legend-text">${data.Dispensed.toFixed(2)}</span>
                        <p className="donut-legend-label">Dispensed</p>
                    </div>

                </div>
                <div className="donut-legend-item">
                    <span
                        className="donut-legend-box"
                        style={{ backgroundColor: "#595959" }}
                    ></span>
                    <div className="donut-legend-text-group">
                        <span className="donut-legend-text">${data["Not Dispensed"].toFixed(2)}</span>
                        <p className="donut-legend-label">Pending</p>
                    </div>

                </div>
            </div>
        </div>
    );
    
};

export default DonutChart;
