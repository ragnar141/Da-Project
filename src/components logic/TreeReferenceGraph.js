import React, { useEffect, useRef } from 'react';  // Import React and hooks
import * as d3 from 'd3';  // Import D3 library

import textsData from './datasets/texts 7.5.24.json';  // Import data from a JSON file

const TreeReferenceGraph = () => {
  // Create a reference to the SVG element
  const chartRef = useRef(null);

  // useEffect hook to run D3 code after the component mounts
  useEffect(() => {
    // Define margins and dimensions for the SVG container
    const margin = { top: 30, right: 50, bottom: 40, left: 50 };
    const width = 1400 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Define the list of languages
    const languages = [
      'Hebrew', 'Aramaic', 'Avestan', 'Sanskrit', 'Chinese', 'Greek', 
      'Pali', 'Latin', 'Arabic', 'Japanese', 'Italian', 
      'French', 'English', 'German', 'Russian'
    ];

    // Create an SVG container for the chart and set its dimensions
    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the x scale (timeline)
    const xScale = d3.scaleLinear()
      .domain([-3000, 2024])  // Define the domain (range of data)
      .range([0, width]);  // Define the range (output range in pixels)

    // Create and add the x Axis (timeline) to the SVG
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)  // Position the x axis at the bottom
      .call(xAxis);  // Call the xAxis function to create the axis

    // Set up the y scale (languages)
    const yScale = d3.scaleBand()
      .domain(languages)  // Define the domain (list of languages)
      .range([0, height])  // Define the range (output range in pixels)
      .padding(0);  // Set padding between bands

    // Create and add the y Axis (languages) to the SVG
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .call(yAxis);  // Call the yAxis function to create the axis

    // Draw horizontal dotted lines for language segment borders
    svg.selectAll('.horizontal-line')
      .data(languages)  // Bind data (languages)
      .enter()  // Enter selection (for each data point)
      .append('line')  // Append a line element
      .attr('class', 'horizontal-line')  // Set the class for styling
      .attr('x1', 0)  // Starting x position
      .attr('x2', width)  // Ending x position
      .attr('y1', d => yScale(d))  // Starting y position based on language
      .attr('y2', d => yScale(d))  // Ending y position (same as starting y position)
      .attr('stroke', 'grey')  // Set line color
      .attr('stroke-dasharray', '20 10')  // Set dash style
      .attr('stroke-opacity', 0.5);  // Set line opacity

    // Draw bottom horizontal dotted lines for each language segment
    svg.selectAll('.horizontal-line-bottom')
      .data(languages)  // Bind data (languages)
      .enter()  // Enter selection (for each data point)
      .append('line')  // Append a line element
      .attr('class', 'horizontal-line-bottom')  // Set the class for styling
      .attr('x1', 0)  // Starting x position
      .attr('x2', width)  // Ending x position
      .attr('y1', d => yScale(d) + yScale.bandwidth())  // Starting y position (bottom of the band)
      .attr('y2', d => yScale(d) + yScale.bandwidth())  // Ending y position (same as starting y position)
      .attr('stroke', 'grey')  // Set line color
      .attr('stroke-dasharray', '20 10')  // Set dash style
      .attr('stroke-opacity', 0.5);  // Set line opacity

    // Function to calculate x position based on the year
    const getXPosition = (year) => xScale(year);

    // Function to calculate y position based on the language and author
    const getYPosition = (language, author) => {
      const yPos = yScale(language);  // Get y position based on language
      const bandWidth = yScale.bandwidth();  // Get the bandwidth of the y scale
      const padding = 0.1;  // Define padding for positioning

      let positionFactor = 0.5;  // Default position factor for unknown authors
      if (author && author.length > 0) {
        // Calculate a normalized value based on the first letter of the author's name
        const firstLetter = author[0].toUpperCase();
        const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;  // 'A' -> 0, 'Z' -> 1
        positionFactor = Math.min(Math.max(normalizedValue, 0), 1);  // Clamp the value between 0 and 1
      }

      // Adjust positionFactor to include padding
      positionFactor = padding + positionFactor * (1 - 2 * padding);

      return yPos + positionFactor * bandWidth;  // Calculate the final y position
    };

    // Prepare data for visualization
    const data = textsData.map(d => ({
      language: d["dataviz friendly original language"],  // Extract language
      year: d["dataviz friendly date"],  // Extract year
      author: d.author  // Extract author
    }));

    // Bind data to circles and append them to the SVG
    svg.selectAll('circle')
      .data(data)  // Bind data
      .enter()  // Enter selection
      .append('circle')  // Append circle elements
      .attr('cx', d => getXPosition(d.year))  // Set the x position based on the year
      .attr('cy', d => getYPosition(d.language, d.author))  // Set the y position based on language and author
      .attr('r', 3)  // Set the radius of the circles
      .style('fill', 'black')  // Set the fill color of the circles
      .style('stroke', 'black');  // Set the stroke color of the circles

  }, []);  // Empty dependency array means this effect runs only once

  return (
    // Return the SVG element with the ref attached
    <svg ref={chartRef}></svg>
  );
};

export default TreeReferenceGraph;
