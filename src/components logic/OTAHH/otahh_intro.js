import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import '../../components css/otahh_intro.css';

// Sample JSON dataset
const dataset = [
  {
    "Index": 1,
    "Author/Text Title": "Herodotus",
    "Sources": "The Histories",
    "Timeline": [-700, -425], // 700 BCE to 425 BCE
    "Geography": ["Greece", "Turkey", "Iran", "Iraq", "Lebanon", "Syria", "Israel", "Palestine", "Jordan",
    "Egypt", "Libya", "Ukraine", "Southern Russia", "Kazakhstan", "Bulgaria", "Italy", "India",
    "Saudi Arabia", "Oman", "Yemen", "United Arab Emirates", "Georgia", "Armenia",
    "Azerbaijan", "Ethiopia"]
  },
  {
    "Index": 2,
    "Author/Text Title": "Titus Livius (Livy)",
    "Sources": "Ab Urbe Condita",
    "Timeline": [-753, -9], // 753 BCE to 9 BCE
    "Geography": "Italy"
  },
  // Add other entries here...
];

function OtahhIntro() {
  const [selectedAuthor, setSelectedAuthor] = useState(dataset[0]); // Set the initial author/text
  const svgRef = useRef();
  const zoomScaleRef = useRef(1); // Initialize zoom scale at 1
  const timelineRef = useRef(); // Reference for the timeline SVG

  // Memoized function to set up the projection and path generator
  const renderGlobe = useMemo(() => {
    const initialScale = 200;  // Default size of the globe
    const initialRotation = [0, 0];  // Default rotation angle [longitude, latitude]

    const projection = geoOrthographic()
      .scale(initialScale * zoomScaleRef.current)
      .translate([300, 300]) // Center the globe
      .rotate(initialRotation); // Initial rotation [longitude, latitude]

    const path = geoPath(projection);

    return { projection, path };
  }, []);

  // Static rendering of globe elements (globe outline, landmasses)
  const renderStaticElements = useCallback(() => {
    const { path } = renderGlobe;
  
    d3.json('/datasets/110m.json')
      .then(worldData => {
        console.log('World Data Loaded:', worldData); // Log the fetched data
        if (!worldData || !worldData.objects || !worldData.objects.countries) {
          console.error('Invalid world data structure:', worldData);
          return;
        }
  
        const land = topojson.feature(worldData, worldData.objects.countries); // Corrected reference to 'countries'
  
        // Append the globe sphere with a grey outline
        d3.select(svgRef.current)
          .append('path')
          .datum({ type: 'Sphere' })
          .attr('d', path)
          .attr('fill', '#ffffff')
          .attr('stroke', '#d3d3d3')  // Grey outline
          .attr('stroke-width', 2);    // Set stroke width for globe outline
  
        // Append the landmasses without stroke (no borders for countries)
        d3.select(svgRef.current)
          .append('path')
          .datum(land)
          .attr('d', path)
          .attr('fill', '#d3d3d3');    // Fill countries with grey
      })
      .catch(error => console.error('Error fetching world data:', error));
  }, [renderGlobe]);
  
  

  const applyZoom = useCallback(() => {
    const { projection, path } = renderGlobe;

    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])  
      .on('zoom', (event) => {
        zoomScaleRef.current = event.transform.k;
        projection.scale(event.transform.k * 250);
        d3.select(svgRef.current).selectAll('path').attr('d', path);
      });

    d3.select(svgRef.current).call(zoom).on('mousedown.zoom', null);
  }, [renderGlobe]);

  const applyDrag = useCallback(() => {
    const { projection, path } = renderGlobe;

    const drag = d3.drag()
      .on('drag', (event) => {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + event.dx / 4, rotate[1] - event.dy / 4]);
        d3.select(svgRef.current).selectAll('path').attr('d', path);
      });

    d3.select(svgRef.current).call(drag);
  }, [renderGlobe]);

  // Function to render the timeline with highlighted period
  const renderTimeline = useCallback(() => {
    const width = 1400;
    const height = 100;

    const svg = d3.select(timelineRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear previous elements
    svg.selectAll("*").remove();

    // Define the time scale: 6000 BC to 2025 CE
    const xScale = d3.scaleLinear()
      .domain([-6000, 2025]) // 6000 BC to 2025 CE
      .range([50, width - 50]); // Leave padding on both sides

    // Create the axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10) // Show 10 major ticks
      .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`)); // Format BC and CE dates

    // Append the axis to the timeline
    svg.append("g")
      .attr("transform", `translate(0, ${height - 20})`) // Position the axis at the bottom
      .call(xAxis)
      .style('font-size', '14px')
      .selectAll('text')
      .style('font-family', 'Times New Roman, sans-serif');

    // Highlight the selected period
    const [startYear, endYear] = selectedAuthor.Timeline;

    svg.append("rect")
      .attr("x", xScale(startYear))
      .attr("y", 10)
      .attr("width", xScale(endYear) - xScale(startYear))
      .attr("height", height - 30)
      .attr("fill", "red")
      .attr("opacity", 0.5);
  }, [selectedAuthor]);

  // Function to highlight relevant geography on the globe
  const highlightGeography = useCallback(() => {
    const { projection, path } = renderGlobe;
  
    d3.json('/datasets/110m.json') // Load modern country borders
      .then(worldData => {
        console.log("World data loaded for modern countries:", worldData);
  
        const land = topojson.feature(worldData, worldData.objects.countries);
  
        // Highlight regions based on the selected author's Geography
        d3.select(svgRef.current).selectAll('path.land')
          .data(land.features)
          .join('path')
          .attr('d', path)
          .attr('class', 'land')
          .attr('fill', d => {
            const countryName = d.properties.name;
            const isHighlighted = selectedAuthor.Geography.includes(countryName);
            return isHighlighted ? 'red' : '#d3d3d3'; // Highlight selected countries in red
          })
          .raise(); // Bring highlighted countries to the front
      })
      .catch(error => console.error('Error loading world data:', error));
  }, [renderGlobe, selectedAuthor]);
  
  
  
  

  // Function to handle change in dropdown selection
  const handleAuthorChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedAuthor(dataset[selectedIndex]);
  };

  useEffect(() => {
    renderStaticElements();
    applyZoom();
    applyDrag();
  }, [renderStaticElements, applyZoom, applyDrag]);

  useEffect(() => {
    renderTimeline(); // Re-render timeline when selectedAuthor changes
    highlightGeography(); // Re-render geography highlights when selectedAuthor changes
  }, [renderTimeline, highlightGeography]);

  return (
    <div>
      <div className="dropdown-container">
        <label htmlFor="author-select">History according to: </label>
        <select id="author-select" onChange={handleAuthorChange}>
          {dataset.map((author, index) => (
            <option key={index} value={index}>
              {author["Author/Text Title"]}
            </option>
          ))}
        </select>
      </div>

      <div className="globe-container" style={{ position: 'relative' }}>
        {/* Globe SVG */}
        <svg ref={svgRef} className="otahh-globe" width="600" height="600"></svg>
      </div>

      {/* Timeline SVG (moved outside the globe container) */}
      <div style={{ marginTop: '20px' }}>
        <svg ref={timelineRef} className="timeline"></svg>
      </div>
    </div>
  );
}

export default OtahhIntro;
