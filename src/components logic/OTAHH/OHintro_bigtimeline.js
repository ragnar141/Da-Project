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
    const height = 594; // Increased height to accommodate labels above and below
    

    // Create an SVG element
    const svg = d3
      .select(timelineRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'svgtimeline');

         
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
        yearsLabel: ["13.8 Billion BCE", "13.8 Billion BCE"],
        startYear: -13.8e9,
        endYear: -13.79962e9,  // 380,000 years after the Big Bang
        color: '#e74c3c', // Red
        customInfo: [
          {"epochName": "Planck Epoch", "duration": "(0 to 10<sup>-43</sup> seconds)"},
          {"epochName": "Grand Unification Epoch", "duration": "10<sup>-43</sup> to 10<sup>-36</sup> seconds"},        
          {"epochName": "Inflationary Epoch", "duration": "10<sup>-36</sup> to 10<sup>-32</sup> seconds"},
          {"epochName": "Quark Epoch", "duration": "10<sup>-12</sup> to 10<sup>-6</sup> seconds"},
          {"epochName": "Hadron Epoch", "duration": "10<sup>-6</sup> to 1 second"},
          {"epochName": "Lepton Epoch", "duration": "1 second to 10 seconds"},
          {"epochName": "Photon Epoch", "duration": "10 seconds to 380,000 years"},
          {"epochName": "Recombination", "duration": "~380,000 years"}
        ]
        
      },
      {
        name: 'Dark Ages',
        yearsLabel: ["13.8 Billion BCE", "13.65 Billion BCE"],
        startYear: -13.79962e9,
        endYear: -13.65e9,  // 150 million years after the Big Bang
        color: '#2ecc71', // Green
        customInfo: [
          {"epochName": "Early Dark Ages", "duration": "370,000 years to ~100 million years"},
          {"epochName": "Structure Formation", "duration": "~100 million years to ~500 million years"},
          {"epochName": "Reionization", "duration": "~500 million years to 1 billion years"}
       ]
          
      },
      {
        name: 'Cosmic Dawn',
        yearsLabel: ["13.65 Billion BCE", "12.8 Billion BCE" ],
        startYear: -13.65e9,  // 150 million years after the Big Bang
        endYear: -12.8e9,     // 1 billion years after the Big Bang
        color: '#3498db', // Blue
        customInfo: [
          {"epochName": "First Light Sources", "duration": "~100-250 million years"},
          {"epochName": "Lyman-Alpha Coupling", "duration": "~250-400 million years"},
          {"epochName": "Heating of the Intergalactic Medium", "duration": "~400-700 million years"},
          {"epochName": "Transition to Emission", "duration": "~700 million to 1 billion years"}
          ]
      },
      {
        name: 'Formation of Galaxy and new chemical elements',
        yearsLabel: ["13.2 Billion BCE", "4.6 billion BCE" ],
        startYear: -13.2e9,   // 1 billion years after the Big Bang
        endYear: -4.6e9,      // 5 billion years after the Big Bang
        color: '#f39c12', // Orange
        customInfo: [
          {"epochName": "Early Galaxy Formation", "duration": "~400 million years"},
          {"epochName": "Peak Galaxy Formation", "duration": "~2.8 billion years"},
          {"epochName": "Chemical Enrichment", "duration": "~3 billion years"},
          {"epochName": "Galaxy Maturation", "duration": "~2 billion years"},
          {"epochName": "Pre-Solar System Era", "duration": "~400 million years"}
        ]
      },
      {
        name: 'Solar System Formation',
        yearsLabel: ["4.6 billion BCE", "4.5 billion BCE"],
        startYear: -4.6e9,   // 9.2 billion years after the Big Bang
        endYear: -4.5e9,     // Formation of Solar System
        color: '#9b59b6', // Purple
        customInfo: [
          {"epochName": "Pre-solar Nebula Collapse", "duration": "~1 million years"},
          {"epochName": "Protostar Formation", "duration": "~10 million years"},
          {"epochName": "Protoplanetary Disk Formation", "duration": "~20 million years"},
          {"epochName": "Planetesimal Formation", "duration": "~20 million years"},
          {"epochName": "Planetary Embryo Formation", "duration": "~30 million years"},
          {"epochName": "Gas Giant Formation", "duration": "~20 million years"},
          {"epochName": "Terrestrial Planet Formation", "duration": "~50+ million years"}
        ]
      },
      {
        name: 'Hadean',
        yearsLabel: ["4.5 billion BCE", "4.0 billion BCE"],
        startYear: -4.5e9,  // 4.6 billion years ago
        endYear: -4.0e9,    // 4.0 billion years ago
        color: '#e74c3c', // Red
        customInfo: [
          {"epochName": "Early Hadean", "duration": "~100 million years"},
          {"epochName": "Moon Formation", "duration": "~50 million years"},
          {"epochName": "Late Heavy Bombardment", "duration": "~200 million years"},
          {"epochName": "Cooling and Crust Formation", "duration": "~100 million years"},
          {"epochName": "Early Atmosphere Development", "duration": "~50 million years"}
        ]
      },
      {
        name: 'Archean',
        yearsLabel: ["4.0 billion BCE", "2.5 billion BCE" ],
        startYear: -4.0e9,  // 4.0 billion years ago
        endYear: -2.5e9,    // 2.5 billion years ago
        color: '#2ecc71', // Green
        customInfo: [
          {"epochName": "Eoarchean", "duration": "~400 million years"},
          {"epochName": "Paleoarchean", "duration": "~400 million years"},
          {"epochName": "Mesoarchean", "duration": "~400 million years"},
          {"epochName": "Neoarchean", "duration": "~300 million years"},
       ]
      },
      {
        name: 'Proterozoic',
        yearsLabel: ["2.5 billion BCE", "541 million BCE" ],
        startYear: -2.5e9,  // 2.5 billion years ago
        endYear: -541e6,    // 541 million years ago
        color: '#3498db', // Blue
        customInfo: [
          {"epochName": "Paleoproterozoic Era", "duration": "~900 million years"},
          {"epochName": "Mesoproterozoic Era", "duration": "~600 million years"},
          {"epochName": "Neoproterozoic Era", "duration": "~459 million years"}
        ]
      },
      {
        name: 'Phanerozoic',
        yearsLabel: ["541 million BCE", "2025" ],
        startYear: -541e6,  // 541 million years ago
        endYear: -300000,      // Present (or near future)
        color: '#f39c12', // Orange
        customInfo: [
          {"epochName": "Paleozoic Era", "duration": "~289 million years"},
          {"epochName": "Mesozoic Era", "duration": "~186 million years"},
          {"epochName": "Cenozoic Era", "duration": "~66 million years"}
        ]
      },
      {
        name: 'Phanerozoic',
        yearsLabel: ["541 million BCE", "2025" ],
        startYear: -300000,  // 541 million years ago
        endYear: 2025,      // Present (or near future)
        color: '#f39c12', // Orange
        customInfo: [
          {"epochName": "Paleozoic Era", "duration": "~289 million years"},
          {"epochName": "Mesozoic Era", "duration": "~186 million years"},
          {"epochName": "Cenozoic Era", "duration": "~66 million years"}
        ]
      },
      {
        name: 'Paleolithic (Old Stone Age)',
        yearsLabel: ["3.3 million BCE", "10000 BCE" ],
        startYear: -3.4e6,   // 3.4 million years ago
        endYear: -300000,     // 11,700 years ago
        color: '#e74c3c', // Red
        customInfo: [
          {"epochName": "Lower Paleolithic", "duration": "~3 million years"},
          {"epochName": "Middle Paleolithic", "duration": "~270 thousand years"},
          {"epochName": "Upper Paleolithic", "duration": "~50 thousand years"}
        ]
      },
      {
        name: 'Paleolithic (Old Stone Age)',
        yearsLabel: ["3.3 million BCE", "10 thousand BCE" ],
        startYear: -300000,   // 3.4 million years ago
        endYear: -10000,     // 11,700 years ago
        color: '#e74c3c', // Red
        onhovertitle: "Notable Events",        
        onhover: [
          {"timelineDate": "-200000", "data": "<strong>Expansion in Africa</strong>: Homo sapiens began expanding across Africa, adapting to various environments, gradually forming small hunter-gatherer communities.", "year": "200,000 BCE"},
          {"timelineDate": "-100000", "data": "<strong>Early Migrations Out of Africa</strong>: Some groups of Homo sapiens began migrating out of Africa, moving into the <strong>Middle East</strong> and beyond, leading to interactions with <strong>Neanderthals</strong> in Europe and <strong>Denisovans</strong> in Asia.", "year": "100,000 - 70,000 BCE"},
          {"timelineDate": "-60000", "data": "Beginning of a second Major Migration Out of Africa, also known as <strong>'Out of Africa II'</strong>, eventually led to populating Europe, Asia, and Australia.", "year": "60,000 - 50,000 BCE"},
          {"timelineDate": "-40000", "data": "Arrival in Europe: Homo sapiens settling in Europe, eventually replacing Neanderthals. This period saw an explosion of creativity, often referred to as the Upper Paleolithic Revolution.", "year": "40,000 BCE"},
          {"timelineDate": "-35000", "data": "Explosion of creativity, often referred to as the <strong>Upper Paleolithic Revolution</strong>", "year": "35,000 - 30,000 BCE"},
          {"timelineDate": "-20000", "data": "<strong>Last Glacial Maximum</strong>: Ice sheets covered much of Europe and North America. Homo sapiens adapted to extreme cold, relying on innovations in clothing, hunting, and shelter.", "year": "20,000 BCE"},
          {"timelineDate": "-16000", "data": "<strong>Colonization of the Americas</strong>: Homo sapiens reached the <strong>Americas</strong>, likely via a land bridge called <strong>Beringia</strong> that connected Siberia and Alaska during periods of lower sea levels.", "year": "16,000 - 15,000 BCE"},
          {"timelineDate": "-11000", "data": "<strong>Natufian culture</strong> in the <strong>Levant</strong>: A semi-sedentary lifestyle emerged, with early agriculture, first permanent settlements and construction, marking the split of humanity into <strong>Settlers</strong> and <strong>Hunter-gatherers</strong>", "year": "11,000 BCE"},
          {"timelineDate": "-10000", "data": "<strong>End of the Last Ice Age</strong>: As the <strong>Pleistocene epoch</strong> ended, temperatures warmed, and ice sheets receded. This climatic shift led to significant changes in flora, fauna, and human activities.", "year": "10,000 BCE"}
        ],
      },

      {
        name: 'Mesolithic (Middle Stone Age)',
        yearsLabel: ["10 thousand BCE", "8000 BCE" ],
        startYear: -10000,   // 11,700 years ago
        endYear: -8000,      // 8,000 years ago
        color: '#2ecc71', // Green
        onhovertitle: "First City",
        onhover: [
          {"timelineDate": "-9000", "data": "<strong>Jericho</strong> (Levant, modern-day Palestine) One of the oldest continuously inhabited settlements, known for its early urban planning: massive stone walls, tower, suggesting a complex society.", "year": "9000 BCE"},
        ],
      },
      {
        name: 'Neolithic (New Stone Age)',
        yearsLabel: ["8000 BCE", "3300 BCE"],
        startYear: -8000,    // 8,000 BCE
        endYear: -3300,      // 3,300 BCE
        color: '#3498db', // Blue
        onhovertitle: "First Cities",
        onhover: [
          {"timelineDate": "-7500", "data": "<strong>Çatalhöyük</strong> (Anatolia, modern-day Turkey) Dense, honeycomb-like homes with roof access, decorated interiors with murals, and evidence of early religious and burial practices.", "year": "7500 BCE"},
          {"timelineDate": "-5000", "data": "<strong>Byblos</strong> (Levant, modern-day Lebanon) An important trading hub with stone walls, temples, residential buildings and harbor facilities", "year": "5000 BCE"},
          {"timelineDate": "-4000", "data": "<strong>Uruk</strong> (Mesopotamia, modern-day Iraq) A city with monumental architechture, city walls, administrative buildings, and residential areas. The birthplace of writing (cuneiform)", "year": "4000 BCE"},
          {"timelineDate": "-3300", "data": "<strong>Harappa</strong> (Indus Valley, modern-day Pakistan) A major city og the Indus Valley Civilization: Grid-pattern streets, brick houses, advanced drainage systems, granaries, and evidence of trade and standardized weights.", "year": "3300 BCE"},
        ]
      },
      {
        name: 'Bronze Age',
        yearsLabel: ["3300 BCE", "1200 BCE" ],
        startYear: -3300,    // 3,300 BCE
        endYear: -1200,      // 1,200 BCE
        color: '#f39c12', // Orange
        onhovertitle: "First forms of Writing",
        onhover: [
          {"timelineDate": "-3200", "data": "<strong>Cuneiform</strong> (Mesopotamia)  It began as a system of pictographs, used by the Sumerians to record economic transactions such as grain and livestock counts.", "year": "3200 BCE"},
          {"timelineDate": "-3100", "data": "<strong>Hieroglyphics</strong> (Egypt)  Hieroglyphics were developed independently around the time of the unification of Upper and Lower Egypt. They were used initially for religious and monumental inscriptions, as seen on temple walls, tombs, and the <strong>Narmer Palette</strong>", "year": "3100 BCE"},
          {"timelineDate": "-2600", "data": "<strong>Indus Script</strong> (Indus Valley Civilization) The Indus script remains largely undeciphered but is found on seal stones, pottery, and other artifacts from cities like <strong>Harappa</strong> and <strong>Mohenjo-daro</strong>. The script consists of short inscriptions that may represent a form of early writing.", "year": "2,600 – 1,900 BCE"},
          {"timelineDate": "-1450", "data": "<strong>Linear B</strong> (Greece) Linear B is an early form of Greek writing used primarily for keeping palace records during the Mycenaean period. It was an adaptation of an earlier script known as Linear A (which was used by the Minoan civilization and remains undeciphered). Linear B was used to record inventories, transactions, and administrative data.", "year": "3300 BCE"},
        ]
      },
      {
        name: 'Iron Age',
        yearsLabel: ["1200 BCE", "500 BCE" ],
        startYear: -1200,    // 1,200 BCE
        endYear: 500,        // 500 CE
        color: '#9b59b6', // Purple
        onhovertitle: "First forms of Writing",
        onhover: [
          {"timelineDate": "-1200", "data": "<strong>Oracle Bone Script</strong> (China) The earliest known form of Chinese writing was used during the Shang Dynasty (1,600–1,046 BC) for divination and recording royal events. The script was carved into turtle shells or ox bones (oracle bones) as part of rituals where diviners would interpret the cracks formed by heating the bones.", "year": "1200 BCE"},
          {"timelineDate": "-1050", "data": "<strong>Phoenician Alphabet</strong> (Levant)  Hieroglyphics were developed independently around the time of the unification of Upper and Lower Egypt. They were used initially for religious and monumental inscriptions, as seen on temple walls, tombs, and the <strong>Narmer Palette</strong>", "year": "3100 BCE"},
        ]
      },
      {
        name: 'Middle Ages',
        yearsLabel: ["500 CE", "1500 CE" ],
        startYear: 500,      // 500 CE
        endYear: 1500,       // 1500 CE
        color: '#e67e22', // Dark Orange
      },
      {
        name: 'Early Modern Period',
        yearsLabel: ["1500 CE", "1800 CE" ],
        startYear: 1500,     // 1500 CE
        endYear: 1800,       // 1800 CE
        color: '#1abc9c', // Teal
      },
      {
        name: 'Modern Era',
        yearsLabel: ["1800 CE", "2025 CE" ],
        startYear: 1800,     // 1800 CE
        endYear: 2025,       // Present
        color: '#34495e', // Dark Blue
      },
      {
        name: 'Industrial Age',
        yearsLabel: ["1760 CE", "1970 CE" ],
        startYear: 1760,     // 1760 CE
        endYear: 1970,       // 1970 CE
        color: '#f1c40f', // Yellow
      },
      {
        name: 'Information Age',
        yearsLabel: ["1970 CE", "2025 CE" ],
        startYear: 1970,     // 1970 CE
        endYear: 2025,       // Present
        color: '#95a5a6', // Gray
      }
    ];
    


  
      // Render each category as a rectangle
      const renderCategories = (scale, currentZoomTransform = { k: 1, x: 0, y: 0 }) => {
        chartGroup.selectAll('rect').remove();
  
        const timelineStart = 0;
        const timelineEnd = width;
  
        chartGroup
          .selectAll('rect')
          .data(categories)
          .enter()
          .append('rect')
          .attr('x', (d) => Math.max(scale(d.startYear), timelineStart))
          .attr('width', (d) => {
            const startX = scale(d.startYear);
            const endX = scale(d.endYear);
            return Math.max(Math.min(endX, timelineEnd) - Math.max(startX, timelineStart), 0);
          })
          .attr('y', (d) => d.startYear < -300000 ? height / 2 : height / 2 - 30)
          .attr('height', (d) => d.startYear < -300000 ? 30 : 30)
          .attr('fill', (d) => d.color)
          .attr('opacity', 0.3)
          .on('mouseover', (event, d) => {
            const card = d3.select('#bigTimelineCard');
        
            // Interrupt any ongoing transitions and reset styles
            card.interrupt().style('opacity', 0).style('display', 'none');
        
            // Construct the basic info content with the name and yearsLabel
            let infoContent = `<strong>${d.name}</strong><br>${d.yearsLabel ? d.yearsLabel.join(' - ') : ''}`;
        
            // If customInfo exists, iterate through it and append each epoch and duration
            if (d.customInfo && Array.isArray(d.customInfo)) {
                infoContent += '<br><br>';
                d.customInfo.forEach(epoch => {
                    infoContent += `<div class="custom-info-left"><strong>${epoch.epochName}:</strong> ${epoch.duration}</div>`;
                });
            }
        
            // If summary exists, add the bullet points
            if (d.summary && Array.isArray(d.summary)) {
                infoContent += '<br><ul>';
                d.summary.forEach(point => {
                    infoContent += `<li>${point}</li>`;
                });
                infoContent += '</ul>';
            }
        
            // If details exist, render section titles and their items with bullet points
            if (d.details && Array.isArray(d.details)) {
                infoContent += '<br>';
                d.details.forEach(section => {
                    infoContent += `<div class="horizontal-section">
                        <strong class="section-title">${section.sectionTitle}:</strong>
                        <ul class="section-items">`;
                    section.items.forEach(item => {
                        infoContent += `<li>${item}</li>`;
                    });
                    infoContent += `</ul></div>`;
                });
            }
        
            // Display the card with the constructed content
            card.style('display', 'block')
                .html(infoContent)
                .style('border-color', d.color);
        
            // Ensure the timeline container exists
            const timelineBoundsElement = document.querySelector('#timeline-container');
            console.log('Timeline container:', timelineBoundsElement);
        
            if (!timelineBoundsElement) {
                console.error("Timeline container not found");
                return;
            }
        
            // Positioning logic for the card
            const rectBounds = event.target.getBoundingClientRect();
            console.log('Bounding rect of the target element:', rectBounds);
        
            const adjustedY = currentZoomTransform.k * rectBounds.top + currentZoomTransform.y;
            console.log('Adjusted Y position:', adjustedY);
        
            const cardHeight = card.node().offsetHeight;
            const cardWidth = card.node().offsetWidth;
            console.log('Card dimensions:', { cardHeight, cardWidth });
        
            const timelineBounds = timelineBoundsElement.getBoundingClientRect(); // Boundary checks
            console.log('Timeline bounds:', timelineBounds);
        
            const isBelowTimeline = d.startYear < -300000;
            const cardY = isBelowTimeline
                ? adjustedY - cardHeight - 10 + window.scrollY
                : adjustedY + rectBounds.height + 10 + window.scrollY;
        
            console.log('Final card Y position:', cardY);
        
            // Calculate initial 'left' position
            let cardLeft = rectBounds.left + window.scrollX + rectBounds.width / 2 - cardWidth / 2;
            console.log('Initial card left position:', cardLeft);
        
            // Check if the card overflows the timeline's left or right borders
            if (cardLeft < timelineBounds.left + window.scrollX) {
                console.log('Card overflows to the left, adjusting position');
                cardLeft = timelineBounds.left + window.scrollX + 10; // Adjust further to ensure padding
            } else if (cardLeft + cardWidth > timelineBounds.right + window.scrollX) {
                console.log('Card overflows to the right, adjusting position');
                cardLeft = timelineBounds.right + window.scrollX - cardWidth - 10; // Adjust for padding on the right
            }
        
            console.log('Final card left position:', cardLeft);
        
            // Set the position and show the card with a transition
            card.style('left', `${cardLeft}px`)
                .style('top', `${cardY}px`)
                .transition()
                .duration(200)
                .style('opacity', 1);
        
            // Adjust the opacity of the hovered element
            d3.select(event.target).attr('opacity', 1);
        })
        
        
        
          .on('mouseout', (event) => {
            d3.select('#bigTimelineCard')
              .interrupt()
              .transition()
              .duration(200)
              .style('opacity', 0)
              .on('end', function () {
                d3.select(this).style('display', 'none');
              });
  
            d3.select(event.target).attr('opacity', 0.3);
          });
      };
    
  
  
  
    
    
    

    const events = [
      {
        name: 'Big Bang',
        year: -13.8e9,
        label: '13,800,000,000 BCE',
        yPosition: 0, // Lower means farther down on the screen
        image: '/assets/bigTimeline/bigBang.jpg' // Updated relative path
    },
        {
          name: 'Formation of the Earth',
          year: -4.5e9,
          label: '4,500,000,000 BCE',
          yPosition: 290,
        },
        {
          name: 'First life (bacteria)',
          year: -3.8e9,
          label: '3,800,000,000 BCE',
          yPosition: 325,
        },
        {
          name: 'Great Oxidation Event',
          year: -2.4e9,
          label: '2,400,000,000 BCE',
          yPosition: 357,
        },
        {
          name: 'Multicellular organisms',
          year: -1.5e9,
          label: '1,500,000,000 BCE',
          yPosition: 325,
        },
        {
          name: 'Colonization of land by plants',
          year: -470e6,
          label: '470,000,000 BCE',
          yPosition: 295,
        },
        {
          name: 'First land animals',
          year: -430e6,
          label: '430,000,000 BCE',
          yPosition: 262,
        },
        {
          name: 'Permian-Triassic Extinction',
          year: -252e6,
          label: '252,000,000 BCE',
          yPosition: 230,
        },
        {
          name: 'Dinosaurs',
          year: -230e6,
          label: '230,000,000 BCE',
          yPosition: 197,
        },
        {
          name: 'Primates',
          year: -55e6,
          label: '55,000,000 BCE',
          yPosition: 165,
        },
        {
          name: 'First tools (The Oldowan)',
          year: -33e6,
          label: '3,300,000 BCE',
          yPosition: 132, // Same as above, as it represents the same event
        },
        {
          name: 'Walking on two legs',
          year: -7e6,
          label: '7,000,000 BCE',
          yPosition: 99, // Same as above, as it represents the same event
        },
        {
          name: 'First controlled use of fire',
          year: -2e6,
          label: '2,000,000 BCE',
          yPosition: 67, // Same as above, as it represents the same event
        },
        {
          name: 'Learning to cook',
          year: -500e3,
          label: '500,000 BCE',
          yPosition: 35,
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
          yPosition: -33,
        },
        {
          name: 'First art',
          year: -75e3,
          label: '75,000 BCE',
          yPosition: -67,
        },
        {
          name: 'Sophisticated tools',
          year: -30e3,
          label: '30,000 BCE',
          yPosition: -102,
        },
        {
          name: 'First rituals, ceremonies and microlothic tools',
          year: -13e3,
          label: '13,000 BCE',
          yPosition: -135,
        },
        {
          name: 'First writing (Cuneiform)',
          year: -3100,
          label: '3100 BCE',
          yPosition: -205,
        },
        {
          name: 'Agricultural revolution and First Cities',
          year: -8000,
          label: '8000 BCE',
          yPosition: -170,
        },
        {
          name: 'Industrial revolution',
          year: 1760,
          label: '1760 CE - 1840 CE',
          yPosition: -240,
        },
        {
          name: 'Today',
          year: 2025,
          label: '2025 CE',
          yPosition: -273, // Higher up on the screen
        }
        
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
  .attr('stroke', (d) => (isWithinTimeline(scale(d.year)) ? 'black' : 'none')) // Clip lines if outside the timeline
  .attr('stroke-width', 1)
  .attr('opacity', 0.15);

    
     // Render each event as a circle on the timeline with clipping logic
// Create an HTML element for the image (you can place this in your HTML file)
// Create an HTML element for the image (you can place this in your HTML file)
// Create an HTML element for the image (you can place this in your HTML file)
const imageContainer = d3.select('body').append('div')
    .attr('id', 'hoverImage')
    .style('position', 'fixed') // Set to fixed to remain in the same place
    .style('display', 'none') // Hidden by default
    .style('z-index', 10) // Ensure it's on top of other elements
    .style('left', '50%') // Center horizontally
    .style('top', '50%') // Center vertically
    .style('transform', 'translate(-50%, -50%)') // Correct centering
    .style('width', '400px') // Set width for the image container
    .style('height', 'auto'); // Auto height to maintain aspect ratio

chartGroup.selectAll('circle')
    .data(events)
    .enter()
    .append('circle')
    .attr('cx', (d) => scale(d.year))
    .attr('cy', (d) => height / 2 + d.yPosition)
    .attr('r', 5) // Default radius
    .attr('fill', 'white')
    .attr('class', 'bigtimelinecircle')
    .on('mouseover', function (event, d) {
        // Log the data being hovered over
        console.log("Hovered data:", d);

        // Log if the image path exists
        if (d.image) {
            console.log("Image path exists:", d.image);
        } else {
            console.log("No image path for this data.");
        }

        // Change fill and radius on hover
        d3.select(this)
            .attr('fill', '#ffcc00') // Change color to #ffcc00
            .attr('r', 10); // Increase radius to 10

        // Show the image in the middle of the screen
        if (d.image) {
            imageContainer
                .style('display', 'block')
                .html(`<img src="${d.image}" style="width: 100%; height: auto;">`); // Insert the image

            // Log the HTML content of the image container to see if the image is inserted correctly
            console.log("Image container HTML:", imageContainer.html());
        }
    })
    .on('mouseout', function (event, d) {
        // Revert fill and radius on mouseout
        d3.select(this)
            .attr('fill', 'white') // Revert color to original white
            .attr('r', 5); // Revert radius to original 5

        // Hide the image and log that it's being hidden
        imageContainer.style('display', 'none');
        console.log("Image hidden.");
    });




    
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
      .scaleExtent([1, 1000000]) // Set the zoom limits
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
    <div id="timeline-container" ref={timelineRef}>
        <div id="bigTimelineCard" className="big-timeline-card"></div>
    </div>
);
  
  
};

export default OhIntroTimeline;
