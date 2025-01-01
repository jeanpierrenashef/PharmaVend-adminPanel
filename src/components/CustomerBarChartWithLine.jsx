import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/CustomerBarChartWithLine.css";

const CustomerBarChartWithLine = ({ customers }) => {
    const chartRef = useRef();

    useEffect(() => {
        const customersByDay = d3.rollup(
            customers,
            (v) => v.length,
            (d) => d3.timeDay(new Date(d.created_at))
        );

        const minDate = d3.timeDay.offset(new Date(), -20); 

        const maxDate = d3.max(customers, (d) => new Date(d.created_at));
        const allDates = d3.timeDays(minDate, d3.timeDay.offset(maxDate, 1));

        let cumulativeCount = 0;
        const data = allDates.map((date) => {
            const count = customersByDay.get(date) || 0;
            cumulativeCount += count; 
            return {
                date,
                count,
                cumulativeCount,
            };
        });

        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        const width = 550 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3
            .select(chartRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.date))
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count+2)])
            .range([height, 0]);

        const yScaleCumulative = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.cumulativeCount)]) 
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(
                d3.axisBottom(xScale)
                    .tickValues(allDates) 
                    .tickFormat(d3.timeFormat("%d %b"))
            )
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(yScale));

        svg.append("g")
            .attr("transform", `translate(${width},0)`) 
            .call(d3.axisRight(yScaleCumulative))
            .selectAll("text")

        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("fill", "#408751")
            .attr("x", (d) => xScale(d.date))
            .attr("y", (d) => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.count))

        const line = d3
            .line()
            .x((d) => xScale(d.date) + xScale.bandwidth() / 2)
            .y((d) => yScaleCumulative(d.cumulativeCount))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#2b788a")
            .attr("stroke-width", 2)
            .attr("d", line);
            
    }, [customers]);

    return <svg ref={chartRef} />;
};

export default CustomerBarChartWithLine;
