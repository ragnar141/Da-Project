import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../components css/TreeReferenceGraph.css'; // Import the CSS file

import textsData from './datasets/texts 7.11.24.json';
import referencesData from './datasets/references 7.11.24.json';

const TreeReferenceGraph = () => {
  const chartRef = useRef(null);
  const [hoveredText, setHoveredText] = useState(null); // State to manage hovered text information
  const [referencingTitles, setReferencingTitles] = useState([]); // Titles of texts referencing the hovered text
  const [referencedTitles, setReferencedTitles] = useState([]); // Titles of texts referenced by the hovered text

  // Define the functions outside the useEffect hook
  const getXPosition = (xScale, year) => xScale(year);

  const getYPosition = (yScale, language, author) => {
    const yPos = yScale(language);
    const bandWidth = yScale.bandwidth();
    const padding = 0.1;

    let positionFactor = 0.5;
    if (author && author.length > 0) {
      const firstLetter = author[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    positionFactor = padding + positionFactor * (1 - 2 * padding);

    return yPos + positionFactor * bandWidth;
  };

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

    const xScale = d3.scaleLinear()
      .domain([-3000, 2024])
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    const yScale = d3.scaleBand()
      .domain(languages)
      .range([0, height])
      .padding(0);

    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .call(yAxis);

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

    const data = textsData.map(d => ({
      id: d.index,
      language: d["dataviz friendly original language"],
      year: d["dataviz friendly date"],
      dateForCard: d["date"],
      oLanguage: d["original language"],
      author: d.author,
      title: d.title,
      location: d["original location"]
    }));

    const dataMap = new Map(data.map(d => [d.id, d]));

    referencesData.forEach((ref, index) => {
      const source = dataMap.get(ref.primary_text);
      const target = dataMap.get(ref.secondary_text);

      if (source && target) {
        const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
        console.log(`Reference #${index}: Type=${ref.type_of_reference}, Color=${color}`); // Log reference type and color

        svg.append('line')
          .attr('x1', getXPosition(xScale, source.year))
          .attr('y1', getYPosition(yScale, source.language, source.author))
          .attr('x2', getXPosition(xScale, target.year))
          .attr('y2', getYPosition(yScale, target.language, target.author))
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.1)
          .attr('class', `reference-line reference-${source.id} reference-${target.id}`);
      }
    });

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => getXPosition(xScale, d.year))
      .attr('cy', d => getYPosition(yScale, d.language, d.author))
      .attr('r', 3)
      .style('fill', 'white')
      .style('stroke', 'black')
      .on('mouseover', (event, d) => {
        // Change opacity of related lines
        d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.9);
        // Set hovered text information
        setHoveredText(d);

        // Collect titles and years of texts that reference the hovered text
        const refs = referencesData
          .filter(ref => ref.primary_text === d.id)
          .map(ref => dataMap.get(ref.secondary_text))
          .filter(Boolean)
          .map(text => ({ title: text.title, year: text.year }))
          .sort((a, b) => b.year - a.year); // Sort by year, newest first
        setReferencingTitles(refs);

        // Collect titles and years of texts that the hovered text references
        const refsBy = referencesData
          .filter(ref => ref.secondary_text === d.id)
          .map(ref => dataMap.get(ref.primary_text))
          .filter(Boolean)
          .map(text => ({ title: text.title, year: text.year }))
          .sort((a, b) => b.year - a.year); // Sort by year, newest first
        setReferencedTitles(refsBy);

        // Change fill color of circle to black
        d3.select(event.target).style('fill', 'black');
      })
      .on('mouseout', (event, d) => {
        // Reset opacity of related lines
        d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.1);
        // Clear hovered text information
        setHoveredText(null);
        setReferencingTitles([]);
        setReferencedTitles([]);
        // Reset fill color of circle to white
        d3.select(event.target).style('fill', 'white');
      });

  }, []);

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <svg ref={chartRef}></svg>
      {hoveredText && (
        <div className="hover-card" style={{ pointerEvents: 'auto' }}>
          {referencingTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informs:</strong></p>
              <ul>
                {referencingTitles.map((item, index) => (
                  <li key={index}>{item.title} ({item.year})</li>
                ))}
              </ul>
            </div>
          )}
          <div className="hover-card-main">
            <p><span className="hover-card-title">{hoveredText.title}</span></p>
            <p><span>by:</span> <span>{hoveredText.author}</span></p>
            <p><span>{hoveredText.dateForCard}</span></p>
             <p><span>{hoveredText.oLanguage}</span></p>
             <p><span>{hoveredText.location}</span></p>
          </div>
          {referencedTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informed by:</strong></p>
              <ul>
                {referencedTitles.map((item, index) => (
                  <li key={index}>{item.title} ({item.year})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeReferenceGraph;
