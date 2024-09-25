import React, { useEffect, useRef, useReducer, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import '../components css/TreeReferenceGraph.css'; // Import the CSS file
import textsData from './datasets/formatted_data.json';
import directReferencesData from './datasets/direct_references.json';
import assumedInfluencesData from './datasets/assumed_influences.json';
import ZoomableArea from './ZoomableArea';
import SearchBar from './SearchBar'; // Import the SearchBar component
import { debounce } from 'lodash';

// Define the list of tags
const group1Tags = [
  "poetry", "dialogue", "novel", "play", "prophetic/religious", "essay/treatise", "narrative"
];

const group2Tags = [
  "theology", "philosophy", "logic", "rhetoric", "ethics", "metaphysics", "history", "natural sciences", "mathematics",
  "political science", "sociology", "psychology", "epistemology", "medicine", "economics", "education", "public relations", "law", "warfare", "strategy"
];

// Initial state for the reducer
const initialState = {
  hoveredText: null,
  referencingTitles: [],
  referencedTitles: [],
  selectedTags: [...group1Tags, ...group2Tags],
  searchQuery: '',
  searchResults: [],
  showDirectReferences: true,  // State to control direct references visibility
  showAssumedInfluences: false  // State to control assumed influences visibility
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
    case 'TOGGLE_DIRECT_REFERENCE':  // Toggle direct reference visibility
      return {
        ...state,
        showDirectReferences: !state.showDirectReferences,
      };
    case 'TOGGLE_ASSUMED_INFLUENCE': // Toggle assumed influence visibility
      return {
        ...state,
        showAssumedInfluences: !state.showAssumedInfluences,
      };
    default:
      return state;
  }
};

// ToggleSwitch component for selecting all/none tags in a group or for toggling references
const ToggleSwitch = ({ isAllSelected, onToggle }) => (
  <div className={`toggle-switch ${isAllSelected ? 'active' : ''}`} onClick={onToggle}>
    <div className="toggle"></div>
  </div>
);

const TreeReferenceGraph = () => {
  console.log('TreeReferenceGraph component rendered');
  const updateChartRef = useRef(null);
  const chartRef = useRef(null);         // Reference to the SVG element
  const hoverCardRef = useRef(null);     // Reference to the hover card element
  const textCardRef = useRef(null);      // Reference for the TextCard
  const tagsContainerRef = useRef(null);
  const legendContainerRef = useRef(null); // Reference to the tags container element
  const searchBarContainerRef = useRef(null); // Reference to the search bar container

  const [state, dispatch] = useReducer(reducer, initialState); // Use useReducer for state management
  const [currentZoomState, setCurrentZoomState] = useState(d3.zoomIdentity); // Zoom state
  const [adjustedData, setAdjustedData] = useState([]); // Adjusted data state
  const activeCircleIdRef = useRef(null);

  const margin = useMemo(() => ({ top: 0, right: 185, bottom: 20, left: 100 }), []); // Margin for the SVG
  const width = 1440 - margin.left - margin.right; // Calculate width
  const height = 620 - margin.top - margin.bottom; // Calculate height
  const [zoomTarget] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && state.hoveredText) {
        handleCloseHoverCard();
      }
    };

    // Attach the event listener when hover card is visible
    if (state.hoveredText) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when hover card is hidden or on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.hoveredText]); // Re-run the effect when hoveredText state changes
  
  const handleCloseHoverCard = () => {
    dispatch({ type: 'CLEAR_HOVERED_TEXT' });
  };

  // Handler functions for group1Tags
  const handleToggleGroup1 = () => {
    const allSelected = group1Tags.every(tag => state.selectedTags.includes(tag));
    const updatedTags = allSelected ? state.selectedTags.filter(tag => !group1Tags.includes(tag)) : [...new Set([...state.selectedTags, ...group1Tags])];
    dispatch({ type: 'SET_SELECTED_TAGS', payload: updatedTags });
  };

  // Handler functions for group2Tags
  const handleToggleGroup2 = () => {
    const allSelected = group2Tags.every(tag => state.selectedTags.includes(tag));
    const updatedTags = allSelected ? state.selectedTags.filter(tag => !group2Tags.includes(tag)) : [...new Set([...state.selectedTags, ...group2Tags])];
    dispatch({ type: 'SET_SELECTED_TAGS', payload: updatedTags });
  };

  // Toggle switch for Direct References and Assumed Influences
  const handleToggleDirectReferences = () => {
    dispatch({ type: 'TOGGLE_DIRECT_REFERENCE' });
  };

  const handleToggleAssumedInfluences = () => {
    dispatch({ type: 'TOGGLE_ASSUMED_INFLUENCE' });
  };

  const languages = useMemo(() => [
    'Japanese/Korean', 'Chinese/Thai', 'Sanskrit/Pali/Tibetan', 'Different Languages', 'Latin', 'Arabic', 'Greek', 'German', 'English', 'French', 'Italian/Spanish/Danish/Russian'
  ], []);

  const xScale = useMemo(() => d3.scaleLinear()
    .domain([-2000, 2024]) // Set the domain based on the year range
    .range([0, width]), [width]); // Set the range based on the width

  const yScale = useMemo(() => d3.scalePoint()
    .domain(languages) // Set the domain based on the languages
    .range([0, height]) // Set the range based on the height
    .padding(0.5), [languages, height]); // Add padding to ensure points are spaced correctly

  const getXPosition = (xScale, year) => xScale(year);

  const getYPosition = useCallback((yScale, language, adjustedAuthor) => {
    const yPos = yScale(language); // Get the y-position based on the language
    const segmentHeight = yScale.step(); // Get the step size of the y-scale
    const padding = segmentHeight * 0.1; // Padding to adjust the position within the segment

    let positionFactor = 0.5;
    if (adjustedAuthor && adjustedAuthor.length > 0) {
      const firstLetter = adjustedAuthor[0].toUpperCase();
      const normalizedValue = (firstLetter.charCodeAt(0) - 65) / 25;
      positionFactor = Math.min(Math.max(normalizedValue, 0), 1);
    }

    const finalYPos = yPos - segmentHeight / 2 + padding + positionFactor * (segmentHeight - 2 * padding);
    return finalYPos;
  }, []);

  const adjustForOverlap = useCallback((data, xScale) => {
    const radius = 0.5; // Radius of the circles
    const adjustedData = [...data]; // Create a copy of the data array to avoid mutating the original data
    const groupedData = d3.groups(adjustedData, d => `${d.year}-${d.author}`); // Group data points by year and author

    groupedData.forEach(([key, group]) => { // Iterate through each group of data points
      if (group.length > 1) { // If there are multiple data points in the same group (i.e., they overlap)
        group.forEach((d, i) => {
          const originalX = xScale(d.year);
          d.adjustedX = originalX + i * radius * 2;
          d.adjustedYear = xScale.invert(d.adjustedX);
        });
      } else {
        group[0].adjustedX = xScale(group[0].year);
        group[0].adjustedYear = group[0].year;
      }
    });

    return adjustedData;
  }, []);

  const data = useMemo(() => {
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
      link: d.link,
      tags: Array.isArray(d.tags) ? d.tags : (d.tags ? d.tags.split(',') : [])
    }));
  }, []);

  const initialAdjustedData = useMemo(() => {
    return adjustForOverlap(data, xScale);
  }, [data, xScale, adjustForOverlap]);

  const dataMap = useMemo(() => {
    return new Map(initialAdjustedData.map(d => [d.id, d]));
  }, [initialAdjustedData]);

  // Function to get border opacity based on zoom level
  const getBorderOpacity = (zoomScaleFactor) => {
    return Math.min(1, zoomScaleFactor * 0.5);
  };

  const handleZoomableAreaClick = () => {
    if (activeCircleIdRef.current !== null) {
      activeCircleIdRef.current = null;
      dispatch({ type: 'CLEAR_HOVERED_TEXT' });
    }
    // Make the textCard disappear by setting its display to 'none'
    if (textCardRef.current) {
      textCardRef.current.style.display = 'none';
    }
  };

  const applyZoom = useCallback(
    (zoomTransform, adjustedData, zoomTarget) => {
      if (zoomTransform && adjustedData) {
        console.log("Applying zoom...");

        if (zoomTransform.k === currentZoomState.k && zoomTarget === activeCircleIdRef.current) {
          console.log('Zoom already applied to the current target, skipping...');
          return; // Skip reapplying the same zoom
        }

        const svg = d3.select(chartRef.current).select('g');
        const newXScale = zoomTransform.rescaleX(xScale);

        const newYScaleRange = yScale.range().map((d) => zoomTransform.applyY(d));
        const newYScale = yScale.copy().range(newYScaleRange);

        const zoomScaleFactor = Math.max(zoomTransform.k, 1);

        svg.select('.x-axis').remove();
        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(newXScale).tickFormat((d) => (d < 0 ? `${Math.abs(d)} BC` : d)))
          .style('font-size', '14px')
          .selectAll('text')
          .style('font-family', 'Times New Roman, sans-serif');

        svg.select('.y-axis').remove();
        svg
          .append('g')
          .attr('class', 'y-axis')
          .attr('clip-path', 'url(#xAxisClip)')
          .call(d3.axisLeft(newYScale).tickSize(0).tickPadding(10))
          .selectAll('text')
          .style('font-family', 'Garamond, sans-serif')
          .style('font-size', '15px')
          .each(function () {
            const text = d3.select(this);
            const label = text.text();

            text.text('');

            if (label === 'Different Languages') {
              text.append('tspan').text('Different').attr('x', -10).attr('dy', '-0.3em');
              text.append('tspan').text('Languages').attr('x', -10).attr('dy', '1.2em');
            } else if (label === 'Italian/Spanish/Danish/Russian') {
              text.append('tspan').text('Italian Spanish').attr('x', -10).attr('dy', '-0.5em');
              text.append('tspan').text('Danish Russian').attr('x', -10).attr('dy', '1.2em');
            } else if (label === 'Japanese/Korean') {
              text.append('tspan').text('Japanese').attr('x', -10).attr('dy', '-0.5em');
              text.append('tspan').text('Korean').attr('x', -10).attr('dy', '1.2em');
            } else if (label === 'Chinese/Thai') {
              text.append('tspan').text('Chinese').attr('x', -10).attr('dy', '-0.5em');
              text.append('tspan').text('Thai').attr('x', -10).attr('dy', '1.2em');
            } else if (label === 'Sanskrit/Pali/Tibetan') {
              text.append('tspan').text('Sanskrit').attr('x', -10).attr('dy', '-1.0em');
              text.append('tspan').text('Pali').attr('x', -10).attr('dy', '1.2em');
              text.append('tspan').text('Tibetan').attr('x', -10).attr('dy', '1.2em');
            } else {
              text.text(label);
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

        svg.selectAll('circle')
          .data(adjustedData)
          .attr('cx', (d) => newXScale(d.adjustedYear || d.year))
          .attr('cy', (d) => getYPosition(newYScale, d.language, d.adjustedAuthor))
          .attr('r', (d) => {
            if (d.id === activeCircleIdRef.current) {
              return 10; // Larger radius for active circle
            }
            return Math.min(5, 2 * zoomScaleFactor); // Cap the radius at 5
          })
          .style('fill', (d) => (d.id === activeCircleIdRef.current ? '#ffcc00' : 'white'))
          .style('stroke', 'black')
          .style('stroke-opacity', (d) => getBorderOpacity(zoomScaleFactor));

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

            line.attr('x1', x1)
              .attr('y1', y1)
              .attr('x2', x2)
              .attr('y2', y2)
              .attr('stroke-opacity', activeCircleIdRef.current  && (sourceId === activeCircleIdRef.current  || targetId === activeCircleIdRef.current ) ? 0.9 : 0.05);
          }
        });

        if (textCardRef.current && textCardRef.current.style.display === 'block' && activeCircleIdRef.current ) {
          const targetCircle = adjustedData.find((d) => d.id === activeCircleIdRef.current);

          if (targetCircle) {
            // Apply zoom transformation to target circle position
            const adjustedCx = newXScale(targetCircle.adjustedYear || targetCircle.year);
            const adjustedCy = getYPosition(newYScale, targetCircle.language, targetCircle.adjustedAuthor);

            requestAnimationFrame(() => {
              const textCard = textCardRef.current;

              const textCardWidth = textCard.offsetWidth;
              const textCardHeight = textCard.offsetHeight;

              const svgRect = chartRef.current.getBoundingClientRect();
              const padding = 10;

              // Recalculate the position based on the adjusted circle position
              let leftPosition = adjustedCx - textCardWidth / 2 + 130;
              if (leftPosition < padding) {
                leftPosition = padding;
              } else if (leftPosition + textCardWidth > svgRect.width - padding) {
                leftPosition = svgRect.width - textCardWidth - padding;
              }

              let topPosition = adjustedCy + 40;
              if (topPosition + textCardHeight > svgRect.height - padding) {
                topPosition = adjustedCy - textCardHeight - 10;
              } else if (topPosition < padding) {
                topPosition = padding;
              }

              // Apply new positions to the textCard
              textCard.style.left = `${leftPosition}px`;
              textCard.style.top = `${topPosition}px`;

              console.log(`TextCard updated during zoom/drag: left = ${leftPosition}px, top = ${topPosition}px`);
            });
          }
        }

        // Update the current zoom state
        setCurrentZoomState(zoomTransform);
      }
    },
    [xScale, yScale, getYPosition, width, height, languages, dataMap, currentZoomState.k]
  );

  // Use useRef and useEffect to manage the debounced function
  const debouncedApplyZoomRef = useRef(null);

  useEffect(() => {
    debouncedApplyZoomRef.current = debounce((zoomTransform, adjustedData, zoomTarget) => {
      applyZoom(zoomTransform, adjustedData, zoomTarget);
    }, 100);

    // Cleanup function to cancel any pending debounced calls if the component unmounts
    return () => {
      if (debouncedApplyZoomRef.current) {
        debouncedApplyZoomRef.current.cancel();
      }
    };
  }, [applyZoom]);

  const updateChart = useCallback(() => {
    console.log("Updating the chart...");
    const svg = d3.select(chartRef.current).select('g');

    // Remove existing reference lines
    svg.selectAll('.reference-line').remove();

    // Determine which references to show
    let referencesData = [];
    if (state.showDirectReferences) {
      referencesData = referencesData.concat(directReferencesData);
    }
    if (state.showAssumedInfluences) {
      referencesData = referencesData.concat(assumedInfluencesData);
    }

    const referenceLines = svg.append('g')
      .attr('class', 'reference-lines')
      .attr('clip-path', 'url(#clip)');

    referencesData.forEach((ref) => {
      const sourceId = String(ref.primary_text);
      const targetId = String(ref.secondary_text);

      const source = dataMap.get(sourceId);
      const target = dataMap.get(targetId);

      if (source && target) {
        const color = ref.type_of_reference === 'direct reference' ? 'red' : 'blue';
        referenceLines.append('line')
          .attr('x1', getXPosition(xScale, source.adjustedYear || source.year))
          .attr('y1', getYPosition(yScale, source.language, source.adjustedAuthor))
          .attr('x2', getXPosition(xScale, target.adjustedYear || target.year))
          .attr('y2', getYPosition(yScale, target.language, target.adjustedAuthor))
          .attr('stroke', color)
          .attr('stroke-width', 1.4)
          .attr('stroke-opacity', 0.05)
          .attr('class', `reference-line reference-${source.id} reference-${target.id}`);
      }
    });

    // Redraw circles and other elements as needed
    svg.selectAll('circle').remove();

    const filteredData = state.selectedTags.length === 0 ? [] : data.filter(d => {
      const tagsArray = Array.isArray(d.tags) ? d.tags.map(tag => tag.trim().toLowerCase()) : d.tags.split(',').map(tag => tag.trim().toLowerCase());
      const hasMatchingTagGroup2 = state.selectedTags.some(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        return group2Tags.includes(tag) && tagsArray.includes(normalizedTag);
      });
      const hasMatchingTagGroup1 = state.selectedTags.some(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        return group1Tags.includes(tag) && tagsArray.includes(normalizedTag);
      });
      return hasMatchingTagGroup2 && hasMatchingTagGroup1;
    });

    const adjustedData = adjustForOverlap(filteredData, xScale);
    setAdjustedData(adjustedData);

    adjustedData.forEach(d => {
      const sourceReferences = referencesData.filter(ref => ref.primary_text === d.id);
      const targetReferences = referencesData.filter(ref => ref.secondary_text === d.id);

      sourceReferences.forEach(ref => {
        const target = dataMap.get(ref.secondary_text);
        if (target && adjustedData.includes(target)) {
          const color = ref.type_of_reference === 'direct reference' ? 'red' : 'blue';
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

      targetReferences.forEach(ref => {
        const source = dataMap.get(ref.primary_text);
        if (source && adjustedData.includes(source)) {
          const color = ref.type_of_reference === 'direct reference' ? 'red' : 'blue';
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

    const circlesGroup = svg.append('g')
      .attr('class', 'circles-group')
      .attr('clip-path', 'url(#clip)');

    circlesGroup.selectAll('circle')
      .data(adjustedData)
      .enter()
      .append('circle')
      .attr('id', d => `circle-${d.id}`)
      .attr('cx', d => d.adjustedX)
      .attr('cy', d => getYPosition(yScale, d.language, d.adjustedAuthor))
      .attr('r', d => {
        const zoomScaleFactor = Math.max(currentZoomState.k, 1);
        return Math.min(5, 2 * zoomScaleFactor);
      })
      .style('fill', 'white') // Keep fill color constant
      .style('stroke', 'black')
      .style('stroke-opacity', d => getBorderOpacity(Math.max(currentZoomState.k, 1))) // Adjust border opacity based on zoom
      .on('mouseover', (event, d) => {
        // Check if there is an active circle
        if (activeCircleIdRef.current && activeCircleIdRef.current !== d.id) {
          // Deactivate the currently active circle by resetting its styles
          const activeCircle = d3.select(`#circle-${activeCircleIdRef.current}`);
          if (!activeCircle.empty()) {
            activeCircle.style('fill', 'white').attr('r', Math.min(5, 2 * currentZoomState.k)); // Reset fill and radius
          }

          // Hide the currently displayed TextCard
          if (textCardRef.current) {
            textCardRef.current.style.display = 'none';
          }

          // Reset the opacity of any reference lines associated with the active circle
          d3.selectAll(`.reference-${activeCircleIdRef.current}`).attr('stroke-opacity', 0.05);
        }

        // Set the new active circle's ID
        activeCircleIdRef.current = d.id;

        // Highlight the reference lines associated with the new circle
        d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.9);

        // Change the fill and radius of the hovered circle
        d3.select(event.target).style('fill', '#ffcc00').attr('r', 10);

        // Check if the TextCard exists and proceed to display it
        if (textCardRef.current) {
          const textCard = textCardRef.current;

          // Step 1: Make the TextCard visible
          textCard.style.display = 'block';
          textCard.innerHTML = `<strong>${d.title}</strong>`;

          // Step 2: Force reflow
          void textCard.offsetWidth;

          // Step 3: Use requestAnimationFrame to ensure dimensions are updated
          requestAnimationFrame(() => {
            const cx = parseFloat(event.target.getAttribute('cx'));
            const cy = parseFloat(event.target.getAttribute('cy'));

            const textCardWidth = textCard.offsetWidth;
            const textCardHeight = textCard.offsetHeight;

            const svgRect = chartRef.current.getBoundingClientRect(); // Get SVG container boundaries
            const padding = 10; // Padding to prevent the TextCard from touching the edges

            // Calculate new left position and check for boundary overflow
            let leftPosition = cx - textCardWidth / 2 + 130;
            if (leftPosition < padding) {
              leftPosition = padding; // Ensure it doesn't overflow on the left
            } else if (leftPosition + textCardWidth > svgRect.width - padding) {
              leftPosition = svgRect.width - textCardWidth - padding; // Ensure it doesn't overflow on the right
            }

            // Calculate new top position and check for boundary overflow
            let topPosition = cy + 40;
            if (topPosition + textCardHeight > svgRect.height - padding) {
              topPosition = cy - textCardHeight - 10; // Position it above the circle if it's too low
            } else if (topPosition < padding) {
              topPosition = padding; // Prevent overflow at the top
            }

            // Apply calculated positions to the TextCard
            textCard.style.left = `${leftPosition}px`;
            textCard.style.top = `${topPosition}px`;
          });
        }
      })
      .on('mouseout', (event, d) => {
        d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.05);
        const zoomScaleFactor = Math.max(currentZoomState.k, 1);
        const radius = Math.min(5, 2 * zoomScaleFactor);
        d3.select(event.target)
          .style('fill', 'white')
          .attr('r', radius);

          activeCircleIdRef.current = null;

        if (textCardRef.current) {
          textCardRef.current.style.display = 'none';
        }
      })
      .on('click', (event, d) => {
        event.stopPropagation(); // Prevent click from propagating further

        // Highlight the reference lines when clicked
        d3.selectAll(`.reference-${d.id}`).attr('stroke-opacity', 0.9);

        // Fetch referencing and referenced texts (refs and refsBy)
        const refs = referencesData
          .filter(ref => ref.primary_text === d.id)
          .map(ref => ({
            ...dataMap.get(ref.secondary_text),
            referenceType: ref.type_of_reference,
          }))
          .filter(Boolean)
          .filter(text => adjustedData.some(dataItem => dataItem.id === text.id))
          .map(text => ({
            title: text.title,
            year: text.year,
            date: text.dateForCard,
            referenceType: text.referenceType,
          }))
          .sort((a, b) => a.year - b.year);

        const refsBy = referencesData
          .filter(ref => ref.secondary_text === d.id)
          .map(ref => ({
            ...dataMap.get(ref.primary_text),
            referenceType: ref.type_of_reference,
          }))
          .filter(Boolean)
          .filter(text => adjustedData.some(dataItem => dataItem.id === text.id))
          .map(text => ({
            title: text.title,
            year: text.year,
            date: text.dateForCard,
            referenceType: text.referenceType,
          }))
          .sort((a, b) => a.year - b.year);

        // Dispatch hovered text and references into the state for rendering in HoverCard
        dispatch({
          type: 'SET_HOVERED_TEXT',
          payload: { text: d, referencingTitles: refs, referencedTitles: refsBy },
        });

        // Delay execution to allow HoverCard to render
        setTimeout(() => {
          if (hoverCardRef.current) {
            const hoverCard = hoverCardRef.current;
            hoverCard.style.display = 'block'; // Show the HoverCard

            // Update the HoverCard content
            hoverCard.querySelector('.hover-card-main').innerHTML = `
              <p><span class="hover-card-title">${d.title}</span></p>
              <p><span>${d.author}</span></p>
              <p><span>${d.dateForCard}</span></p>
              <p><span>${d.oLanguage}</span></p>
              <p><span>${d.location}</span></p>
              <p><a href="${d.link}" target="_blank" class="download-link" style="color: blue;">download</a></p>
            `;
          } else {
            console.error('Hover card reference is null.');
          }
        }, 0); // Delay by 0ms to allow hoverCardRef to be updated

        // Handle click outside HoverCard to hide it
        const handleClickOutsideHoverCard = (e) => {
          if (
            hoverCardRef.current &&
            !hoverCardRef.current.contains(e.target) &&
            e.target !== event.target // Check if the click is not on the circle
          ) {
            dispatch({ type: 'CLEAR_HOVERED_TEXT' }); // Hide the HoverCard by clearing the hovered text
            document.removeEventListener('click', handleClickOutsideHoverCard); // Remove the event listener
          }
        };
        document.addEventListener('click', handleClickOutsideHoverCard);
      });

    svg.selectAll('.horizontal-line')
      .data([...languages.map(d => yScale(d) - yScale.step() / 2), height])
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
      .attr('clip-path', 'url(#xAxisClip)');

    return adjustedData;
  }, [adjustForOverlap, height, width, languages, currentZoomState, state.showAssumedInfluences, state.showDirectReferences, data, dataMap, getYPosition, state.selectedTags, xScale, yScale]);

  useEffect(() => {
    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    svg.append('defs')
      .append('clipPath')
      .attr('id', 'xAxisClip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('width', width + margin.left)
      .attr('height', height);

    updateChartRef.current = updateChart;
    const newAdjustedData = updateChart();
    setAdjustedData(newAdjustedData);

    applyZoom(d3.zoomIdentity, newAdjustedData);
  }, [height, margin.left, margin.right, margin.top, margin.bottom, width, xScale, yScale, applyZoom, updateChart]);

  useEffect(() => {
    if (updateChartRef.current) {
      updateChartRef.current();
    }
  }, [state.showDirectReferences, state.showAssumedInfluences]);

  useEffect(() => {
    applyZoom(currentZoomState, adjustedData);
  }, [currentZoomState, adjustedData, applyZoom]);

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

  useEffect(() => {
    const maxZoomLevel = 8; // Define max zoom level here
    if (zoomTarget !== null) {
      const updateChartPromise = new Promise((resolve) => {
        const newAdjustedData = updateChart();
        resolve(newAdjustedData);
      });

      updateChartPromise.then((newAdjustedData) => {
        const target = newAdjustedData.find((d) => d.id === zoomTarget);
        if (target) {
          const cx = xScale(target.adjustedYear || target.year);
          const cy = getYPosition(yScale, target.language, target.adjustedAuthor);
          const zoomTransform = d3.zoomIdentity
            .translate(width / 2 - cx * maxZoomLevel, height / 2 - cy * maxZoomLevel)
            .scale(maxZoomLevel);

          debouncedApplyZoomRef.current(zoomTransform, newAdjustedData, zoomTarget);
        }
      });
    }
  }, [zoomTarget, xScale, yScale, getYPosition, height, updateChart, width, applyZoom]);

  const handleResultClick = (result) => {
    const svg = d3.select(chartRef.current).select('g');
  
    // Reset the zoom to the default level (fully zoomed out)
    const defaultZoomTransform = d3.zoomIdentity; // Default zoom identity (no zoom applied)
  
    // Apply the default zoom transform first to reset the zoom
    applyZoom(defaultZoomTransform, adjustedData);
  
    // Use a small timeout to allow the zoom reset to apply before continuing
    setTimeout(() => {
      // After resetting the zoom, calculate the new zoom transform for the clicked result
      const maxZoomLevel = 8; // Example scale factor for maximum zoom
  
      // Find the circle after resetting the zoom
      const targetCircle = svg.select(`#circle-${result.id}`);
  
      if (!targetCircle.empty()) {
        // Get the position of the circle
        const cx = parseFloat(targetCircle.attr('cx'));
        const cy = parseFloat(targetCircle.attr('cy'));
  
        console.log(`Circle position: cx = ${cx}, cy = ${cy}`);
  
        // Now apply the zoom transform for the result
        const zoomTransform = d3.zoomIdentity
          .translate(width / 2 - cx * maxZoomLevel, height / 2 - cy * maxZoomLevel)
          .scale(maxZoomLevel);
  
        console.log(`Zooming in with transform: ${JSON.stringify(zoomTransform)}`);
  
        // Apply the zoom transform to zoom in on the circle
        applyZoom(zoomTransform, adjustedData);
  
        // After zooming in, trigger 'mouseover' event on the circle
        console.log('Triggering mouseover event');
        const event = new Event('mouseover');
        targetCircle.node().dispatchEvent(event);
  
        // Ensure TextCard is displayed after zoom
        requestAnimationFrame(() => {
          if (textCardRef.current) {
            const textCard = textCardRef.current;
  
            // Display and update the content of the TextCard
            textCard.style.display = 'block';
            textCard.innerHTML = `<strong>${result.title}</strong>`;
  
            // Get TextCard dimensions
            const textCardWidth = textCard.offsetWidth;
            const textCardHeight = textCard.offsetHeight;
  
            console.log(`TextCard size: width = ${textCardWidth}, height = ${textCardHeight}`);
  
            // Get the boundaries of the SVG container for proper positioning
            const svgRect = chartRef.current.getBoundingClientRect();
            const padding = 10; // Padding to prevent overflow
  
            // Adjust `cx` and `cy` based on the current zoom level
            const adjustedCx = zoomTransform.applyX(cx);
            const adjustedCy = zoomTransform.applyY(cy);
  
            // Calculate the left position, centering on the adjusted `cx`, and preventing overflow
            let leftPosition = adjustedCx - textCardWidth / 2 + 130;
            if (leftPosition < padding) {
              leftPosition = padding; // Prevent left overflow
            } else if (leftPosition + textCardWidth > svgRect.width - padding) {
              leftPosition = svgRect.width - textCardWidth - padding; // Prevent right overflow
            }
  
            // Calculate the top position, placing the TextCard below the adjusted circle, and ensuring no overflow
            let topPosition = adjustedCy + 40;
            if (topPosition + textCardHeight > svgRect.height - padding) {
              topPosition = adjustedCy - textCardHeight - 10; // Position above if it overflows below
            } else if (topPosition < padding) {
              topPosition = padding; // Prevent top overflow
            }
  
            // Apply calculated positions to the TextCard
            textCard.style.left = `${leftPosition}px`;
            textCard.style.top = `${topPosition}px`;
  
            console.log(`TextCard positioned at: left = ${leftPosition}px, top = ${topPosition}px`);
          }
        });
  
        // Clear search input and results after handling the click
        dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  
        // Corrected line: use `result` instead of `d`
        activeCircleIdRef.current = result.id;
      } else {
        console.log("Target circle not found for result:", result);
      }
    }, 200); // Adjust timeout duration as necessary to allow zoom reset to complete
  };
  

  return (
    <div id="tree-reference-graph" className="tree-reference-graph">
       <div className="hover-card" ref={hoverCardRef} style={{ pointerEvents: 'auto', display: state.hoveredText ? 'block' : 'none' }}>
  {state.hoveredText && (
    <>
      <button className="hover-card-close-button" onClick={handleCloseHoverCard}>x</button>
      <div className="hover-card-columns">
        {/* Column 1 */}
        <div className="hover-card-column">
          {state.referencedTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informed by:</strong></p>
              <ul>
                {state.referencedTitles.map((item, index) => (
                  <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'assumed-influence'}>
                    {item.title} ({item.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Column 2: Main Content */}
        <div className="hover-card-column">
          <div className="hover-card-main">
            <p><span className="hover-card-title">{state.hoveredText?.title}</span></p>
            <p><span>{state.hoveredText?.author}</span></p>
            <p><span>{state.hoveredText?.dateForCard}</span></p>
            <p><span>{state.hoveredText?.oLanguage}</span></p>
            <p><span>{state.hoveredText?.location}</span></p>
          </div>
        </div>

        {/* Column 3 */}
        <div className="hover-card-column">
          {state.referencingTitles.length > 0 && (
            <div className="hover-card-section">
              <p><strong>Informs:</strong></p>
              <ul>
                {state.referencingTitles.map((item, index) => (
                  <li key={index} className={item.referenceType === 'direct reference' ? 'direct-reference' : 'assumed-influence'}>
                    {item.title} ({item.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
<div className={`main-content ${state.hoveredText ? 'blurred' : ''}`}>
      <div ref={textCardRef} className="text-card" />
      <div ref={legendContainerRef} className="legend-container">
        <div className="legend-item">
          <span>Show Direct Reference</span>
          <ToggleSwitch isAllSelected={state.showDirectReferences} onToggle={handleToggleDirectReferences} />
        </div>
        <div className="legend-item">
          <span>Show Assumed Influence</span>
          <ToggleSwitch isAllSelected={state.showAssumedInfluences} onToggle={handleToggleAssumedInfluences} />
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
      <svg ref={chartRef}>
        <ZoomableArea
          width={width}
          height={height}
          margin={margin}
          onZoom={setCurrentZoomState}
          zoomState={currentZoomState}
          onClick={handleZoomableAreaClick}
        />
      </svg>

     

      <div className="tags-container" ref={tagsContainerRef}>
        <h2>Literary Forms</h2>
        <div className="toggle-container">
          <span>Select all</span>
          <ToggleSwitch
            isAllSelected={group1Tags.every(tag => state.selectedTags.includes(tag))}
            onToggle={handleToggleGroup1}
          />
        </div>
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
                checked={state.selectedTags.includes(tag)}
                onChange={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })}
              />
              <label htmlFor={`tag-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>

        <h2>Disciplines</h2>
        <div className="toggle-container">
          <span>Select all</span>
          <ToggleSwitch
            isAllSelected={group2Tags.every(tag => state.selectedTags.includes(tag))}
            onToggle={handleToggleGroup2}
          />
        </div>
        <div className="tag-group tag-group-2">
          {group2Tags.map((tag, index) => (
            <div key={index} className="tag-item">
              <input
                type="checkbox"
                id={`tag-${tag}`}
                value={tag}
                checked={state.selectedTags.includes(tag)}
                onChange={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })}
              />
              <label htmlFor={`tag-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default TreeReferenceGraph;
