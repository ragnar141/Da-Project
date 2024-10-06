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
    "Fundamental Works": { "Title": "The Histories", "Date of Issue": "around 440 BC" },
    "Timeline": [-2600, -425], 
    "Origin of history": "Mythical Past: Ancient Civilizations",
    "Author's framework": "Ancient Greek",
    "Stages of cycles": ["Growth and Expansion", "Success and Prosperity", "Hubris and Overreach", "Divine Justince and Decline", "Crisis and Collapse" ],
       
    "Timeline Stages": [
      {"Stage": "The Ancient Civilizations", "Years": [-2600, -700]},
      {"Stage": "The Rise of the Persian Empire", "Years": [-600, -490]},
      {"Stage": "The Greco-Persian Wars", "Years": [-499, -479]},
      {"Stage": "The Post-War Period and the Rise of Greek Power", "Years": [-479, -425]}
    ],

    "Ancient regions": ["Egypt", "Persia", "Media", "Babylon", "Lydia", "Scythia", "India", "Libya", 
      "Phoenicia", "Cilicia", "Thrace", "Sogdiana", "Macedonia", "Colchis", "Ionia", 
      "Syria", "Ethiopia", "Arabia", "Bactria"],

    "Geography":   ["Greece", "Turkey", "Iran", "Iraq", "Lebanon", "Syria", "Israel", "Palestine", "Jordan", 
      "Egypt", "Libya", "Ukraine", "Kazakhstan", "Bulgaria", "India", 
      "Saudi Arabia", "Georgia", "Armenia", "Azerbaijan", "Ethiopia", "Uzbekistan", "Tajikistan", 
      "Afghanistan", "Sudan", "Pakistan", "Turkmenistan"]
  },

  {
    "Index": 2,
    "Author/Text Title": "Titus Livius (Livy)",
    "Fundamental Works": { "Title": "History of Rome", "Date of Issue": "around  27 - 9 BC" },
    "Timeline": [-1200, -9],
    "Origin of history": "Mythical Past: Trojan War",
   "Author's framework": "Ancient Roman",
    "Stages of cycles": "-",
    
    "Timeline Stages": [
      {"Stage": "Mythical and Monarchical Rome", "Years": [-753, -509]},
      {"Stage": "Republican Rome and Internal Struggles", "Years": [-509, -264]},
      {"Stage": "Rome's Wars and Expansion", "Years": [-264, -146]},
      {"Stage": "Moral Decline in the Late Republic", "Years": [-146, -27]}
    ],
    
    "Ancient regions": ["Rome", "Etruria", "Latium", "Samnium", "Magna Graecia", "Carthage", "Gaul", "Hispania", 
      "Macedonia", "Greece", "Sicily", "Sardinia", "Illyria", "Cisalpine Gaul", "Transalpine Gaul", 
      "Egypt", "Syria", "Pergamon", "Numidia", "Britannia", "Parthia", "Armenia", "Thrace", 
      "Pontus", "Asia Minor", "Epirus", "Achaea", "Pannonia", "Dacia", "Corsica", "Cyrenaica"],      
    
    "Geography": ["Italy", "Tunisia", "France", "Spain", "Portugal", "Greece", "Turkey", "Egypt", "Libya", 
      "Syria", "Albania", "Croatia", "Bosnia", "North Macedonia", "Serbia", "Bulgaria", "Hungary", 
      "Romania", "Georgia", "Armenia", "UK", "Iraq", "Iran", "Morocco"]
  },
  {
    "Index": 3,
    "Author/Text Title": "Tacitus",
    "Fundamental Works": { "Title": "Annals", "Date of Issue": "around  115 - 120 CE" },
    "Timeline": [14, 68],
    "Origin of history": "-",
    "Author's framework": "Secular, philosophical",
    "Stages of cycles": "-",

    "Timeline Stages": [
      {"Stage": "The Reign of Tiberius", "Years": [14, 37]},
      {"Stage": "Republican Rome and Internal Struggles", "Years": [37, 41]},
      {"Stage": "Rome's Wars and Expansion", "Years": [41, 54]},
      {"Stage": "Moral Decline in the Late Republic", "Years": [54, 68]}
    ],    
    
    "Ancient regions": ["Rome", "Italia", "Germania", "Britannia", "Gaul", "Hispania", "Egypt", "Syria", "Judea", 
      "Armenia", "Parthia", "Pannonia", "Dalmatia", "Illyria", "Numidia", "Mauretania", 
      "Thrace", "Asia Minor", "Achaea", "Cappadocia", "Pontus", "Dacia", "Mesopotamia", 
      "Africa Proconsularis", "Sicily"],
      
    "Geography": ["Italy", "Germany", "UK", "France", "Spain", "Portugal", "Egypt", "Syria", "Israel", 
      "Palestine", "Armenia", "Iran", "Iraq", "Hungary", "Croatia", "Bosnia", "Albania", 
      "Algeria", "Morocco", "Bulgaria", "Greece", "Turkey", "Romania", "Iraq", "Tunisia", 
      "Libya"]
  },
  {
    "Index": 4,
    "Author/Text Title": "Flavius Josephus",
    "Fundamental Works": [{ "Title": "The Jewish War",  "Date of Issue": "around 93 CE" }, 
    {"Title": "Antiquities of the Jews",  "Date of Issue": "around 93 CE" }],
     "Timeline": [-4000, 73],
    "Origin of history": "Genesis: story of Adam and Eve",
    "Author's framework": "Judaism",
    "Stages of cycles": ["Faithfulness and Prosperity", "Rebellion and Punishment", "Hope for Restoration"],

    "Timeline Stages": [
      {"Stage": "Creation to the Patriarchs (Genesis)", "Years": [-4000, -1300]},
      {"Stage": "The Exodus and the Law", "Years": [-1300, -1200]},
      {"Stage": "The Judges and the Kings of Israel", "Years": [-1200, -587]},
      {"Stage": "The Babylonian Exile and Return", "Years": [-587, -539]},
      {"Stage": "Post-Biblical History", "Years": [-539, 94]},
      {"Stage": "The Jewish War", "Years": [66, 70]}
    ],    

    "Ancient regions": ["Judea", "Galilee", "Samaria", "Idumea", "Jerusalem", "Perea", "Decapolis", "Syria", 
      "Alexandria", "Egypt", "Rome", "Parthia", "Babylonia", "Arabia", "Phoenicia", 
      "Mesopotamia", "Cyprus", "Persia", "Galatia", "Asia Minor"],      

    "Geography": ["Israel", "Palestine", "Jordan", "Lebanon", "Egypt", "Syria", "Iraq", "Saudi Arabia", 
      "Turkey", "Cyprus", "Italy", "Iran"]
      
  },
  {
    "Index": 5,
    "Author/Text Title": "Kojiki",
    "Fundamental Works": { "Title": "Kojiki",  "Date of Issue": "712 CE" }, 
    "Timeline": [-4000, 499], //x
    "Origin of history": "Mythical past: out of primordial chaos, the first gods spontaneously emerged.",
    "Author's framework": "Shinto",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {"Stage": "Mythological Age (Time Before Human History)", "Years": [-4000, -660]},
      {"Stage": "Historical Age (Legendary and Semi-Historical Period)", "Years": [-660, -499]},
    ],  
    "Ancient regions": ["Wa", "Yamato", "Izumo", "Tsukushi", "Takamagahara", "Ashihara no Nakatsukuni", "Koshi", 
      "Awaji", "Owari", "Hyuga", "Tsushima", "Hokkaido"],      

    "Geography": "Japan"
  },
  {
    "Index": 6,
    "Author/Text Title": "Nihongi",
    "Fundamental Works": { "Title": "Kojiki",  "Date of Issue": "720 CE" }, 
    "Timeline": [-4000, 697], //x
    "Origin of history": "Mythical past: out of primordial chaos, the first gods spontaneously emerged.",
    "Author's framework": "Primarily Shinto, secondarily Buddhism",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {"Stage": "Mythological Age (Kami no Yo) ", "Years": [-4000, -660]},
      {"Stage": "Semi-Historical Age", "Years": [-660, 600]},
      {"Stage": "Historical Age", "Years": [600, 720]}
    ],  
    "Ancient regions": ["Wa", "Yamato", "Tsukushi", "Koshi", "Kibi", "Silla", "Baekje", "Goguryeo", "Kara", 
      "Paekche", "Tunguska", "Lelang", "China", "Yamatai", "Ryukyu Islands"],
      
    "Geography": ["Japan", "South Korea", "North Korea", "China", "Russia (Manchuria)", "Ryukyu Islands"]
  },
  {
    "Index": 7,
    "Author/Text Title": "Ferdawsi",
    "Fundamental Works": {"Title": "Persian Book of Kings (Shahnameh)",  "Date of Issue": "1010 CE"}, 
    "Timeline": [-4000, 651], //x
    "Origin of history": "Mythical past: Ahura Mazda creates universe.",
    "Author's framework": "Primarily Zoroastrianism, secondarily Islam",
    "Stages of cycles": ["Truth and Justice  ->  Prosperity and Victory", "Tyranny, greed, and falsehood  ->  Death and Decline"],
    "Timeline Stages": [
      {"Stage": "Mythical Age", "Years": [-4000, -2000]},
      {"Stage": "Legendary Age", "Years": [-2000, -330]},
      {"Stage": "Historical Age", "Years": [-330, 651]}
    ],
    "Ancient regions": ["Iran", "Turan", "Zabulistan", "Sistan", "Mazandaran", "Khwarazm", "India", "China", 
      "Rome", "Arabia", "Balkh", "Khorasan", "Ctesiphon", "Isfahan", "Herat", "Rey", "Armenia", 
      "Caucasus", "Bukhara", "Gorgan", "Syria", "Yemen", "Sogdiana", "Parthia", "Azerbaijan", 
      "Tabaristan", "Georgia"],
  
    "Geography": ["Iran", "Central Asia", "Afghanistan", "Uzbekistan", "Turkmenistan", "India", "China", 
      "Turkey", "Iraq", "Syria", "Armenia", "Georgia", "Azerbaijan", "Yemen", "Tajikistan"]
  },
  {
    "Index": 8,
    "Author/Text Title": "Ibn Khaldun",
    "Fundamental Works": {"Title": "Muqaddimah",  "Date of Issue": "1377 CE"},
    "Timeline": [-2000, 1377],
    "Origin of history": "-",
    "Author's framework": "Rational, sociological",
    "Stages of cycles": ["The Formation of a Dynasty (Gaining Asabiyyah)", "The Flourishing of the Dynasty", 
      "The Decline of the Dynasty (Losing Asabiyyah)"],
    "Timeline Stages": [
      {"Stage": "Ancient Egypt", "Years": [-3100, -30]},
      {"Stage": "Mesopotamia", "Years": [-3000, -539]},
      {"Stage": "Pre-Islamic Tribal Arabia", "Years": [-500, 622]},
      {"Stage": "Life of the Prophet Muhammad", "Years": [570, 632]},
      {"Stage": "Umayyad Caliphate", "Years": [661, 750]},
      {"Stage": "Abbasid Caliphate", "Years": [750, 1258]},
      {"Stage": "Almoravid Dynasty", "Years": [1040, 1147]},
      {"Stage": "Almohad Dynasty", "Years": [1121, 1269]},
      {"Stage": "Hafsids of Tunisia", "Years": [1229, 1574]},
      {"Stage": "Mongol Empire", "Years": [1206, 1368]},
      {"Stage": "Reconquista", "Years": [718, 1377]},
    ],

    "Ancient regions": ["Ifriqiya", "Maghreb", "Egypt", "Al-Andalus", "Arabia", "Persia", "Syria", "Iraq", "Yemen", 
      "Berber Kingdoms", "Byzantium", "Sudan", "Sicily", "Constantinople", "Khorasan", 
      "Transoxiana", "Sassanid Empire"],      

    "Geography": ["Tunisia", "Algeria", "Libya", "Morocco", "Egypt", "Spain", "Portugal", "Saudi Arabia", 
      "Iran", "Syria", "Iraq", "Yemen", "Turkey", "Sudan", "Italy", "Uzbekistan", "Tajikistan", 
      "Turkmenistan"]      
  },
  
  {
    "Index": 9,
    "Author/Text Title": "Isaac Newton",
    "Fundamental Works": {"Title":  "The Chronology of Ancient Kingdoms Amended",  "Date of Issue": "1728 CE"},
    "Timeline": [-2000, -500],
    
    
    "Origin of history": "Genesis: story of Adam and Eve",
    "Author's framework": "Christian, scientific",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {"Stage": "Early Biblical Events", "Years": [-4000, -2500]},
      {"Stage": "Ancient Egypt", "Years": [-2000, -568]},
      {"Stage": "Assyria", "Years": [-1500, -600]},
      {"Stage": "Babylon", "Years": [-1500, -539]},
      {"Stage": "Persia", "Years": [-550, -330]},     
      {"Stage": "Trojan war, Greek period", "Years": [-950, -146]},],

    "Ancient regions": ["Egypt", "Assyria", "Babylon", "Greece", "Israel", "Judah", "Persia", "Scythia", 
      "Troy", "Thebes", "Phrygia"],
      
    "Geography": ["Egypt", "Iraq", "Syria", "Greece", "Israel", "Turkey", "Iran", "Georgia", "Ukraine", "Lebanon", "Jordan"]
  },
  {
    "Index": 10,
    "Author/Text Title": "Edward Gibbon",
    "Fundamental Works": {"Title":  "The History of the Decline and Fall of the Roman Empire",  "Date of Issue": "1781 CE"},
    "Timeline": [98, 1453],
    "Origin of history": "-",
    "Author's framework": "Sociological, philosophical",
    "Stages of cycles": ["Rise", "Fall"],
    "Timeline Stages": [
      {"Stage": "The Roman Empire from Trajan to the Fall of the Western Roman Empire ", "Years": [98, 476]},
      {"Stage": "The Byzantine (Eastern Roman) Empire ", "Years": [476, 1204]},
      {"Stage": "The Final Decline of the Byzantine Empire and the Fall of Constantinople", "Years": [1204, 1453]}],
    
    "Ancient regions": ["Rome", "Gaul", "Britannia", "Hispania", "Germania", "North Africa", "Constantinople", 
      "Asia Minor", "Greece", "Syria", "Palestine", "Egypt", "Visigothic Kingdom", "Ostrogothic Kingdom", 
      "Vandal Kingdom", "Francia", "Persia", "Arabia", "Slavic Tribes", "Avar Kingdom", "Lombard Kingdom", 
      "Balkans", "Turkey", "Ottoman Empire"],

    "Geography": ["Italy", "France", "United Kingdom", "Spain", "Germany", "Tunisia", "Algeria", "Libya", "Turkey", 
      "Greece", "Syria", "Israel", "Palestine", "Egypt", "Iraq", "Iran", "Saudi Arabia", "Jordan", 
      "Portugal", "Hungary", "Bulgaria", "Serbia"]
  },

  {
    "Index": 11,
    "Author/Text Title": "Georg Wilhelm Friedrich Hegel",
    "Fundamental Works": {"Title":  "Philosophy of History",  "Date of Issue": "1837 CE"},
    "Timeline": [-3000, 1800],
    "Origin of history": "History begins with the emergence of self-consciousness",
    "Author's framework": "Philosophical, teleological",    
    "Stages of cycles": ["Thesis", "Antithesis", "Synthesis"],
        
    "Timeline Stages": [
      {"Stage": "Oriental World", "Years": [-3000, -500]},
      {"Stage": "Greek World", "Years": [-800, -300]},
      {"Stage": "Roman World ", "Years": [-500, 476]},
      {"Stage": "Germanic World ", "Years": [476, 1800]}   
    ],
 
    "Ancient regions": ["China", "India", "Persia", "Egypt", "Greece", "Rome", "Germany"],
    "Geography": ["China", "India", "Iran", "Egypt", "Greece", "Italy", "Germany"]
  },
  {
    "Index": 12,
    "Author/Text Title": "Max Weber",
    "Sources": "The Protestant Ethic and the Spirit of Capitalism, Economy and Society",
    "Timeline": [1500, 2000],
    "Source Date": "1905 CE",

    "Ancient regions": ["Germany", "England", "The Netherlands", "Switzerland", "France", "United States", 
      "Scandinavia", "Western Europe", "Ancient Rome", "China", "India", "Islamic World", 
      "Medieval Europe", "Byzantine Empire", "Ancient Israel", "Buddhist Asia"],
    
    "Geography": ["Germany", "United Kingdom", "The Netherlands", "Switzerland", "France", "United States", 
      "Sweden", "Denmark", "Norway", "Italy", "China", "India", "Turkey", "Saudi Arabia", 
      "Iran", "Iraq", "Israel", "Palestine", "Japan", "Thailand", "Vietnam"]
  },
  {
    "Index": 13,
    "Author/Text Title": "Oswald Spengler",
    "Sources": "The Decline of the West",
    "Timeline": [-2000, 1900],
    "Source Date": "1921 CE",

    "Ancient regions": ["Egypt", "Babylonia", "Greece", "Rome", "Mesopotamia", "Persia", "Byzantine Empire", 
      "Arabia", "India", "China"],      

    "Geography": ["Egypt", "Iraq", "Greece", "Italy", "Iraq", "Iran", "Turkey", "Saudi Arabia", "India", "China"]
  },
  {
    "Index": 14,
    "Author/Text Title": "Arnold J. Toynbee",
    "Sources": "A Study of History",
    "Timeline": [-2000, 1950],
    "Source Date": "1934 – 1961 CE",

    "Ancient regions": ["Egypt", "Babylonia", "Sumer", "Greece", "Rome", "Byzantium", "Syria", "Persia", "India", "China", "Islamic Caliphates", 
      "Mesoamerica (Aztec and Maya)", "Andean (Inca)"],
     
    "Geography": ["Egypt", "Iraq", "Syria", "Greece", "Italy", "Turkey", "Syria", "Iran", "India", "China", "Saudi Arabia", "Mexico", "Peru"]
  },
  {
    "Index": 15,
    "Author/Text Title": "Karl Jaspers",
    "Sources": "The Origin and Goal of History",
    "Timeline": [-2000, 1950],
    "Source Date": "1951 CE",

    "Ancient regions": ["Greece", "India", "China", "Israel", "Persia", "Mesopotamia", "Egypt", "Rome", "Western Europe", "Islamic World"],

    "Geography": ["Greece", "India", "China", "Israel", "Iran", "Iraq", "Egypt", "Italy", "Western Europe", "Saudi Arabia", "Turkey", "Iran", "Iraq", "Syria", "Jordan"]
  },
  {
    "Index": 16,
    "Author/Text Title": "Peter Turchin",
    "Sources": "Historical Dynamics, War and Peace and War, Secular Cycles",
    "Timeline": [-2000, 2010],
    "Source Date": "2003-2010 CE",
    
    "Ancient regions": ["Rome", "China", "Russia", "European Empires", "Islamic Caliphates", "Byzantium", "Ottoman Empire", "France", 
      "Britain", "Muscovite Russia", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"],

    "Geography": ["Italy", "China", "Russia", "Western Europe", "Middle East", "Turkey", "France", "United Kingdom", "Germany", "Saudi Arabia", "Iraq", "Iran", "Syria"]

  },
  {
    "Index": 17,
    "Author/Text Title": "Yuval Noah Harari",
    "Sources": "Sapiens: A Brief History of Humankind",
    "Timeline": [-2000, 2011],
    "Source Date": "2011 CE",

    "Ancient regions": ["East Africa", "Middle East", "Europe", "Asia", "Australia", "Americas", "Fertile Crescent", 
      "China", "Mesoamerica", "Andes", "Sub-Saharan Africa", "Indus Valley", "Mesopotamia", "Egypt", "India", "China", "Mediterranean", "Islamic Caliphates"],

    "Geography": ["Kenya", "Ethiopia", "Sudan", "Iraq", "Turkey", "Syria", "Greece", "Italy", "Mexico", "Peru", 
      "United States", "China", "India", "Egypt", "Saudi Arabia", "France", "Spain", "Iran", "United Kingdom", "Russia", "South Africa"]
  }
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
      .domain([-2600, 2025]) // 6000 BC to 2025 CE
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
