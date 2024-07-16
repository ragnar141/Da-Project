import React, { useEffect, useRef, useReducer } from 'react';
import * as d3 from 'd3';
import '../components css/TreeReferenceGraph.css'; // Import the CSS file

import textsData from './datasets/tags2.json';
import referencesData from './datasets/references 7.11.24.json';

// Define the list of tags
const tags = [
  "poetry", "allegory", "narrative", "dialogue", "essay", "novel", "critique", "psychology", "theology", "sociology", "history", "philosophy", "natural sciences", "mathematics", 
  "physics", "biology", "political science", "public relations", "linguistics", "medicine", "logic", "ethics", "education", "law", "warfare", "economics", "epic", "strategy"
];

// Initial state for the reducer
const initialState = {
  hoveredText: null,            // Holds information about the currently hovered text
  referencingTitles: [],        // Titles of texts referencing the hovered text
  referencedTitles: [],         // Titles of texts referenced by the hovered text
  selectedTags: tags,           // Initialize with all tags selected
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_HOVERED_TEXT':   // Set hovered text and related references
      return {
        ...state,
        hoveredText: action.payload.text,
        referencingTitles: action.payload.referencingTitles,
        referencedTitles: action.payload.referencedTitles,
      };
    case 'CLEAR_HOVERED_TEXT': // Clear hovered text and related references
      return {
        ...state,
        hoveredText: null,
        referencingTitles: [],
        referencedTitles: [],
      };
    case 'TOGGLE_TAG':         // Toggle tag selection
      const updatedTags = state.selectedTags.includes(action.payload)
        ? state.selectedTags.filter(tag => tag !== action.payload)
        : [...state.selectedTags, action.payload];
      return {
        ...state,
        selectedTags: updatedTags,
      };
    default:
      return state;
  }
};

const TreeReferenceGraph = () => {
  const chartRef = useRef(null);         // Reference to the SVG element
  const updateChartRef = useRef(null);   // Reference to the updateChart function
  const [state, dispatch] = useReducer(reducer, initialState); // Use useReducer for state management

  // Function to get the x-position of a data point based on the year
  const getXPosition = (xScale, year) => xScale(year);

  // Function to get the y-position of a data point based on the language and author
  const getYPosition = (yScale, language, author) => {
    const yPos = yScale(language); // Get the y-position based on the language
    const bandWidth = yScale.bandwidth(); // Get the bandwidth of the y-scale
    const padding = 0.1; // Padding to adjust the position within the bandwidth

    // Calculate position factor based on the author's first letter
    let positionFactor = 0.5;
    if (author && author.length > 0) {
      const firstLetter = author[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    positionFactor = padding + positionFactor * (1 - 2 * padding);

    return yPos + positionFactor * bandWidth; // Return the calculated y-position
  };

  useEffect(() => {
    const margin = { top: 0, right: 130, bottom: 20, left: 70 }; // Margin for the SVG
    const width = 1440 - margin.left - margin.right; // Calculate width
    const height = 690 - margin.top - margin.bottom; // Calculate height

    // List of languages
    const languages = [
      'Hebrew', 'Aramaic', 'Avestan', 'Sanskrit', 'Chinese', 'Japanese', 
      'Pali', 'Latin', 'Arabic',  'Italian', 'Greek',
      'French', 'English', 'German', 'Russian'
    ];

    // Create SVG element and set its dimensions
    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x-scale and x-axis
    const xScale = d3.scaleLinear()
      .domain([-3000, 2024]) // Set the domain based on the year range
      .range([0, width]); // Set the range based on the width

    const xAxis = d3.axisBottom(xScale); // Create the x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis); // Add the x-axis to the SVG

    // Create y-scale and y-axis
    const yScale = d3.scaleBand()
      .domain(languages) // Set the domain based on the languages
      .range([0, height]) // Set the range based on the height
      .padding(0);

    const yAxis = d3.axisLeft(yScale); // Create the y-axis
    svg.append('g')
      .call(yAxis); // Add the y-axis to the SVG

    // Add horizontal grid lines
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

    // Process the data
    const data = textsData.map(d => ({
      id: d.index,
      language: d["dataviz friendly original language"],
      year: d["dataviz friendly date"],
      dateForCard: d["date"],
      oLanguage: d["original language"],
      author: d.author,
      title: d.title,
      location: d["original location"],
      link: d.link, // Ensure this matches the actual column name in your JSON
      tags: Array.isArray(d.tags) ? d.tags : (d.tags ? d.tags.split(',') : []) 
    }));

    console.log('Data after processing:', data);

    // Create a map for easy access to data points by ID
    const dataMap = new Map(data.map(d => [d.id, d]));

    // Function to update the chart based on selected tags
    const updateChart = () => {
      console.log('Selected Tags:', state.selectedTags);

      // Filter data based on selected tags
      const filteredData = state.selectedTags.length === 0 ? [] : data.filter(d => {
        // Ensure d.tags is an array and normalize tags
        const tagsArray = Array.isArray(d.tags) ? d.tags.map(tag => tag.trim().toLowerCase()) : d.tags.split(',').map(tag => tag.trim().toLowerCase());

        console.log(`Data point "${d.title}" with tags: ${tagsArray}`);

        const hasMatchingTag = state.selectedTags.some(tag => {
          const normalizedTag = tag.trim().toLowerCase();
          const result = tagsArray.includes(normalizedTag);
          console.log(`Checking if "${normalizedTag}" is in ${tagsArray}: ${result}`);
          return result;
        });

        if (!hasMatchingTag) {
          console.log(`Data point "${d.title}" filtered out. Tags: ${tagsArray}`);
        }
        return hasMatchingTag;
      });

      console.log('Filtered Data:', filteredData);
      console.log('Selected tags:', state.selectedTags);

      // Clear existing circles and lines
      svg.selectAll('circle').remove();
      svg.selectAll('.reference-line').remove();

      // Draw circles for the filtered data points
      svg.selectAll('circle')
        .data(filteredData)
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
          const refs = referencesData
            .filter(ref => ref.primary)
            // .filter(ref => ref.primary_text === d.id)
            .map(ref => ({
              ...dataMap.get(ref.secondary_text),
              referenceType: ref.type_of_reference
            }))
            .filter(Boolean)
            .map(text => ({
              title: text.title,
              year: text.year,
              referenceType: text.referenceType
            }))
            .sort((a, b) => b.year - a.year) // Sort by year, newest first
          const refsBy = referencesData
            .filter(ref => ref.secondary_text === d.id)
            .map(ref => ({
              ...dataMap.get(ref.primary_text),
              referenceType: ref.type_of_reference
            }))
            .filter(Boolean)
            .map(text => ({
              title: text.title,
              year: text.year,
              referenceType: text.referenceType
            }))
            .sort((a, b) => b.year - a.year); // Sort by year, newest first
          dispatch({ type: 'SET_HOVERED_TEXT', payload: { text: d, referencingTitles: refs, referencedTitles: refsBy } });
          // Change fill color of circle to black
          d3.select(event.target).style('fill', 'black');
        })
        .on('mouseout', (event, d) => {
          // Reset opacity of related lines
          d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.05);
          // Clear hovered text information
          dispatch({ type: 'CLEAR_HOVERED_TEXT' });
          // Reset fill color of circle to white
          d3.select(event.target).style('fill', 'white');
        })
        .on('click', (event, d) => {
          // Redirect to the link on click
          if (d.link) {
            window.open(d.link, '_blank');
          }
        });

      // Draw reference lines for the filtered data points
      filteredData.forEach(d => {
        const sourceReferences = referencesData.filter(ref => ref.primary_text === d.id);
        const targetReferences = referencesData.filter(ref => ref.secondary_text === d.id);

        sourceReferences.forEach(ref => {
          const target = dataMap.get(ref.secondary_text);
          if (target && filteredData.includes(target)) {
            const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
            svg.append('line')
              .attr('x1', getXPosition(xScale, d.year))
              .attr('y1', getYPosition(yScale, d.language, d.author))
              .attr('x2', getXPosition(xScale, target.year))
              .attr('y2', getYPosition(yScale, target.language, target.author))
              .attr('stroke', color)
              .attr('stroke-width', 1.4)
              .attr('stroke-opacity', 0.1)
              .attr('class', `reference-line reference-${d.id} reference-${target.id}`);
          }
        });

        targetReferences.forEach(ref => {
          const source = dataMap.get(ref.primary_text);
          if (source && filteredData.includes(source)) {
            const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
            svg.append('line')
              .attr('x1', getXPosition(xScale, source.year))
              .attr('y1', getYPosition(yScale, source.language, source.author))
              .attr('x2', getXPosition(xScale, d.year))
              .attr('y2', getYPosition(yScale, d.language, d.author))
              .attr('stroke', color)
              .attr('stroke-width', 1.4)
              .attr('stroke-opacity', 0.1)
              .attr('class', `reference-line reference-${source.id} reference-${d.id}`);
          }
        });
      });
    };

    updateChartRef.current = updateChart;
    updateChart();
  }, [state.selectedTags]); // Depend on selectedTags to re-run effect

  useEffect(() => {
    if (updateChartRef.current) {
      updateChartRef.current();
    }
  }, [state.selectedTags]);

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <svg ref={chartRef}></svg>
      {state.hoveredText && (
        <div className="hover-card" style={{ pointerEvents: 'auto' }}>
          {state.referencingTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informs:</strong></p>
              <ul>
                {state.referencingTitles.map((item, index) => (
                  <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'similar-themes'}>
                    {item.title} ({item.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="hover-card-main">
            <p><span className="hover-card-title">{state.hoveredText.title}</span></p>
            <p><span>by:</span> <span>{state.hoveredText.author}</span></p>
            <p><span>{state.hoveredText.dateForCard}</span></p>
            <p><span>{state.hoveredText.oLanguage}</span></p>
            <p><span>{state.hoveredText.location}</span></p>
          </div>
          {state.referencedTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informed by:</strong></p>
              <ul>
                {state.referencedTitles.map((item, index) => (
                  <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'similar-themes'}>
                    {item.title} ({item.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="legend-container">
        <div className="legend-item">
          <span className="bullet direct-reference"></span> direct reference
        </div>
        <div className="legend-item">
          <span className="bullet similar-themes"></span> similar themes
        </div>
      </div>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <div key={index} className="tag-item">
            <input
              type="checkbox"
              id={`tag-${tag}`}
              value={tag}
              checked={state.selectedTags.includes(tag)} // Ensure checkbox is checked based on state
              onChange={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })}
            />
            <label htmlFor={`tag-${tag}`}>{tag}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreeReferenceGraph;

