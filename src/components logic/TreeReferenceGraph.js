import React, { useEffect, useRef, useReducer, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import '../components css/TreeReferenceGraph.css'; // Import the CSS file
import textsData from './datasets/updated texts 8.9.24.json';
import referencesData from './datasets/references 8.27.24.json';
import ZoomableArea from './ZoomableArea';
import SearchBar from './SearchBar'; // Import the SearchBar component

// Define the list of tags
const group1Tags = [
  "poetry", "dialogue", "novel", "play", "prophetic/religious", "essay/treatise",  "narrative"
];

const group2Tags = [
  "theology", "philosophy", "logic", "rhetoric", "ethics", "metaphysics", "history", "natural sciences", "mathematics",
  "political science", "sociology", "psychology",
  "epistemology", "medicine", "economics", "education", "public relations", "law", "warfare", "strategy"
];

// Initial state for the reducer
const initialState = {
  hoveredText: null,            // Holds information about the currently hovered text
  referencingTitles: [],        // Titles of texts referencing the hovered text
  referencedTitles: [],         // Titles of texts referenced by the hovered text
  selectedTags: [...group1Tags, ...group2Tags],           // Initialize with all tags selected
  searchQuery: '',              // Search query state
  searchResults: []             // Search results state
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
    case 'SET_SEARCH_QUERY':   // Set search query
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_SEARCH_RESULTS': // Set search results
      return {
        ...state,
        searchResults: action.payload,
      };
    case 'SET_SELECTED_TAGS':   // Set selected tags directly
      return {
        ...state,
        selectedTags: action.payload,
      };
    default:
      return state;
  }
};

const TreeReferenceGraph = ({ onExpand }) => {
  console.log('TreeReferenceGraph component rendered');
  const updateChartRef = useRef(null); 
  const chartRef = useRef(null);         // Reference to the SVG element
  const hoverCardRef = useRef(null);     // Reference to the hover card element
  const tagsContainerRef = useRef(null);
  const legendContainerRef = useRef(null); // Reference to the tags container element
  const searchBarContainerRef = useRef(null); // Reference to the search bar container
  const [state, dispatch] = useReducer(reducer, initialState); // Use useReducer for state management
  const [currentZoomState, setCurrentZoomState] = useState(d3.zoomIdentity); // Zoom state
  const [adjustedData, setAdjustedData] = useState([]); // Adjusted data state
  const [isExpanded, setIsExpanded] = useState(false); // Expanded state

  const margin = useMemo(() => ({ top: 0, right: 185, bottom: 20, left: 70 }), []); // Margin for the SVG
  const width = 1440 - margin.left - margin.right; // Calculate width
  const height = 690 - margin.top - margin.bottom; // Calculate height

  const handleSelectAllGroup2 = () => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: [...state.selectedTags, ...group2Tags] });
};

// Function to handle "Select None" for group 2 tags
const handleSelectNoneGroup2 = () => {
    const updatedTags = state.selectedTags.filter(tag => !group2Tags.includes(tag));
    dispatch({ type: 'SET_SELECTED_TAGS', payload: updatedTags });
};

  // List of languages
  const languages = useMemo(() => [
    'Different Languages', 'Sanskrit', 'Chinese', 'Greek', 'Latin', 'Arabic', 'Japanese', 'Italian/Spanish/Danish', 'English', 'French', 'German', 
    'Russian'
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
  const getYPosition = (yScale, language, adjustedAuthor) => {
    const yPos = yScale(language); // Get the y-position based on the language
    const segmentHeight = yScale.step(); // Get the step size of the y-scale
    const padding = segmentHeight * 0.1; // Padding to adjust the position within the segment

    // Calculate position factor based on the author's first letter
    let positionFactor = 0.5;
    if (adjustedAuthor && adjustedAuthor.length > 0) {
      const firstLetter = adjustedAuthor[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    const finalYPos = yPos - segmentHeight / 2 + padding + positionFactor * (segmentHeight - 2 * padding);
    return finalYPos;
  };

  // Function to group close data points and adjust for overlap
  const adjustForOverlap = useCallback((data, xScale) => {
    console.log('Adjusting for overlap');
    const radius = 0.5; // Radius of the circles
    const adjustedData = [...data]; // Create a copy of the data array to avoid mutating the original data
    const groupedData = d3.groups(adjustedData, d => `${d.year}-${d.author}`); // Group data points by year and author
  
    groupedData.forEach(([key, group]) => { // Iterate through each group of data points
      if (group.length > 1) { // If there are multiple data points in the same group (i.e., they overlap)
        group.forEach((d, i) => { 
          const originalX = xScale(d.year); // Save original x position for logging
  
          // Adjust the x position to prevent overlap by shifting each point
          d.adjustedX = originalX + i * radius * 2;
          d.adjustedYear = xScale.invert(d.adjustedX); // Calculate the adjusted year
  
          // Log the data point if its position got adjusted
          if (d.adjustedX !== originalX) {
            console.log(`Adjusted position for: ${d.title} (originalX: ${originalX}, adjustedX: ${d.adjustedX})`);
          }
        });
      } else { // If there is only one data point in the group, no adjustment is needed
        group[0].adjustedX = xScale(group[0].year); // Set the adjusted x position to the original x position
        group[0].adjustedYear = group[0].year; // Set the adjusted year to the original year
      }
    });
  
    return adjustedData; // Return the array with adjusted data points
  }, []);

  // Process the data
  const data = useMemo(() => {
    console.log('Processing data');
    return textsData.map(d => ({
      id: d.index,
      language: d["dataviz friendly original language"],
      year: d["dataviz friendly date"],
      dateForCard: d["date"],
      oLanguage: d["original language"],
      author: d.author,
      adjustedAuthor: d["dataviz friendly author"],
      title: d.title,
      location: d["original location"],
      link: d.link, // Ensure this matches the actual column name in your JSON
      tags: Array.isArray(d.tags) ? d.tags : (d.tags ? d.tags.split(',') : [])
    }));
  }, []);

  // Create adjustedData initially
  const initialAdjustedData = useMemo(() => {
    return adjustForOverlap(data, xScale);
  }, [data, xScale, adjustForOverlap]);

  // Update dataMap to use adjustedData
  const dataMap = useMemo(() => {
    console.log('Creating dataMap from adjustedData');
    return new Map(initialAdjustedData.map(d => [d.id, d]));
  }, [initialAdjustedData]);

  // Function to apply zoom transform to the chart
  const applyZoom = useCallback((zoomTransform, adjustedData) => {
    console.log('Applying zoom');
    if (zoomTransform && adjustedData) {
      const svg = d3.select(chartRef.current).select('g');
      console.log("Applying zoom state:", zoomTransform);
      const newXScale = zoomTransform.rescaleX(xScale);
  
      // Manually calculate the new range for yScale
      const newYScaleRange = yScale.range().map(d => zoomTransform.applyY(d));
      const newYScale = yScale.copy().range(newYScaleRange);
  
      // Calculate the zoom scale factor (this will be used to adjust the circle radius)
      const zoomScaleFactor = Math.max(zoomTransform.k, 1); // Ensure the scale factor is at least 1
  
      // Update the x-axis and y-axis with the new scales
      svg.select('.x-axis').remove();
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(newXScale).tickFormat(d => d < 0 ? `${Math.abs(d)} BC` : d))
        .style('font-size', '14px')
        .selectAll("text")
        .style("font-family", "Times New Roman, sans-serif");
  
      svg.select('.y-axis').remove();
      svg.append('g')
        .attr('class', 'y-axis')
        .attr('clip-path', 'url(#xAxisClip)') // Apply x-axis clip path
        .call(d3.axisLeft(newYScale).tickSize(0).tickPadding(10))
        .selectAll("text")
        .style("font-family", "Garamond, sans-serif")
        .style('font-size', '15px')
        .each(function() {
          const text = d3.select(this);
          const label = text.text();
      
          // Clear the original text
          text.text('');
      
          if (label === 'Different Languages') {
            text.append('tspan').text('Different').attr('x', -10).attr('dy', '-0.3em'); // Adjust dy for centering
            text.append('tspan').text('Languages').attr('x', -10).attr('dy', '1.2em');
          } else if (label === 'Italian/Spanish/Danish') {
            text.append('tspan').text('Italian').attr('x', -10).attr('dy', '-1.0em'); // Adjust dy for centering
            text.append('tspan').text('Spanish').attr('x', -10).attr('dy', '1.2em');
            text.append('tspan').text('Danish').attr('x', -10).attr('dy', '1.2em');
          } else {
            text.text(label); // For other labels, just set the text as it is
          }            
        });
  
      svg.selectAll('.horizontal-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d, i) => {
          if (i === 0) {
            return newYScale(languages[0]) - newYScale.step() / 2;
          } else if (i === languages.length) {
            return newYScale(languages[languages.length - 1]) + newYScale.step() / 2;
          } else {
            const newY = newYScale(languages[i - 1]) + newYScale.step() / 2;
            return newY;
          }
        })
        .attr('y2', (d, i) => {
          if (i === 0) {
            return newYScale(languages[0]) - newYScale.step() / 2;
          } else if (i === languages.length) {
            return newYScale(languages[languages.length - 1]) + newYScale.step() / 2;
          } else {
            const newY = newYScale(languages[i - 1]) + newYScale.step() / 2;
            return newY;
          }
        });
  
      // Update circle positions based on new scales and adjusted data
      svg.selectAll('circle')
        .data(adjustedData)
        .attr('cx', d => {
          const newCx = newXScale(d.adjustedYear || d.year);
          return newCx;
        })
        .attr('cy', d => {
          const newCy = getYPosition(newYScale, d.language, d.adjustedAuthor);
          return newCy;
        })
        .attr('r', d => {
          // Adjust the radius based on the zoom scale factor
          return Math.min(4, 2 * zoomScaleFactor); // Cap the radius at 4
        });
  
      // Update reference line positions based on new scales
      svg.selectAll('.reference-line').each(function () {
        const line = d3.select(this);
        const classList = line.attr('class').split(' ');
        const sourceId = parseInt(classList[1].split('-')[1]);
        const targetId = parseInt(classList[2].split('-')[1]);
        const source = dataMap.get(sourceId);
        const target = dataMap.get(targetId);
  
        if (source && target) {
          const x1 = newXScale(source.adjustedYear || source.year);
          const y1 = getYPosition(newYScale, source.language, source.adjustedAuthor);
          const x2 = newXScale(target.adjustedYear || target.year);
          const y2 = getYPosition(newYScale, target.language, target.adjustedAuthor);
  
          line
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);
        }
      });
    }
  }, [xScale, yScale, width, height, languages, dataMap]);

  // First useEffect to render static elements
  useEffect(() => {
    console.log('Rendering static elements');
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
  
    // Create another clip path for the x-axis
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'xAxisClip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('width', width + margin.left)
      .attr('height', height);
  
    // Function to update the chart based on selected tags
    const updateChart = () => {
      console.log('Updating chart');
      const svg = d3.select(chartRef.current).select('g');
    
      // Add reference lines between data points
      const referenceLines = svg.append('g')
        .attr('class', 'reference-lines')
        .attr('clip-path', 'url(#clip)'); // Apply clip path
    
      referencesData.forEach((ref, index) => {
        const sourceId = String(ref.primary_text); // Ensure IDs are treated as strings
        const targetId = String(ref.secondary_text);
        
    
        const source = dataMap.get(sourceId);
        const target = dataMap.get(targetId);
    
        if (source && target) {
          const color = ref.type_of_reference === 'direct reference' ? 'red' : 'black';
    
          referenceLines.append('line')
            .attr('x1', getXPosition(xScale, source.adjustedYear || source.year))
            .attr('y1', getYPosition(yScale, source.language, source.adjustedAuthor))
            .attr('x2', getXPosition(xScale, target.adjustedYear || target.year))
            .attr('y2', getYPosition(yScale, target.language, target.adjustedAuthor))
            .attr('stroke', color)
            .attr('stroke-width', 1.4)
            .attr('stroke-opacity', 0.05)
            .attr('class', `reference-line reference-${source.id} reference-${target.id}`);
        } else {
          console.log(`Missing source or target for reference #${index}`);
          console.log(`Source ID: ${sourceId}, Target ID: ${targetId}`);
          if (!source) {
            console.log(`Source not found for reference #${index}:`, ref);
          }
          if (!target) {
            console.log(`Target not found for reference #${index}:`, ref);
          }
        }
      });
    

      // Filter data based on selected tags
      const filteredData = state.selectedTags.length === 0 ? [] : data.filter(d => {
        const tagsArray = Array.isArray(d.tags) ? d.tags.map(tag => tag.trim().toLowerCase()) : d.tags.split(',' ).map(tag => tag.trim().toLowerCase());
 // Check if the data point has at least one selected tag from group2Tags
 const hasMatchingTagGroup2 = state.selectedTags.some(tag => {
  const normalizedTag = tag.trim().toLowerCase();
  return group2Tags.includes(tag) && tagsArray.includes(normalizedTag);
});

// Check if the data point has at least one selected tag from group1Tags
const hasMatchingTagGroup1 = state.selectedTags.some(tag => {
  const normalizedTag = tag.trim().toLowerCase();
  return group1Tags.includes(tag) && tagsArray.includes(normalizedTag);
});

// The data point should be displayed only if it matches at least one tag from group2Tags and one tag from group1Tags
return hasMatchingTagGroup2 && hasMatchingTagGroup1;
});

// Clear existing circles and lines
svg.selectAll('circle').remove();
svg.selectAll('.reference-line').remove();

// Adjust for overlap
const adjustedData = adjustForOverlap(filteredData, xScale);
setAdjustedData(adjustedData); // Update the adjustedData state

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
      .attr('y1', getYPosition(yScale, d.language, d.adjustedAuthor))
      .attr('x2', target.adjustedX)
      .attr('y2', getYPosition(yScale, target.language, target.adjustedAuthor))
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
      .attr('y1', getYPosition(yScale, source.language, source.adjustedAuthor))
      .attr('x2', d.adjustedX)
      .attr('y2', getYPosition(yScale, d.language, d.adjustedAuthor))
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
.attr('id', d => `circle-${d.id}`) // Add an id attribute to the circle
.attr('cx', d => d.adjustedX)
.attr('cy', d => getYPosition(yScale, d.language, d.adjustedAuthor))
.attr('r', d => {
  // Calculate the radius based on the current zoom level
  const zoomScaleFactor = Math.max(currentZoomState.k, 1);
  return Math.min(4, 2 * zoomScaleFactor);
})
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
  d3.select(event.target).style('fill', 'black')
  .attr('r', 10);

  setTimeout(() => {
    if (hoverCardRef.current) {
      const hoverCardMain = hoverCardRef.current.querySelector('.hover-card-main');
      const hoverCardHeight = hoverCardRef.current.clientHeight;
      const hoverCardMainHeight = hoverCardMain.clientHeight;
      const scrollTop = hoverCardMain.offsetTop - (hoverCardHeight / 2 - hoverCardMainHeight / 2);
      hoverCardRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
      console.log('Event listener added to hoverCardRef');
    } else {
      console.log('hoverCardRef.current is null in setTimeout');
    }
  }, 0);
})
.on('mouseout', (event, d) => {
  // Reset opacity of related lines
  d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.05);
  // Clear hovered text information
  dispatch({ type: 'CLEAR_HOVERED_TEXT' });

  // Recalculate the radius based on the current zoom level
  const zoomScaleFactor = Math.max(currentZoomState.k, 1);
  const radius = Math.min(4, 2 * zoomScaleFactor);

  d3.select(event.target)
    .style('fill', 'white')
    .attr('r', radius); // Use the calculated radius
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
.attr('stroke-opacity', 0.5)
.attr('clip-path', 'url(#xAxisClip)'); // Apply x-axis clip path

return adjustedData;
};

updateChartRef.current = updateChart;
const newAdjustedData = updateChart();
setAdjustedData(newAdjustedData);

// Initial call to applyZoom to render axes with default zoom state
console.log('Initial call to applyZoom');
applyZoom(d3.zoomIdentity, newAdjustedData);
}, [height, margin.left, margin.right, margin.top, margin.bottom, width, xScale, yScale, adjustForOverlap, dataMap, data, state.selectedTags, languages, applyZoom, currentZoomState]);

// Dynamic useEffect to handle zoom updates
useEffect(() => {
console.log('Handling zoom updates');
applyZoom(currentZoomState, adjustedData);
}, [currentZoomState, adjustedData, applyZoom]);

const handleHoverCardWheel = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Hover card wheel event handled");

  const scrollAmount = 0.5 * e.deltaY;
  const hoverCard = hoverCardRef.current;

  // Perform the scroll
  hoverCard.scrollTop += scrollAmount;
};

const handleQueryChange = (event) => {
  const query = event.target.value;
  dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  
  if (query) {
    const searchResults = adjustedData.filter(d => 
      query.split(' ').every(part => 
        d.author.toLowerCase().includes(part.toLowerCase()) ||
        d.title.toLowerCase().includes(part.toLowerCase())
      )
    );
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: searchResults });
  } else {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  }
};


const handleResultClick = (result) => {
  const svg = d3.select(chartRef.current).select('g');
  const targetCircle = svg.select(`#circle-${result.id}`);
  
  if (!targetCircle.empty()) {
    // Trigger hover behavior
    const event = new Event('mouseover');
    targetCircle.node().dispatchEvent(event);
    // Clear search query and results
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  } else {
    console.log("Target circle not found for result:", result);
  }
};

const handleMouseEnter = useCallback(() => {
  document.body.classList.add('no-scroll');
  setIsExpanded(true);
  setTimeout(() => {
    onExpand();
  }, 300); // Adjust this delay if needed
}, [onExpand]);

const handleMouseLeave = useCallback((event) => {
  const { clientX } = event;
  const rect = chartRef.current.getBoundingClientRect();
  if (clientX < rect.left) {
    document.body.classList.remove('no-scroll');
    setIsExpanded(false);
  }
}, []);

useEffect(() => {
  console.log('Setting up event listeners');
  const svgElement = chartRef.current;
  const legendElement = legendContainerRef.current;
  const tagsElement = tagsContainerRef.current;
  const searchBarElement = searchBarContainerRef.current;

  if (svgElement) {
    svgElement.addEventListener('mouseenter', handleMouseEnter);
    svgElement.addEventListener('mouseleave', handleMouseLeave);
  }

  if (legendElement) {
    legendElement.addEventListener('mouseenter', handleMouseEnter);
    legendElement.addEventListener('mouseleave', handleMouseLeave);
  }

  if (tagsElement) {
    tagsElement.addEventListener('mouseenter', handleMouseEnter);
    tagsElement.addEventListener('mouseleave', handleMouseLeave);
  }

  if (searchBarElement) {
    searchBarElement.addEventListener('mouseenter', handleMouseEnter);
    searchBarElement.addEventListener('mouseleave', handleMouseLeave);
  }

  return () => {
    if (svgElement) {
      svgElement.removeEventListener('mouseenter', handleMouseEnter);
      svgElement.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (legendElement) {
      legendElement.removeEventListener('mouseenter', handleMouseEnter);
      legendElement.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (tagsElement) {
      tagsElement.removeEventListener('mouseenter', handleMouseEnter);
      tagsElement.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (searchBarElement) {
      searchBarElement.removeEventListener('mouseenter', handleMouseEnter);
      searchBarElement.removeEventListener('mouseleave', handleMouseLeave);
    }
  };
}, [chartRef, legendContainerRef, tagsContainerRef, searchBarContainerRef, handleMouseEnter, handleMouseLeave]);

return (
  <div 
    id="tree-reference-graph"
    className={`tree-reference-graph ${isExpanded ? 'expanded' : 'collapsed'}`}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <div ref={legendContainerRef} className="legend-container">
      <div className="legend-item">
        <span className="bullet direct-reference"></span> direct reference
      </div>
      <div className="legend-item">
        <span className="bullet similar-themes"></span> similar themes
      </div>
    </div>
    <div ref={searchBarContainerRef}>
      <SearchBar
        query={state.searchQuery}
        results={state.searchResults}
        onQueryChange={handleQueryChange}
        onResultClick={handleResultClick}
      />
    </div>
    <svg ref={chartRef} onWheel={handleHoverCardWheel}>
      <ZoomableArea width={width} height={height} margin={margin} onZoom={setCurrentZoomState} zoomState={currentZoomState} />
    </svg>
    <div className="hover-card" ref={hoverCardRef} style={{ pointerEvents: 'auto', display: state.hoveredText ? 'block' : 'none' }}>
      {state.hoveredText ? console.log('Hover card displayed') : console.log('Hover card hidden')}
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
    <div className="tags-container" ref={tagsContainerRef}>
    <div className="tag-group tag-group-1">
{group1Tags.map((tag, index) => (
  <div
    key={index}
    className={`tag-item ${["prophetic/religious", "essay/treatise", "narrative"].includes(tag) ? "full-width" : ""}`}
  >
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
        <div className="select-buttons" style={{marginBottom: '5px'}}>
          <span>select disciplines: </span>
          <button onClick={handleSelectAllGroup2} style={{ fontSize: '12px', padding: '2px 6px', marginRight: '2px' }}>All</button>
          <button onClick={handleSelectNoneGroup2} style={{ fontSize: '12px', padding: '2px 6px' }}>None</button>
        </div>
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