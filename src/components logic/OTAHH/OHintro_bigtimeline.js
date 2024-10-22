import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../../components css/OHintro_bigtimeline.css';

const OhIntroTimeline = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    // Clear the SVG if it already exists
    d3.select(timelineRef.current).select('svg').remove();

    // Set up the SVG canvas dimensions
    const width = 1350;
    const height = 400; // Increased height to accommodate labels above and below
    const margin = { top: 20, right: 30, bottom: 20, left: 50 };

    // Create an SVG element
    const svg = d3
      .select(timelineRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Define the clipPath, but it will only be used conditionally

    // Create a group to contain the timeline elements
    const chartGroup = svg.append('g')
      .attr('clip-path', 'url(#clip)');

    // Define a linear scale for the timeline (to represent large timespans)
    const xScale = d3
      .scaleLinear()
      .domain([-13.8e9, 2025]) // Domain spans from the Big Bang (-13.8 billion years) to 2025
      .range([0, width]); // Full width of the timeline

    // Add a bottom axis with no ticks (removed using .ticks(0))
    const xAxis = d3.axisBottom(xScale).ticks(0); // No ticks

    const xAxisGroup = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 2})`) // Center the timeline
      .call(xAxis);

    // Mock dataset with yPosition for each event
    const events = [
      {
        name: 'Big Bang',
        year: -13.8e9,
        label: '13,800,000,000 BCE',
        yPosition: 100, // Lower means farther down on the screen
      },
      {
        name: 'Formation of the Earth',
        year: -4.5e9,
        label: '4,500,000,000 BCE',
        yPosition: 90,
      },
      {
        name: 'First life on Earth',
        year: -3.8e9,
        label: '3,800,000,000 BCE',
        yPosition: 80,
      },
      {
        name: 'Cambrian Explosion',
        year: -541e6,
        label: '541,000,000 BCE',
        yPosition: 70,
      },
      {
        name: 'First humans (Homo sapiens)',
        year: -300e3,
        label: '300,000 BCE',
        yPosition: 0, // Aligns with the x-axis
      },
      {
        name: 'Agricultural revolution',
        year: -8000,
        label: '8000 BCE',
        yPosition: -40, // Above the x-axis
      },
      {
        name: 'Industrial revolution',
        year: 1760,
        label: '1760 CE',
        yPosition: -60,
      },
      {
        name: 'Modern era',
        year: 2025,
        label: '2025 CE',
        yPosition: -80, // Higher up on the screen
      },
    ];

    // Render the timeline elements (circles, lines, and labels)
    const renderTimeline = (scale) => {
      // Clear previous elements
      chartGroup.selectAll('line').remove();
      chartGroup.selectAll('circle').remove();
      chartGroup.selectAll('text').remove();

      // Check if the x position of the line is within the timeline
      const isWithinTimeline = (xPos) => xPos >= 0 && xPos <= width;

      // Render vertical lines connecting the x-axis to the circles
      chartGroup
        .selectAll('line')
        .data(events)
        .enter()
        .append('line')
        .attr('x1', (d) => scale(d.year))
        .attr('x2', (d) => scale(d.year))
        .attr('y1', height / 2)
        .attr('y2', (d) => height / 2 + d.yPosition)
        .attr('stroke', (d) => isWithinTimeline(scale(d.year)) ? 'gray' : 'none') // Clip line if outside
        .attr('stroke-width', 1);

      // Render each event as a circle on the timeline (render based on line position)
      chartGroup
  .selectAll('circle')
  .data(events)
  .enter()
  .append('circle')
  .attr('cx', (d) => scale(d.year))
  .attr('cy', (d) => height / 2 + d.yPosition)
  .attr('r', (d) => isWithinTimeline(scale(d.year)) ? 5 : 0)  // If outside, set radius to 0
  .style('opacity', (d) => isWithinTimeline(scale(d.year)) ? 1 : 0)  // Make it fully invisible when outside
  .attr('fill', 'steelblue');  // Keep fill color as 'steelblue' for visible circles


      // Render event labels and names (render based on line position)
      chartGroup
        .selectAll('text')
        .data(events)
        .enter()
        .append('text')
        .attr('x', (d) => scale(d.year))
        .attr('y', (d) => height / 2 + d.yPosition - 10)
        .attr('text-anchor', 'middle')
        .text((d) => isWithinTimeline(scale(d.year)) ? `${d.name}: ${d.label}` : '') // Clip label if line is outside
        .style('font-size', '12px')
        .style('fill', 'black');
    };

    // Initial render with original xScale
    renderTimeline(xScale);

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 500000]) // Set the zoom limits
      .translateExtent([[0, height], [width, 0]]) // Restrict vertical panning
      .on('zoom', (event) => {
        const transform = event.transform;
        console.log('Zooming: ', transform);

        // Update xScale based on zoom transform
        const newXScale = transform.rescaleX(xScale);

        // Update x-axis
        xAxisGroup.call(d3.axisBottom(newXScale).ticks(0)); // Keep no ticks

        // Re-render the timeline with the updated scale
        renderTimeline(newXScale);
      });

    // Apply zoom behavior to the SVG
    svg.call(zoom);

  }, []);

  return <div ref={timelineRef}></div>;
};

export default OhIntroTimeline;
