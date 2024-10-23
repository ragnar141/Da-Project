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
    

    // Create an SVG element
    const svg = d3
      .select(timelineRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'svgtimeline');

    // Define a linear scale for the timeline (to represent large timespans)
    const xScale = d3
      .scaleLinear()
      .domain([-13.8e9, 2025]) // Domain spans from the Big Bang (-13.8 billion years) to 2025
      .range([0, width]); // Full width of the timeline

    // Add a bottom axis with 3 ticks (using .ticks(3))
    const xAxis = d3.axisBottom(xScale).ticks(0); // Ensure 3 ticks are rendered

    // 1. Render the x-axis (timeline) first
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 2})`) // Center the timeline
      .call(xAxis);

    // 2. Create a group to contain the circles, lines, and labels
    const chartGroup = svg.append('g');

    const events = [
        {
          name: 'Big Bang',
          year: -13.8e9,
          label: '13,800,000,000 BCE',
          yPosition: 0, // Lower means farther down on the screen
        },
        {
          name: 'Formation of the Earth',
          year: -4.5e9,
          label: '4,500,000,000 BCE',
          yPosition: 180,
        },
        {
          name: 'First life (bacteria)',
          year: -3.8e9,
          label: '3,800,000,000 BCE',
          yPosition: 320,
        },
        {
          name: 'Great Oxidation Event',
          year: -2.4e9,
          label: '2,400,000,000 BCE',
          yPosition: 400,
        },
        {
          name: 'Multicellular organisms',
          year: -1.5e9,
          label: '1,500,000,000 BCE',
          yPosition: 367,
        },
        {
          name: 'Cambrian Explosion',
          year: -541e6,
          label: '541,000,000 BCE',
          yPosition: 335,
        },
        {
          name: 'Colonization of land by plants',
          year: -470e6,
          label: '470,000,000 BCE',
          yPosition: 292,
        },
        {
          name: 'First land animals',
          year: -430e6,
          label: '430,000,000 BCE',
          yPosition: 247,
        },
        {
          name: 'Permian-Triassic Extinction',
          year: -252e6,
          label: '252,000,000 BCE',
          yPosition: 200,
        },
        {
          name: 'Dinosaurs',
          year: -230e6,
          label: '230,000,000 BCE',
          yPosition: 160,
        },
        {
          name: 'Primates',
          year: -55e6,
          label: '55,000,000 BCE',
          yPosition: 120,
        },
        {
          name: 'Walking on two legs',
          year: -7e6,
          label: '7,000,000 BCE',
          yPosition: 80, // Same as above, as it represents the same event
        },
        {
          name: 'Learning to cook',
          year: -500e3,
          label: '500,000 BCE',
          yPosition: 40,
        },
        {
          name: 'First humans (Homo sapiens)',
          year: -300e3,
          label: '300,000 BCE',
          yPosition: 0, // Aligns with the x-axis
        },
        {
          name: 'First symbolic behavior',
          year: -100e3,
          label: '100,000 BCE',
          yPosition: -40,
        },
        {
          name: 'First art',
          year: -75e3,
          label: '75,000 BCE',
          yPosition: -80,
        },
        {
          name: 'Agricultural revolution and First Cities',
          year: -8000,
          label: '8000 BCE',
          yPosition: -120,
        },
        {
          name: 'Industrial revolution',
          year: 1760,
          label: '1760 CE - 1840 CE',
          yPosition: -165,
        },
        {
          name: 'Today',
          year: 2025,
          label: '2025 CE',
          yPosition: -205, // Higher up on the screen
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
        .attr('fill', 'white')  // Keep fill color as 'steelblue' for visible circles
        .attr('class', 'bigtimelinecircle');  // Apply the new CSS class to the circles

      // Render event names to the left of each circle
      chartGroup
        .selectAll('text.name-label')
        .data(events)
        .enter()
        .append('text')
        .attr('class', 'name-label')
        .attr('x', (d) => scale(d.year) - 10) // Render name to the left of the circle
        .attr('y', (d) => height / 2 + d.yPosition - 5)
        .attr('text-anchor', 'end') // Anchor text to the end (left-aligned)
        .text((d) => isWithinTimeline(scale(d.year)) ? d.name : '') // Clip name if outside timeline
        .style('font-size', '13.5px')
        .style('fill', 'black');

      // Render event labels below the name to the left of the circle
      chartGroup
        .selectAll('text.event-label')
        .data(events)
        .enter()
        .append('text')
        .attr('class', 'event-label')
        .attr('x', (d) => scale(d.year) - 10) // Render label to the left of the circle
        .attr('y', (d) => height / 2 + d.yPosition + 10)
        .attr('text-anchor', 'end') // Anchor text to the end (left-aligned)
        .text((d) => isWithinTimeline(scale(d.year)) ? d.label : '') // Clip label if outside timeline
        .style('font-size', '10px')
        .style('fill', 'gray');
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

        // Re-render the timeline with the updated scale
        renderTimeline(newXScale);
      });

    // Apply zoom behavior to the SVG
    svg.call(zoom);

  }, []);

  return <div ref={timelineRef}></div>;
};

export default OhIntroTimeline;
