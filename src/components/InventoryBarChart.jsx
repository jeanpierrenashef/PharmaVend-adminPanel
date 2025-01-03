import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/InventoryBarChart.css";

const InventoryBarChart = ({ machines, transactions }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (!machines.length || !transactions.length) return;

        const machineSales = machines.map((machine) => {
            const totalSales = transactions
                .filter((transaction) => transaction.machine_id === machine.id)
                .reduce((acc, transaction) => acc + transaction.quantity, 0);

            return { ...machine, totalSales };
        });

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 550 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3
            .select(chartRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleBand()
            .domain(machineSales.map((d) => d.name || `Machine ${d.id}`))
            .range([0, width])
            .padding(0.2);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(machineSales, (d) => d.totalSales)])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-40,${height / 2}) rotate(-90)`)
            .text("Total # of sales")
            .style("font-size", "12px")
            .style("fill", "#494949");

        svg.selectAll(".bar")
            .data(machineSales)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`))
            .attr("y", (d) => yScale(d.totalSales))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.totalSales))
            .attr("fill", "#408751");

        svg.selectAll(".bar-label")
            .data(machineSales)
            .join("text")
            .attr("class", "bar-label")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.totalSales) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d.totalSales);

    }, [machines, transactions]);

    return <svg ref={chartRef} />;
};

export default InventoryBarChart;
