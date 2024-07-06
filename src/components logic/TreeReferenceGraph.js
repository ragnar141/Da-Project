import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import textsData from './datasets/texts 7.5.24.json';
import referencesData from './datasets/references 7.3.24.json';

const TreeReferenceGraph = () => {

 const chartRef = useRef(null);

 useEffect(() => {
  const margin = { top: 20, right: 50, bottom: 70, left: 50 };
  const width = 1850 - margin.left - margin.right;
  const height = 1800 - margin.top - margin.bottom;
 
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

  // Set up the x scale
  const xScale = d3.scaleLinear()
      .domain([0, languages.length])
      .range([0, width]);

  // Add the x Axis
  const xAxis = d3.axisBottom(xScale)
      .ticks(languages.length)
      .tickFormat((d, i) => languages[i]);

  // Set up the y scale
  const yScale = d3.scaleLinear()
    .domain([-3000, 2024])
    .range([height, 0]);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'middle')
    .attr('dx', (d, i) => `${(xScale(i + 1) - xScale(i)) / 2}`)
    .attr('dy', '1.5em');

  // Add the y Axis on the right side
  svg.append('g')
    .attr('transform', `translate(${width},0)`)
    .call(d3.axisRight(yScale));

  // Draw vertical dotted lines
  svg.selectAll('.vertical-line')
    .data(d3.range(0, languages.length))
    .enter()
    .append('line')
    .attr('class', 'vertical-line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'grey')
    .attr('stroke-dasharray', '20 10')
    .attr('stroke-opacity', 0.5);

  
    const getXPosition = (language, author) => {
      const index = languages.indexOf(language);
      const segmentWidth = width / languages.length;
      
      // Normalize first letter of the author's name to a value between 0 and 1
      let positionFactor = 0.5; // Default value for unknown authors
      if (author && author.length > 0) {
        const firstLetter = author[0].toUpperCase();
        const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25; // 'A' -> 0, 'Z' -> 1
        positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
      }
  
      return xScale(index) + positionFactor * segmentWidth;
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
      .attr('cx', d => getXPosition(d.language, d.author))
      .attr('cy', d => yScale(d.year))
      .attr('r', 3) // smaller radius
      .style('fill', 'black') // fill color
      .style('stroke', 'black'); // border color
  
  }, []);

return (
  <svg ref={chartRef}></svg>
);
};

export default TreeReferenceGraph;
