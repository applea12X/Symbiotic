"use client";

import { useRef, useEffect } from "react";
import { SectionHeader } from "./shared/SectionHeader";
import { AdoptionCurve } from "@/types/findings";
import * as d3 from "d3";

interface AdoptionDynamicsProps {
  adoptionCurves: AdoptionCurve[];
}

export function AdoptionDynamics({ adoptionCurves }: AdoptionDynamicsProps) {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || adoptionCurves.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 140, bottom: 50, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by discipline
    const disciplineGroups = d3.group(adoptionCurves, (d) => d.discipline);
    const disciplines = Array.from(disciplineGroups.keys());

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([2016, 2024])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 80])
      .range([chartHeight, 0]);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(disciplines)
      .range(["#60a5fa", "#a78bfa", "#f472b6", "#fbbf24", "#34d399"]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-chartWidth)
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove());

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d.toString()).ticks(9))
      .attr("color", "rgba(255,255,255,0.4)")
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"));

    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat((d) => `${d}%`))
      .attr("color", "rgba(255,255,255,0.4)")
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"));

    // Axis labels
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "12px")
      .text("Year");

    g.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "12px")
      .text("ML Penetration (%)");

    // Line generator
    const line = d3
      .line<AdoptionCurve>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.penetration))
      .curve(d3.curveMonotoneX);

    // Draw lines for each discipline
    disciplineGroups.forEach((data, discipline) => {
      const sortedData = data.sort((a, b) => a.year - b.year);

      g.append("path")
        .datum(sortedData)
        .attr("fill", "none")
        .attr("stroke", colorScale(discipline))
        .attr("stroke-width", 2.5)
        .attr("stroke-opacity", 0.8)
        .attr("d", line);

      // Add points at inflection points (2019-2020)
      const inflectionPoint = sortedData.find((d) => d.year === 2020);
      if (inflectionPoint) {
        g.append("circle")
          .attr("cx", xScale(inflectionPoint.year))
          .attr("cy", yScale(inflectionPoint.penetration))
          .attr("r", 4)
          .attr("fill", colorScale(discipline))
          .attr("stroke", "rgba(0,0,0,0.3)")
          .attr("stroke-width", 2);
      }
    });

    // Legend
    const legend = g
      .append("g")
      .attr("transform", `translate(${chartWidth + 15}, 0)`);

    disciplines.forEach((discipline, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 24})`);

      legendRow
        .append("rect")
        .attr("width", 16)
        .attr("height", 3)
        .attr("fill", colorScale(discipline))
        .attr("rx", 1);

      legendRow
        .append("text")
        .attr("x", 22)
        .attr("y", 4)
        .attr("fill", "rgba(255,255,255,0.7)")
        .attr("font-size", "11px")
        .text(discipline);
    });
  }, [adoptionCurves]);

  return (
    <section className="mb-16">
      <SectionHeader
        subtitle="Section 3"
        title="Adoption Dynamics & Temporal Trends"
        description="S-curve adoption patterns showing how ML spread through scientific disciplines from 2016-2024. Circles mark inflection points."
      />

      <div className="glass rounded-2xl p-8">
        <svg ref={chartRef} className="w-full" />
      </div>

      <div className="mt-4 p-5 glass rounded-xl">
        <p className="text-sm text-white/60 leading-relaxed">
          <span className="font-semibold text-white/80">Key observation:</span>{" "}
          Most disciplines entered plateau phase (2023-2024), suggesting ML
          integration is becoming standard practice rather than a differentiating
          factor. Drug Discovery and Materials Science show earliest adoption with
          inflection around 2019.
        </p>
      </div>
    </section>
  );
}
