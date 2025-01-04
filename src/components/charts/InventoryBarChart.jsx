import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../../styles/InventoryBarChart.css";

const InventoryBarChart = ({ machines, transactions, products }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (!machines.length || !transactions.length || !products.length) return;

        const machineSales = machines.map((machine) => {
            const totalSales = transactions
                .filter((transaction) => transaction.machine_id === machine.id)
                .reduce((acc, transaction) => acc + transaction.quantity, 0);

            const totalRevenue = transactions
                .filter((transaction) => transaction.machine_id === machine.id)
                .reduce((acc, transaction) => {
                    const product = products.find((p) => p.id === transaction.product_id);
                    return acc + (product ? product.price * transaction.quantity : 0);
                }, 0);

            return { ...machine, totalSales, totalRevenue };
        });

        const margin = { top: 20, right: 60, bottom: 50, left: 50 };
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

        const yScaleLeft = d3
            .scaleLinear()
            .domain([0, d3.max(machineSales, (d) => d.totalSales)])
            .range([height, 0]);

        const yScaleRight = d3
            .scaleLinear()
            .domain([0, d3.max(machineSales, (d) => d.totalRevenue)])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(yScaleLeft))
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-40,${height / 2}) rotate(-90)`)
            .text("Total # of Items Sold")
            .style("font-size", "12px")
            .style("fill", "#494949");

        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(yScaleRight))
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(40,${height / 2}) rotate(-90)`)
            .text("Total Revenue ($)")
            .style("font-size", "12px")
            .style("fill", "#494949");

        svg.selectAll(".bar-total-sales")
            .data(machineSales)
            .join("rect")
            .attr("class", "bar-total-sales")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`))
            .attr("y", (d) => yScaleLeft(d.totalSales))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", (d) => height - yScaleLeft(d.totalSales))
            .attr("fill", "#408751");

        svg.selectAll(".bar-total-revenue")
            .data(machineSales)
            .join("rect")
            .attr("class", "bar-total-revenue")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScaleRight(d.totalRevenue))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", (d) => height - yScaleRight(d.totalRevenue))
            .attr("fill", "#595959");

        svg.selectAll(".bar-label-sales")
            .data(machineSales)
            .join("text")
            .attr("class", "bar-label-sales")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`) + xScale.bandwidth() / 4)
            .attr("y", (d) => yScaleLeft(d.totalSales) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text((d) => d.totalSales);

            svg.selectAll(".bar-label-revenue")
            .data(machineSales)
            .join("text")
            .attr("class", "bar-label-revenue")
            .attr("x", (d) => xScale(d.name || `Machine ${d.id}`) + (3 * xScale.bandwidth()) / 4)
            .attr("y", (d) => yScaleRight(d.totalRevenue) - 5)
            .attr("transform", (d) => {
                const x = xScale(d.name || `Machine ${d.id}`) + (3 * xScale.bandwidth()) / 4 -15 ;
                const y = yScaleRight(d.totalRevenue) - 40;
                return `rotate(-35, ${x}, ${y})`; 
            })
            .attr("text-anchor", "end") 
            .style("font-size", "10px")
            .text((d) => `$${d.totalRevenue.toFixed(2)}`);
        
    }, [machines, transactions, products]);

    return <svg ref={chartRef} />;
};

export default InventoryBarChart;
