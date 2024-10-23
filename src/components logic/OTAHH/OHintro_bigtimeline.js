import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../../components css/OHintro_bigtimeline.css';

const OhIntroTimeline = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    // Clear the SVG if it already exists
    d3.select(timelineRef.current).select('svg').remove();

    // Set up the SVG canvas dimensions
    const width = 1350;
    const height = 400; // Increased height to accommodate labels above and below
    

    // Create an SVG element
    const svg = d3
      .select(timelineRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'svgtimeline');

      svg.append('text')
      .attr('x', -height / 5) // Position it horizontally
      .attr('y', -50) // Position it vertically near the top
      .attr('transform', 'rotate(-90)') // Rotate it vertically
      .attr('text-anchor', 'middle') // Center the text
      .style('font-size', '20px') // Adjust the font size
      .style('fill', 'black') // Text color
      .text('HISTORY'); // The label text

    // Add the vertical "PREHISTORY" label below the timeline
    svg.append('text')
      .attr('x', -height ) // Position it horizontally, further down
      .attr('y', -50) // Position it vertically near the bottom
      .attr('transform', 'rotate(-90)') // Rotate it vertically
      .attr('text-anchor', 'middle') // Center the text
      .style('font-size', '20px') // Adjust the font size
      .style('fill', 'black') // Text color
      .text('PREHISTORY'); // The label text

 
   
      // Define a linear scale for the timeline (to represent large timespans)
    const xScale = d3
      .scaleLinear()
      .domain([-13.8e9, 2025]) // Domain spans from the Big Bang (-13.8 billion years) to 2025
      .range([0, width]); // Full width of the timeline

    // Add a bottom axis with 3 ticks (using .ticks(0))
    const xAxis = d3.axisBottom(xScale).ticks(0); // No ticks needed here

    // 1. Render the x-axis (timeline) first
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 2})`) // Center the timeline
      .call(xAxis)
      .selectAll('path')  // Select the line (path) of the axis
      .attr('stroke-width', 1.5); // Adjust the stroke width here

    // 2. Create a group to contain the circles, lines, and labels
    const chartGroup = svg.append('g');

    // Define categories and their colors
    const categories = [
      {
        name: 'Very Early Universe',
        yearsLabel: ["13.8 Billion BCE", "13.65 Billion BCE"],
        startYear: -13.8e9,
        endYear: -13.79962e9,  // 380,000 years after the Big Bang
        color: '#e74c3c', // Red
        customInfo: "Planck Epoch (0 to 10^-43 seconds)"
      },
      {
        name: 'Dark Ages',
        startYear: -13.79962e9,
        endYear: -13.65e9,  // 150 million years after the Big Bang
        color: '#2ecc71', // Green
      },
      {
        name: 'Cosmic Dawn',
        startYear: -13.65e9,  // 150 million years after the Big Bang
        endYear: -12.8e9,     // 1 billion years after the Big Bang
        color: '#3498db', // Blue
      },
      {
        name: 'Galaxy Formation Era',
        startYear: -12.8e9,   // 1 billion years after the Big Bang
        endYear: -8.8e9,      // 5 billion years after the Big Bang
        color: '#f39c12', // Orange
      },
      {
        name: 'Solar System Formation',
        startYear: -9.2e9,   // 9.2 billion years after the Big Bang
        endYear: -4.5e9,     // Formation of Solar System
        color: '#9b59b6', // Purple
      },
      {
        name: 'Hadean',
        startYear: -4.5e9,  // 4.6 billion years ago
        endYear: -4.0e9,    // 4.0 billion years ago
        color: '#e74c3c', // Red
      },
      {
        name: 'Archean',
        startYear: -4.0e9,  // 4.0 billion years ago
        endYear: -2.5e9,    // 2.5 billion years ago
        color: '#2ecc71', // Green
      },
      {
        name: 'Proterozoic',
        startYear: -2.5e9,  // 2.5 billion years ago
        endYear: -541e6,    // 541 million years ago
        color: '#3498db', // Blue
      },
      {
        name: 'Phanerozoic',
        startYear: -541e6,  // 541 million years ago
        endYear: -300000,      // Present (or near future)
        color: '#f39c12', // Orange
      },
      {
        name: 'Phanerozoic',
        startYear: -300000,  // 541 million years ago
        endYear: 2025,      // Present (or near future)
        color: '#f39c12', // Orange
      },
      {
        name: 'Paleolithic',
        startYear: -3.4e6,   // 3.4 million years ago
        endYear: -300000,     // 11,700 years ago
        color: '#e74c3c', // Red
      },
      {
        name: 'Paleolithic',
        startYear: -300000,   // 3.4 million years ago
        endYear: -11700,     // 11,700 years ago
        color: '#e74c5c', // Red
      },

      {
        name: 'Mesolithic',
        startYear: -11700,   // 11,700 years ago
        endYear: -8000,      // 8,000 years ago
        color: '#2ecc71', // Green
      },
      {
        name: 'Neolithic',
        startYear: -8000,    // 8,000 BCE
        endYear: -3300,      // 3,300 BCE
        color: '#3498db', // Blue
      },
      {
        name: 'Bronze Age',
        startYear: -3300,    // 3,300 BCE
        endYear: -1200,      // 1,200 BCE
        color: '#f39c12', // Orange
      },
      {
        name: 'Iron Age',
        startYear: -1200,    // 1,200 BCE
        endYear: 500,        // 500 CE
        color: '#9b59b6', // Purple
      },
      {
        name: 'Middle Ages',
        startYear: 500,      // 500 CE
        endYear: 1500,       // 1500 CE
        color: '#e67e22', // Dark Orange
      },
      {
        name: 'Early Modern Period',
        startYear: 1500,     // 1500 CE
        endYear: 1800,       // 1800 CE
        color: '#1abc9c', // Teal
      },
      {
        name: 'Modern Era',
        startYear: 1800,     // 1800 CE
        endYear: 2025,       // Present
        color: '#34495e', // Dark Blue
      },
      {
        name: 'Industrial Age',
        startYear: 1760,     // 1760 CE
        endYear: 1970,       // 1970 CE
        color: '#f1c40f', // Yellow
      },
      {
        name: 'Information Age',
        startYear: 1970,     // 1970 CE
        endYear: 2025,       // Present
        color: '#95a5a6', // Gray
      }
    ];
    

    // Add rectangles for each category
    const renderCategories = (scale, currentZoomTransform = { k: 1, x: 0, y: 0 }) => {
      // Clear previous categories
      chartGroup.selectAll('rect').remove();
      
      // Define the clipping boundaries based on the width of the timeline
      const timelineStart = 0;  // Left boundary of the timeline (x = 0)
      const timelineEnd = width;  // Right boundary of the timeline
  
      // Render each category as a rectangle
      chartGroup
          .selectAll('rect')
          .data(categories)
          .enter()
          .append('rect')
          .attr('x', (d) => {
            // Calculate the start and end of the category in x-coordinates
            const startX = scale(d.startYear);
            return Math.max(startX, timelineStart);
          })
          .attr('width', (d) => {
            const startX = scale(d.startYear);
            const endX = scale(d.endYear);
            const clippedEnd = Math.min(endX, timelineEnd);
            const clippedStart = Math.max(startX, timelineStart);
            return Math.max(clippedEnd - clippedStart, 0);  // Ensure no negative widths
          })
          .attr('y', (d) => d.startYear < -300000 ? height / 2 : height / 2 - 205) // Below or above the x-axis
          .attr('height', (d) => d.startYear < -300000 ? 400 : 205)
          .attr('fill', (d) => d.color) // Color for each segment
          .attr('opacity', 0.3) // Slightly transparent
          .on('mouseover', (event, d) => {
            const card = d3.select('#bigTimelineCard');
            
            // Temporarily display the card to measure its height
            card.style('display', 'block');
            
            // Get the bounding box of the hovered rectangle
            const rectBounds = event.target.getBoundingClientRect();
            console.log('Bounding box of the rectangle:', rectBounds);
            
            // Apply zoom transformation to calculate the correct positions
            const adjustedX = currentZoomTransform.k * rectBounds.left + currentZoomTransform.x;
            const adjustedY = currentZoomTransform.k * rectBounds.top + currentZoomTransform.y;
            
            // Log the adjusted positions based on zoom
            console.log('Adjusted X:', adjustedX, 'Adjusted Y:', adjustedY);
        
            // Check the calculated height after displaying the card
            const cardHeight = card.node().offsetHeight;
            console.log('Card height:', cardHeight);
            
            // Determine whether the category is below or above the timeline
            const isBelowTimeline = d.startYear < -300000;
            console.log('Is category below the timeline?', isBelowTimeline);
        
            // Adjust the position of the card based on whether it's below or above the timeline
            const cardY = isBelowTimeline
                ? adjustedY - cardHeight - 10 + window.scrollY // If below, render above
                : adjustedY + rectBounds.height + 10 + window.scrollY; // If above, render below
        
            console.log('Calculated card Y position:', cardY);
        
            // Set the position of the bigTimelineCard relative to the category
            card
                .html(d.customInfo) // Set the content to customInfo
                .style('left', `${adjustedX + window.scrollX + rectBounds.width / 2 - card.node().offsetWidth / 2}px`)
                .style('top', `${cardY}px`) // Adjust the top to the calculated position
                .style('display', 'block'); // Ensure the card is displayed
            
            // Log the final card position for verification
            console.log('Final card position - Left:', adjustedX + window.scrollX, 'Top:', cardY);
        })
        .on('mouseout', () => {
            // Hide the card when the mouse leaves the category
            d3.select('#bigTimelineCard').style('display', 'none');
        })
        
        
          .on('mousemove', () => {
              // Keep the card in the same position relative to the rectangle
          })
          .on('mouseout', () => {
              // Hide the card when the mouse leaves the category
              d3.select('#bigTimelineCard').style('display', 'none');
          });
  };
  
  
    
    
    

    const events = [
        {
          name: 'Big Bang',
          year: -13.8e9,
          label: '13,800,000,000 BCE',
          yPosition: 0, // Lower means farther down on the screen
        },
        {
          name: 'Formation of the Earth',
          year: -4.5e9,
          label: '4,500,000,000 BCE',
          yPosition: 320,
        },
        {
          name: 'First life (bacteria)',
          year: -3.8e9,
          label: '3,800,000,000 BCE',
          yPosition: 360,
        },
        {
          name: 'Great Oxidation Event',
          year: -2.4e9,
          label: '2,400,000,000 BCE',
          yPosition: 400,
        },
        {
          name: 'Multicellular organisms',
          year: -1.5e9,
          label: '1,500,000,000 BCE',
          yPosition: 367,
        },
        {
          name: 'Cambrian Explosion',
          year: -541e6,
          label: '541,000,000 BCE',
          yPosition: 335,
        },
        {
          name: 'Colonization of land by plants',
          year: -470e6,
          label: '470,000,000 BCE',
          yPosition: 292,
        },
        {
          name: 'First land animals',
          year: -430e6,
          label: '430,000,000 BCE',
          yPosition: 247,
        },
        {
          name: 'Permian-Triassic Extinction',
          year: -252e6,
          label: '252,000,000 BCE',
          yPosition: 200,
        },
        {
          name: 'Dinosaurs',
          year: -230e6,
          label: '230,000,000 BCE',
          yPosition: 160,
        },
        {
          name: 'Primates',
          year: -55e6,
          label: '55,000,000 BCE',
          yPosition: 120,
        },
        {
          name: 'Walking on two legs',
          year: -7e6,
          label: '7,000,000 BCE',
          yPosition: 80, // Same as above, as it represents the same event
        },
        {
          name: 'Learning to cook',
          year: -500e3,
          label: '500,000 BCE',
          yPosition: 40,
        },
        {
          name: 'First humans (Homo sapiens)',
          year: -300e3,
          label: '300,000 BCE',
          yPosition: 0, // Aligns with the x-axis
        },
        {
          name: 'First symbolic behavior',
          year: -100e3,
          label: '100,000 BCE',
          yPosition: -40,
        },
        {
          name: 'First art',
          year: -75e3,
          label: '75,000 BCE',
          yPosition: -80,
        },
        {
          name: 'Agricultural revolution and First Cities',
          year: -8000,
          label: '8000 BCE',
          yPosition: -120,
        },
        {
          name: 'Industrial revolution',
          year: 1760,
          label: '1760 CE - 1840 CE',
          yPosition: -165,
        },
        {
          name: 'Today',
          year: 2025,
          label: '2025 CE',
          yPosition: -205, // Higher up on the screen
        },
      ];

    // Render the timeline elements (circles, lines, and labels)
    const renderTimeline = (scale) => {
      // Clear previous elements
      chartGroup.selectAll('line').remove();
      chartGroup.selectAll('circle').remove();
      chartGroup.selectAll('text').remove();
    
      // Helper function to check if the circle's position is within the timeline
      const isWithinTimeline = (xPos) => xPos >= 0 && xPos <= width;
    
      // Render vertical lines connecting the timeline to the circles
      chartGroup
  .selectAll('line')
  .data(events)
  .enter()
  .append('line')
  .attr('x1', (d) => scale(d.year)) // Start the line at the x position of the event
  .attr('x2', (d) => scale(d.year)) // End the line at the same x position (vertical line)
  .attr('y1', (d) => {
    // Adjust the y2 value so the line stops just before the timeline (on both sides)
    if (d.yPosition > 0) {
      return height / 2 + d.yPosition ; // Lines going downward stop 1px before the circle
    } else {
      return height / 2 + d.yPosition ; // Lines going upward stop 1px before the circle
    }
  })
  .attr('y2', (d) => {
    // Adjust the y2 value so the line stops just before the timeline (on both sides)
    if (d.yPosition > 0) {
      return height / 2 + 1 ; // Lines going downward stop 1px before the circle
    } else {
      return height / 2 - 1 ; // Lines going upward stop 1px before the circle
    }
  })
  .attr('stroke', (d) => (isWithinTimeline(scale(d.year)) ? 'white' : 'none')) // Clip lines if outside the timeline
  .attr('stroke-width', 2);

    
      // Render each event as a circle on the timeline with clipping logic
      chartGroup
        .selectAll('circle')
        .data(events)
        .enter()
        .append('circle')
        .attr('cx', (d) => scale(d.year))
        .attr('cy', (d) => height / 2 + d.yPosition)
        .attr('r', (d) => isWithinTimeline(scale(d.year)) ? 5 : 0) // Clip circle if outside the timeline
        .attr('fill', 'white')
        .attr('class', 'bigtimelinecircle');
    
      // Render event names to the left of each circle, clipped at the edges
      chartGroup
        .selectAll('text.name-label')
        .data(events)
        .enter()
        .append('text')
        .attr('class', 'name-label')
        .attr('x', (d) => scale(d.year) - 10)
        .attr('y', (d) => height / 2 + d.yPosition - 5)
        .attr('text-anchor', 'end')
        .text((d) => isWithinTimeline(scale(d.year)) ? d.name : '') // Clip text if outside the timeline
        .style('font-size', '13.5px')
        .style('fill', 'black');
    
      // Render event labels below the name to the left of the circle, clipped at the edges
      chartGroup
        .selectAll('text.event-label')
        .data(events)
        .enter()
        .append('text')
        .attr('class', 'event-label')
        .attr('x', (d) => scale(d.year) - 10)
        .attr('y', (d) => height / 2 + d.yPosition + 10)
        .attr('text-anchor', 'end')
        .text((d) => isWithinTimeline(scale(d.year)) ? d.label : '') // Clip text if outside the timeline
        .style('font-size', '10px')
        .style('fill', 'gray');
    };
    
    // Initial render with categories and events
    renderCategories(xScale);
    renderTimeline(xScale);

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 500000]) // Set the zoom limits
      .translateExtent([[0, height], [width, 0]]) // Restrict vertical panning
      .on('zoom', (event) => {
        const transform = event.transform;
        const newXScale = transform.rescaleX(xScale);

        // Re-render the timeline and categories with the updated scale
        renderCategories(newXScale);
        renderTimeline(newXScale);
      });

    // Apply zoom behavior to the SVG
    svg.call(zoom);

  }, []);

  return (
    <div ref={timelineRef}>
      <div id="bigTimelineCard"></div>
    </div>
  );
  
};

export default OhIntroTimeline;
