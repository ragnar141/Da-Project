import React, { useEffect, useRef, useReducer, useMemo, useState } from 'react';
import * as d3 from 'd3';
import '../components css/TreeReferenceGraph.css'; // Import the CSS file

import textsData from './datasets/texts 7.17.24.json';
import referencesData from './datasets/references 7.11.24.json';
import ZoomableArea from './ZoomableArea';

// Define the list of tags
const group1Tags = [
  "poetry", "narrative", "dialogue", "essay", "novel", "critique"
];

const group2Tags = [
  "theology", "philosophy", "logic", "rhetoric", "ethics", "metaphysics", "history", "natural sciences", "mathematics", 
  "physics", "biology", "political science", "sociology", "psychology", 
  "epistemology", "medicine", "economics", "education", "public relations", "law", "warfare", "strategy"
];

// Initial state for the reducer
const initialState = {
  hoveredText: null,            // Holds information about the currently hovered text
  referencingTitles: [],        // Titles of texts referencing the hovered text
  referencedTitles: [],         // Titles of texts referenced by the hovered text
  selectedTags: [...group1Tags, ...group2Tags],           // Initialize with all tags selected
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
  const hoverCardRef = useRef(null);     // Reference to the hover card element
  const updateChartRef = useRef(null);   // Reference to the updateChart function
  const [state, dispatch] = useReducer(reducer, initialState); // Use useReducer for state management
  const [currentZoomState, setCurrentZoomState] = useState(); // Zoom state

  const margin = useMemo(() => ({ top: 0, right: 130, bottom: 20, left: 70 }), []); // Margin for the SVG
  const width = 1440 - margin.left - margin.right; // Calculate width
  const height = 690 - margin.top - margin.bottom; // Calculate height

  // List of languages
  const languages = useMemo(() => [
    'Avestan', 'Hebrew', 'Aramaic',  'Latin', 'Arabic',  'Italian', 'Greek',
    'French', 'English', 'German', 'Russian', 'Sanskrit', 'Chinese', 'Japanese', 
    'Pali'
  ], []);

  // Create x-scale and y-scale
  const xScale = useMemo(() => d3.scaleLinear()
    .domain([-3000, 2024]) // Set the domain based on the year range
    .range([0, width]), [width]); // Set the range based on the width

  const yScale = useMemo(() => d3.scalePoint()
    .domain(languages) // Set the domain based on the languages
    .range([0, height]) // Set the range based on the height
    .padding(0.5), [languages, height]); // Add padding to ensure points are spaced correctly

  // Function to get the x-position of a data point based on the year
  const getXPosition = (xScale, year) => xScale(year);

  // Function to get the y-position of a data point based on the language and author
  const getYPosition = (yScale, language, author) => {
    const yPos = yScale(language); // Get the y-position based on the language
    const segmentHeight = yScale.step(); // Get the step size of the y-scale
    const padding = segmentHeight * 0.1; // Padding to adjust the position within the segment

    // Calculate position factor based on the author's first letter
    let positionFactor = 0.5;
    if (author && author.length > 0) {
      const firstLetter = author[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    const finalYPos = yPos - segmentHeight / 2 + padding + positionFactor * (segmentHeight - 2 * padding);
    return finalYPos;
  };

  // Function to group close data points and adjust for overlap
  const adjustForOverlap = (data, xScale) => {
    const radius = 3.4; // Radius of the circles
    const adjustedData = [...data]; // Create a copy of the data array to avoid mutating the original data
    const groupedData = d3.groups(adjustedData, d => `${d.year}-${d.author}`); // Group data points by year and author

    groupedData.forEach(([key, group]) => { // Iterate through each group of data points
      if (group.length > 1) { // If there are multiple data points in the same group (i.e., they overlap)
        group.forEach((d, i) => { // Adjust the x position to prevent overlap by shifting each point
          d.adjustedX = xScale(d.year) + i * radius * 2;
          d.adjustedYear = xScale.invert(d.adjustedX); // Calculate the adjusted year
        });
      } else { // If there is only one data point in the group, no adjustment is needed
        group[0].adjustedX = xScale(group[0].year); // Set the adjusted x position to the original x position
        group[0].adjustedYear = group[0].year; // Set the adjusted year to the original year
      }
    });

    return adjustedData; // Return the array with adjusted data points
  };

  // First useEffect to render static elements
  useEffect(() => {
    // Create SVG element and set its dimensions
    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create clip path
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
  }, [height, margin.left, margin.right, margin.top, margin.bottom, width, xScale, yScale]);

  // Handle wheel events
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); // Prevent default scrolling behavior
      e.stopPropagation(); // Prevent the event from propagating to parent elements
    };

    const attachWheelListener = () => {
      const hoverCardElement = hoverCardRef.current;

      if (hoverCardElement) {
        hoverCardElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
          hoverCardElement.removeEventListener('wheel', handleWheel);
        };
      }
    };

    const timeoutId = setTimeout(attachWheelListener, 0);

    return () => clearTimeout(timeoutId);
  }, [state.hoveredText]); // Add state.hoveredText to dependency array to ensure the effect runs when the hover card is updated

  // Second useEffect to handle dynamic updates
  useEffect(() => {
    const svg = d3.select(chartRef.current).select('g');

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

    const dataMap = new Map(data.map(d => [d.id, d]));

    // Add reference lines between data points
    const referenceLines = svg.append('g')
      .attr('class', 'reference-lines')
      .attr('clip-path', 'url(#clip)'); // Apply clip path

    referencesData.forEach((ref, index) => {
      const source = dataMap.get(ref.primary_text);
      const target = dataMap.get(ref.secondary_text);

      if (source && target) {
        const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';

        referenceLines.append('line')
          .attr('x1', getXPosition(xScale, source.year))
          .attr('y1', getYPosition(yScale, source.language, source.author))
          .attr('x2', getXPosition(xScale, target.year))
          .attr('y2', getYPosition(yScale, target.language, target.author))
          .attr('stroke', color)
          .attr('stroke-width', 1.4)
          .attr('stroke-opacity', 0.05)
          .attr('class', `reference-line reference-${source.id} reference-${target.id}`);
      }
    });

    // Function to update the chart based on selected tags
    const updateChart = () => {
      // Filter data based on selected tags
      const filteredData = state.selectedTags.length === 0 ? [] : data.filter(d => {
        const tagsArray = Array.isArray(d.tags) ? d.tags.map(tag => tag.trim().toLowerCase()) : d.tags.split(',').map(tag => tag.trim().toLowerCase());

        const hasMatchingTag = state.selectedTags.some(tag => {
          const normalizedTag = tag.trim().toLowerCase();
          return tagsArray.includes(normalizedTag);
        });

        return hasMatchingTag;
      });

      // Clear existing circles and lines
      svg.selectAll('circle').remove();
      svg.selectAll('.reference-line').remove();
      
      // Adjust for overlap
      const adjustedData = adjustForOverlap(filteredData, xScale);

      // Draw reference lines for the filtered data points
      adjustedData.forEach(d => {
        const sourceReferences = referencesData.filter(ref => ref.primary_text === d.id);
        const targetReferences = referencesData.filter(ref => ref.secondary_text === d.id);

        // Draw reference lines where the current text is the source
        sourceReferences.forEach(ref => {
          const target = dataMap.get(ref.secondary_text);
          if (target && adjustedData.includes(target)) {
            const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
            referenceLines.append('line')
              .attr('x1', d.adjustedX)
              .attr('y1', getYPosition(yScale, d.language, d.author))
              .attr('x2', target.adjustedX)
              .attr('y2', getYPosition(yScale, target.language, target.author))
              .attr('stroke', color)
              .attr('stroke-width', 1.4)
              .attr('stroke-opacity', 0.05)
              .attr('class', `reference-line reference-${d.id} reference-${target.id}`);
          }
        });

        // Draw reference lines where the current text is the target
        targetReferences.forEach(ref => {
          const source = dataMap.get(ref.primary_text);
          if (source && adjustedData.includes(source)) {
            const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
            referenceLines.append('line')
              .attr('x1', source.adjustedX)
              .attr('y1', getYPosition(yScale, source.language, source.author))
              .attr('x2', d.adjustedX)
              .attr('y2', getYPosition(yScale, d.language, d.author))
              .attr('stroke', color)
              .attr('stroke-width', 1.4)
              .attr('stroke-opacity', 0.05)
              .attr('class', `reference-line reference-${source.id} reference-${d.id}`);
          }
        });
      });

      // Draw circles for the filtered data points
      const circlesGroup = svg.append('g')
        .attr('class', 'circles-group')
        .attr('clip-path', 'url(#clip)'); // Apply clip path

      circlesGroup.selectAll('circle')
        .data(adjustedData)
        .enter()
        .append('circle')
        .attr('cx', d => d.adjustedX)
        .attr('cy', d => getYPosition(yScale, d.language, d.author))
        .attr('r', 3.4)
        .style('fill', 'white')
        .style('stroke', 'black')
        .on('mouseover', (event, d) => {
          // Change opacity of related lines
          d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.9);
          // Set hovered text information
          const refs = referencesData
            .filter(ref => ref.primary_text === d.id)
            .map(ref => ({
              ...dataMap.get(ref.secondary_text),
              referenceType: ref.type_of_reference
            }))
            .filter(Boolean)
            .filter(text => adjustedData.some(dataItem => dataItem.id === text.id))
            .map(text => ({
              title: text.title,
              year: text.year,
              date: text.dateForCard,
              referenceType: text.referenceType
            }))
            .sort((a, b) => b.year - a.year);
          const refsBy = referencesData
            .filter(ref => ref.secondary_text === d.id)
            .map(ref => ({
              ...dataMap.get(ref.primary_text),
              referenceType: ref.type_of_reference
            }))
            .filter(Boolean)
            .filter(text => adjustedData.some(dataItem => dataItem.id === text.id))
            .map(text => ({
              title: text.title,
              year: text.year,
              date: text.dateForCard,
              referenceType: text.referenceType
            }))
            .sort((a, b) => b.year - a.year);
          dispatch({ type: 'SET_HOVERED_TEXT', payload: { text: d, referencingTitles: refs, referencedTitles: refsBy } });
          d3.select(event.target).style('fill', 'black');

          setTimeout(() => {
            if (hoverCardRef.current) {
              const hoverCardMain = hoverCardRef.current.querySelector('.hover-card-main');
              const hoverCardHeight = hoverCardRef.current.clientHeight;
              const hoverCardMainHeight = hoverCardMain.clientHeight;
              const scrollTop = hoverCardMain.offsetTop - (hoverCardHeight / 2 - hoverCardMainHeight / 2);
              hoverCardRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
            }
          }, 0);
        })
        .on('mouseout', (event, d) => {
          // Reset opacity of related lines
          d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.05);
          // Clear hovered text information
          dispatch({ type: 'CLEAR_HOVERED_TEXT' });
          d3.select(event.target).style('fill', 'white');
        })
        .on('click', (event, d) => {
          if (d.link) {
            window.open(d.link, '_blank');
          }
        });

      // Render horizontal grid lines on the borders between segments
      svg.selectAll('.horizontal-line')
      .data([...languages.map(d => yScale(d) - yScale.step() / 2), height]) // Include top and bottom lines
      .enter()
      .append('line')
      .attr('class', 'horizontal-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => d)
      .attr('y2', d => d)
      .attr('stroke', 'grey')
      .attr('stroke-dasharray', '20 10')
      .attr('stroke-opacity', 0.5);
    

      svg.select('.y-axis').remove();
      const yAxis = d3.axisLeft(yScale)
        .tickSize(0) // Hide tick lines
        .tickPadding(10); // Add padding to the labels
      svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis); // Add the y-axis to the SVG
    };

    // Function to apply zoom transform to the chart
    const applyZoom = (zoomState) => {
      if (zoomState) {
        console.log("Applying zoom state:", zoomState);
        const newXScale = zoomState.rescaleX(xScale);
    
        // Manually calculate the new range for yScale
        console.log("Original yScale range:", yScale.range());
        const newYScaleRange = yScale.range().map(d => zoomState.applyY(d));
        console.log("New yScale range after zoom:", newYScaleRange);
        const newYScale = yScale.copy().range(newYScaleRange);
    
        // Log the new domains and ranges of the scales
        console.log("New xScale domain:", newXScale.domain());
        console.log("New xScale range:", newXScale.range());
        console.log("New yScale domain:", newYScale.domain());
        console.log("New yScale range:", newYScale.range());
    
        // Update the x-axis and y-axis with the new scales
        svg.select('.x-axis').call(d3.axisBottom(newXScale));
        svg.select('.y-axis').call(d3.axisLeft(newYScale));

        svg.selectAll('.horizontal-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d, i) => {
          if (i === 0) {
            // Top border line of the first segment
            return newYScale(languages[0]) - newYScale.step() / 2;
          } else if (i === languages.length) {
            // Bottom border line of the last segment
            return newYScale(languages[languages.length - 1]) + newYScale.step() / 2;
          } else {
            // Borders of each segment
            const newY = newYScale(languages[i - 1]) + newYScale.step() / 2;
            console.log(`Horizontal line y1 position for language=${languages[i - 1]} : ${newY}`);
            return newY;
          }
        })
        .attr('y2', (d, i) => {
          if (i === 0) {
            // Top border line of the first segment
            return newYScale(languages[0]) - newYScale.step() / 2;
          } else if (i === languages.length) {
            // Bottom border line of the last segment
            return newYScale(languages[languages.length - 1]) + newYScale.step() / 2;
          } else {
            // Borders of each segment
            const newY = newYScale(languages[i - 1]) + newYScale.step() / 2;
            console.log(`Horizontal line y2 position for language=${languages[i - 1]} : ${newY}`);
            return newY;
          }
        });

        // Reapply overlap prevention logic during zoom
        const adjustedData = adjustForOverlap(data, newXScale);
    
        // Update circle positions based on new scales and adjusted data
        svg.selectAll('circle')
          .data(adjustedData) // Bind adjustedData to circles
          .attr('cx', d => {
            // Use adjusted year values for x positions
            const newCx = newXScale(d.adjustedYear || d.year);
            console.log("Circle cx position for year=", d.adjustedYear || d.year, ":", newCx);
            return newCx;
          })
          .attr('cy', d => {
            const newCy = getYPosition(newYScale, d.language, d.author);
            console.log("Circle cy position for language=", d.language, "author=", d.author, ":", newCy);
            return newCy;
          });
    
        // Update reference line positions based on new scales
        svg.selectAll('.reference-line').each(function() {
          const line = d3.select(this);
          const classList = line.attr('class').split(' ');
          const sourceId = parseInt(classList[1].split('-')[1]);
          const targetId = parseInt(classList[2].split('-')[1]);
          const source = dataMap.get(sourceId);
          const target = dataMap.get(targetId);
    
          if (source && target) {
            const x1 = newXScale(source.adjustedYear || source.year);
            const y1 = getYPosition(newYScale, source.language, source.author);
            const x2 = newXScale(target.adjustedYear || target.year);
            const y2 = getYPosition(newYScale, target.language, target.author);
            console.log("Reference line positions for sourceId=", sourceId, "targetId=", targetId, ":", { x1, y1, x2, y2 });
    
            line
              .attr('x1', x1)
              .attr('y1', y1)
              .attr('x2', x2)
              .attr('y2', y2);
          }
        });
      }
    };

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.select('.x-axis').remove();
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    updateChartRef.current = updateChart;
    updateChart();
    applyZoom(currentZoomState);
  }, [state.selectedTags, xScale, yScale, languages, currentZoomState, height, width]);

  useEffect(() => {
    if (updateChartRef.current) {
      updateChartRef.current();
    }
  }, [state.selectedTags, xScale, yScale]);

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <svg ref={chartRef}>
        <ZoomableArea width={width} height={height} margin={margin} onZoom={setCurrentZoomState} />
      </svg>
      <div className="hover-card" ref={hoverCardRef} style={{ pointerEvents: 'auto', display: state.hoveredText ? 'block' : 'none' }}>
        {state.referencingTitles.length > 0 && (
          <div className="hover-card-section">
            <p><strong>Informs:</strong></p>
            <ul>
              {state.referencingTitles.map((item, index) => (
                <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'similar-themes'}>
                  {item.title} ({item.date})
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="hover-card-main">
          <p><span className="hover-card-title">{state.hoveredText?.title}</span></p>
          <p><span>{state.hoveredText?.author}</span></p>
          <p><span>{state.hoveredText?.dateForCard}</span></p>
          <p><span>{state.hoveredText?.oLanguage}</span></p>
          <p><span>{state.hoveredText?.location}</span></p>
        </div>
        {state.referencedTitles.length > 0 && (
          <div className="hover-card-section">
            <p><strong>Informed by:</strong></p>
            <ul>
              {state.referencedTitles.map((item, index) => (
                <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'similar-themes'}>
                  {item.title} ({item.date})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="legend-container">
        <div className="legend-item">
          <span className="bullet direct-reference"></span> direct reference
        </div>
        <div className="legend-item">
          <span className="bullet similar-themes"></span> similar themes
        </div>
      </div>
      <div className="tags-container">
        <div className="tag-group tag-group-1">
          {group1Tags.map((tag, index) => (
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
        <div className="tag-group tag-group-2">
          {group2Tags.map((tag, index) => (
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
    </div>
  );
};

export default TreeReferenceGraph;
