import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import textsData from './datasets/texts 7.5.24.json';
import referencesData from './datasets/references 7.3.24.json';

const TreeReferenceGraph = () => {

 const chartRef = useRef(null);

 useEffect(() => {
  const margin = { top: 30, right: 50, bottom: 40, left: 50 };
  const width = 1400 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;
 
  const languages = [
    'Hebrew', 'Aramaic', 'Avestan', 'Sanskrit', 'Chinese', 'Greek', 
    'Pali', 'Latin', 'Arabic', 'Japanese', 'Italian', 
    'French', 'English', 'German', 'Russian'
  ];
  
  const svg = d3.select(chartRef.current)
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up the x scale (timeline)
  const xScale = d3.scaleLinear()
      .domain([-3000, 2024])
      .range([0, width]);

  // Add the x Axis (timeline)
  const xAxis = d3.axisBottom(xScale);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  // Set up the y scale (languages)
  const yScale = d3.scaleBand()
    .domain(languages)
    .range([0, height])
    .padding(0);

  // Add the y Axis (languages)
  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .call(yAxis);

  // Draw horizontal dotted lines for language segment borders
  svg.selectAll('.horizontal-line')
    .data(languages)
    .enter()
    .append('line')
    .attr('class', 'horizontal-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', 'grey')
    .attr('stroke-dasharray', '20 10')
    .attr('stroke-opacity', 0.5);

  svg.selectAll('.horizontal-line-bottom')
    .data(languages)
    .enter()
    .append('line')
    .attr('class', 'horizontal-line-bottom')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', d => yScale(d) + yScale.bandwidth())
    .attr('y2', d => yScale(d) + yScale.bandwidth())
    .attr('stroke', 'grey')
    .attr('stroke-dasharray', '20 10')
    .attr('stroke-opacity', 0.5);

  // Calculate x position based on the year
  const getXPosition = (year) => {
    return xScale(year);
  };

  // Calculate y position based on the language
  const getYPosition = (language, author) => {
    const yPos = yScale(language);
    const bandWidth = yScale.bandwidth();
    const padding = 0.1; 
    
    let positionFactor = 0.5; // Default value for unknown authors
    if (author && author.length > 0) {
      const firstLetter = author[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25; // 'A' -> 0, 'Z' -> 1
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    // Adjust positionFactor to include padding
    positionFactor = padding + positionFactor * (1 - 2 * padding);

    return yPos + positionFactor * bandWidth;
  };

  const data = textsData.map(d => ({
    language: d["dataviz friendly original language"],
    year: d["dataviz friendly date"],
    author: d.author
  }));

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => getXPosition(d.year))
    .attr('cy', d => getYPosition(d.language, d.author))
    .attr('r', 3) // smaller radius
    .style('fill', 'black') // fill color
    .style('stroke', 'black'); // border color

  }, []);

return (
  <svg ref={chartRef}></svg>
);
};

export default TreeReferenceGraph;
