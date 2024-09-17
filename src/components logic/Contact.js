import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import '../components css/Contact.css';

function Contact() {
  const svgRef = useRef();

  // Initial settings for rotation and scale
  const initialScale = 250;
  const initialRotation = [0, 0];

  // Memoized static elements (the globe outline, landmass, and user data points)
  const renderGlobe = useMemo(() => {
    const projection = geoOrthographic()
      .scale(initialScale)
      .translate([300, 300]) // Center the globe
      .rotate(initialRotation);

    const path = geoPath(projection);

    return {
      projection,
      path,
    };
  }, [initialScale, initialRotation]);

  // Static rendering of the globe elements
  const renderStaticElements = useCallback(() => {
    const { projection, path } = renderGlobe;

    // Fetch and render the globe's landmasses
    d3.json('https://d3js.org/world-110m.v1.json').then(worldData => {
      const land = topojson.feature(worldData, worldData.objects.land);

      // Draw the globe outline
      d3.select(svgRef.current)
        .append('path')
        .datum({ type: 'Sphere' }) // Sphere object defines the entire globe
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#000000') // Black outline for the globe
        .attr('stroke-width', 2);

      // Draw the landmasses on the globe
      d3.select(svgRef.current)
        .append('path')
        .datum(land)
        .attr('d', path)
        .attr('fill', '#000000') // Black land color
        .attr('stroke', '#ffffff'); // White outline for the landmasses

      // Render user data points
      const userData = [
        { lat: 40.7128, lng: -74.0060, name: 'New York User', email: 'nyuser@example.com', url: 'https://nyuser.com' },
        { lat: 51.5074, lng: -0.1278, name: 'London User', email: 'ldnuser@example.com', url: 'https://ldnuser.com' },
        { lat: 35.6762, lng: 139.6503, name: 'Tokyo User', email: 'tokyousr@example.com', url: 'https://tokyousr.com' }
      ];

      d3.select(svgRef.current)
        .selectAll('circle')
        .data(userData)
        .enter()
        .append('circle')
        .attr('cx', d => projection([d.lng, d.lat])[0])
        .attr('cy', d => projection([d.lng, d.lat])[1])
        .attr('r', 5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#000000')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', '#ffcc00');
          console.log('Hovered over:', d.name);
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#ffffff');
        })
        .on('click', function (event, d) {
          window.open(d.url, '_blank');
        });
    });
  }, [renderGlobe]);

  // Zoom and drag handling
  const applyZoomAndDrag = useCallback(() => {
    const { projection, path } = renderGlobe;

    // Handle zoom
    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        console.log('Zooming...', event.transform.k);
        projection.scale(event.transform.k * initialScale);
        d3.select(svgRef.current).selectAll('path').attr('d', path);
        d3.select(svgRef.current).selectAll('circle')
          .attr('cx', d => projection([d.lng, d.lat])[0])
          .attr('cy', d => projection([d.lng, d.lat])[1]);
      });

    // Handle dragging (rotation)
    const drag = d3.drag()
      .on('start', () => {
        console.log('Drag started');
      })
      .on('drag', (event) => {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + event.dx / 4, rotate[1] - event.dy / 4]);
        d3.select(svgRef.current).selectAll('path').attr('d', path);
        d3.select(svgRef.current).selectAll('circle')
          .attr('cx', d => projection([d.lng, d.lat])[0])
          .attr('cy', d => projection([d.lng, d.lat])[1]);
      });

    // Apply zoom and drag to the SVG
    d3.select(svgRef.current).call(zoom).call(drag);
  }, [renderGlobe]);

  // Run the static rendering once when the component mounts
  useEffect(() => {
    renderStaticElements();
  }, [renderStaticElements]);

  // Apply zoom and drag behavior
  useEffect(() => {
    applyZoomAndDrag();
  }, [applyZoomAndDrag]);

  return (
    <div className="globe-container">
      <svg ref={svgRef} width="600" height="600"></svg>
    </div>
  );
}

export default Contact;
