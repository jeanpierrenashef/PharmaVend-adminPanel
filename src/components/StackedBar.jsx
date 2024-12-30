import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/StackedBar.css";

const StackedBarChart = ({ transactions }) => {
  const chartRef = useRef();

  // Calculate the data once before rendering
  const data = transactions.reduce(
    (acc, transaction) => {
      const key = transaction.dispensed ? "Dispensed" : "Not Dispensed";
      acc[key] += transaction.quantity;
      return acc;
    },
    { Dispensed: 0, "Not Dispensed": 0 }
  );

  const totalQuantity = data.Dispensed + data["Not Dispensed"];
  const chartData = [
    { status: "Dispensed", value: data.Dispensed },
    { status: "Not Dispensed", value: data["Not Dispensed"] },
  ];

  useEffect(() => {
    const width = 400;
    const height = 40;

    d3.select(chartRef.current).selectAll("*").remove();
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
      .attr("x", (d) => xScale(cumulative))
      .attr("y", 0)
      .attr("width", (d) => xScale(d.value))
      .attr("height", height)
      .attr("fill", (d) => color(d.status))
      .each((d) => (cumulative += d.value));

    svg
      .selectAll("text")
      .data(chartData)
      .join("text")
      .attr("x", (d, i) =>
        xScale(d.value / 2 + (i > 0 ? chartData[i - 1].value : 0))
      )
      .attr("y", height / 2)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .text((d) => `${d.status} ${((d.value / totalQuantity) * 100).toFixed(1)}%`);
  }, [transactions, chartData, totalQuantity]);

  return (
    <div className="stacked-bar-chart-container">
      <svg ref={chartRef}></svg>
      <div className="stacked-bar-chart-legend">
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: "#408751" }}></span>
          <div className="legend-text-group">
            <span className="legend-text">{data.Dispensed}</span>
            <p className="legend-label">Dispensed</p>
          </div>
        </div>
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: "#595959" }}></span>
          <div className="legend-text-group">
            <span className="legend-text">{data["Not Dispensed"]}</span>
            <p className="legend-label">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedBarChart;
