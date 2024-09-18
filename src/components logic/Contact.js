import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import '../components css/Contact.css';

// Helper function to calculate the distance between two lat/lng points using Haversine formula
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = degrees => degrees * (Math.PI / 180);
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to get border opacity based on zoom level, same as TreeReferenceGraph.js
const getBorderOpacity = (zoomScaleFactor) => {
  return Math.min(1, zoomScaleFactor * 0.5); // Adjust this factor to control opacity change
};

// UserCard component to display user details on hover
const UserCard = ({ data, position }) => {
  if (!data) return null;
  return (
    <div className="user-card" style={{ top: position.y, left: position.x, position: 'absolute' }}>
      <p><strong>{data.name}</strong></p>
      <p>Email: {data.email}</p>
      <p><a href={data.url} target="_blank" rel="noopener noreferrer">{data.url}</a></p>
    </div>
  );
};

function Contact() {
  const svgRef = useRef();
  const zoomScaleRef = useRef(1); // Initialize zoom scale at 1
  const [hoveredData, setHoveredData] = useState(null); // Track hovered data
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); // Track hover position

  // Memoized function to set up the projection and path generator
  const renderGlobe = useMemo(() => {
    const initialScale = 250;  // Default size of the globe
    const initialRotation = [0, 0];  // Default rotation angle [longitude, latitude]

    console.log('Setting up projection and path generators');

    // Orthographic projection for a globe-like view
    const projection = geoOrthographic()
      .scale(initialScale * zoomScaleRef.current) // Initialize projection scale with zoomScaleRef.current
      .translate([300, 300]) // Center the globe
      .rotate(initialRotation); // Initial rotation [longitude, latitude]

    const path = geoPath(projection); // Path generator for drawing the globe

    return { projection, path };
  }, []);

  // Function to check if a point is close enough to the center of the globe
  const isPointCloseToCenter = (lat, lng, name, projection, maxDistance = 10000) => {
    const [rotationLng, rotationLat] = projection.rotate();
  
    // Since the latitude and longitude are flipped in rotation, adjust accordingly.
    const centerLng = -rotationLng;  // Longitude in geographic terms
    const centerLat = -rotationLat;  // Latitude in geographic terms
  
    console.log(`Checking visibility for: ${name}`);
    console.log(`Center of Globe (Rotation) - Longitude: ${centerLng}, Latitude: ${centerLat}`);
  
    // Log the latitude and longitude of the current data point (New York, London, Tokyo)
    console.log(`${name} - Latitude: ${lat}, Longitude: ${lng}`);
  
    // Calculate the distance between the adjusted center point and the data point using the Haversine formula
    const distance = haversineDistance(centerLat, centerLng, lat, lng);
    console.log(`Distance from Center (${centerLat}, ${centerLng}) to ${name} (${lat}, ${lng}): ${distance.toFixed(2)} km`);
  
    // Render the point only if it's within the maxDistance threshold
    const isCloseEnough = distance <= maxDistance;
    console.log(`${name} is ${isCloseEnough ? "visible" : "not visible"} (Distance: ${distance.toFixed(2)} km)\n`);
    
    return isCloseEnough;
  };

  // Function to render circles (user data points)
  const renderCircles = useCallback((projection, zoomScale = 1) => {
    console.log('Rendering user points (circles) with zoomScale:', zoomScale);

    const [rotationLng, rotationLat] = projection.rotate();
    console.log(`Current Center Point of Globe - Longitude: ${rotationLng}, Latitude: ${rotationLat}`);

    const userData = [
      { lat: 40.7128, lng: -74.0060, name: 'New York User', email: 'nyuser@example.com', url: 'https://nyuser.com' },
      { lat: 51.5074, lng: -0.1278, name: 'London User', email: 'ldnuser@example.com', url: 'https://ldnuser.com' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo User', email: 'tokyousr@example.com', url: 'https://tokyousr.com' }
    ];

    console.log('Original User Data:', userData);

    // Filter userData based on their distance to the center of the globe
    const visibleData = userData.filter(d => isPointCloseToCenter(d.lat, d.lng, d.name, projection));

    console.log('Filtered Visible User Data:', visibleData);

    // Determine zoom scale factor for circles similar to TreeReferenceGraph.js
    const zoomScaleFactor = Math.max(zoomScale, 1);  // Ensure zoom factor is at least 1
    const circleRadius = Math.min(5, 2 * zoomScaleFactor);  // Cap the radius at 5
    const borderOpacity = getBorderOpacity(zoomScaleFactor); // Use the same function to calculate opacity

    console.log('Zoom scale factor:', zoomScaleFactor, 'Circle radius:', circleRadius, 'Border opacity:', borderOpacity);

    // Remove old circles before rendering new ones
    d3.select(svgRef.current).selectAll('circle').remove();

    // Append circles to represent user locations on the globe
    d3.select(svgRef.current)
      .selectAll('circle')
      .data(visibleData, d => `${d.lat}-${d.lng}`) // Use unique key for each circle
      .enter()
      .append('circle')
      .attr('cx', d => projection([d.lng, d.lat])[0])  // X position based on longitude
      .attr('cy', d => projection([d.lng, d.lat])[1])  // Y position based on latitude
      .attr('r', circleRadius)  // Adjust circle radius dynamically based on zoom scale
      .attr('fill', '#ffffff')  // White circles for points
      .attr('stroke', '#000000')  // Black border around circles
      .attr('stroke-opacity', borderOpacity)  // Use getBorderOpacity to control border opacity
      .attr('opacity', 1)  // Render circles that passed visibility check
      .on('mouseover', function (event, d) {
        const [mouseX, mouseY] = d3.pointer(event);
        setHoverPosition({ x: mouseX + 10, y: mouseY + 10 });  // Adjust the hover card position
        setHoveredData(d);  // Set hovered data for the UserCard

        d3.select(this)
          .attr('r', 10)  // Increase radius on hover
          .attr('fill', '#ffcc00');  // Change color to yellow
        console.log('Hovered over:', d.name);  // Log user name on hover
      })
      .on('mouseout', function () {
        setHoveredData(null);  // Remove the UserCard on mouse out

        d3.select(this)
          .attr('r', circleRadius)  // Reset radius on mouse out
          .attr('fill', '#ffffff');  // Revert to white
      })
      .on('click', function (event, d) {
        window.open(d.url, '_blank');  // Open user's URL in a new tab on click
      });

    console.log(`Rendered ${visibleData.length} visible circles.`);
  }, []);

  // Static rendering of globe elements (globe outline, landmasses)
  const renderStaticElements = useCallback(() => {
    const { projection, path } = renderGlobe;

    console.log('Starting to render static elements such as the globe and landmasses');
    console.log('Fetching world data from ./datasets/110m.json');

    // Fetch the local world landmass data (110m.json)
    d3.json('/datasets/110m.json') // Adjusted fetch path to assume file is in the public folder
      .then(worldData => {
        console.log('Fetched data:', worldData); // Log the fetched data to see what we received
        if (!worldData || !worldData.objects || !worldData.objects.land) {
          throw new Error("Invalid world data structure");
        }

        const land = topojson.feature(worldData, worldData.objects.land);

        // Append a path to the SVG to represent the globe outline
        d3.select(svgRef.current)
          .append('path')
          .datum({ type: 'Sphere' })  // Draw the full globe
          .attr('d', path)
          .attr('fill', '#ffffff')  // White color for oceans
          .attr('stroke', '#d3d3d3') // Gray outline for the globe
          .attr('stroke-width', 2);  // Thickness of the outline

        // Draw the landmasses on the globe using the local data
        d3.select(svgRef.current)
          .append('path')
          .datum(land)
          .attr('d', path)
          .attr('fill', '#d3d3d3')  // Gray landmass
          .attr('stroke', '#ffffff')  // White outline for landmasses
          .each(() => console.log('Land parts (landmasses) rendered'));

        // Render user data points last to ensure they are on top
        renderCircles(projection, zoomScaleRef.current);
      })
      .catch(error => {
        console.error('Error fetching the world data:', error); // Log the error
      });
  }, [renderGlobe, renderCircles]);

  // Zoom handling (only zooms in and out, doesn't interfere with rotation)
  const applyZoom = useCallback(() => {
    const { projection, path } = renderGlobe;

    console.log('Applying zoom behavior');

    // d3 zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])  // Set zoom limits
      .on('zoom', (event) => {
        console.log('Zooming... Scale:', event.transform.k);  // Log zoom level

        // Update the stored zoom scale for dragging
        zoomScaleRef.current = event.transform.k;

        projection.scale(event.transform.k * 250);  // Update projection scale
        d3.select(svgRef.current).selectAll('path').attr('d', path);  // Redraw paths (globe and landmasses)

        // Re-render the circles with adjusted radius based on zoom scale
        renderCircles(projection, event.transform.k);
      });

    // Apply zoom behavior to the SVG without handling drag
    d3.select(svgRef.current).call(zoom).on('mousedown.zoom', null); // Disable drag on zoom
  }, [renderGlobe, renderCircles]);

  // Drag (rotation) handling
  const applyDrag = useCallback(() => {
    const { projection, path } = renderGlobe;

    console.log('Applying drag (rotation) behavior');

    // d3 drag behavior
    const drag = d3.drag()
      .on('start', () => {
        console.log('Drag started');  // Log when drag starts
      })
      .on('drag', (event) => {
        const rotate = projection.rotate();  // Get current rotation values
        console.log('Dragging... dx:', event.dx, 'dy:', event.dy);  // Log drag deltas (how much we move)

        // Update the rotation based on drag movement
        projection.rotate([rotate[0] + event.dx / 4, rotate[1] - event.dy / 4]);

        // Redraw the globe and landmasses with the new rotation
        d3.select(svgRef.current).selectAll('path').attr('d', path);

        // Re-render the circles, keeping their size consistent using the stored zoom scale
        renderCircles(projection, zoomScaleRef.current);
      });

    // Apply drag behavior to the SVG
    d3.select(svgRef.current).call(drag);
  }, [renderGlobe, renderCircles]);

  // Use useEffect to render static elements when the component mounts
  useEffect(() => {
    renderStaticElements();  // Call static element rendering
  }, [renderStaticElements]);

  // Apply zoom behavior once the static elements are rendered
  useEffect(() => {
    applyZoom();  // Apply zoom functionality
  }, [applyZoom]);

  // Apply drag behavior once the static elements are rendered
  useEffect(() => {
    applyDrag();  // Apply drag functionality
  }, [applyDrag]);

  return (
    <div className="globe-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} width="600" height="600"></svg>
      {/* Render UserCard on hover */}
      <UserCard data={hoveredData} position={hoverPosition} />
    </div>
  );
}

export default Contact;
