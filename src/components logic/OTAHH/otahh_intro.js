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
    "Timeline": [-5000, 2000], 
    "Origin of history": "Mythological: Ancient Civilizations",
    "Author's framework": "Ancient Greek",
    "Stages of cycles": ["Growth and Expansion", "Success and Prosperity", "Hubris and Overreach", "Divine Justince and Decline", "Crisis and Collapse" ],
       
    "Timeline Stages": [
      {"Stage": "The Ancient Civilizations", "Years": [-2600, -700], "Labels": ["2600 BCE", "700 BCE"]},
      {
        "Stage": "The Rise of the Persian Empire",
        "Years": [-600, -490],
        "Labels": ["600 BCE", "490 BCE"]
      },
      {
        "Stage": "The Greco-Persian Wars",
        "Years": [-499, -479],
        "Labels": ["499 BCE", "479 BCE"]
      },
      {
        "Stage": "The Post-War Period and the Rise of Greek Power",
        "Years": [-479, -425],
        "Labels": ["479 BCE", "425 BCE"]
      }
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
    "Timeline": [-5000, 2000], 
    "Origin of history": "Mythological: Trojan War",
   "Author's framework": "Ancient Roman",
    "Stages of cycles": "-",
    
    "Timeline Stages": [
      {
        "Stage": "Mythical and Monarchical Rome",
        "Years": [-753, -509],
        "Labels": ["753 BCE", "509 BCE"]
      },
      {
        "Stage": "Republican Rome and Internal Struggles",
        "Years": [-509, -264],
        "Labels": ["509 BCE", "264 BCE"]
      },
      {
        "Stage": "Rome's Wars and Expansion",
        "Years": [-264, -146],
        "Labels": ["264 BCE", "146 BCE"]
      },
      {
        "Stage": "Moral Decline in the Late Republic",
        "Years": [-146, -27],
        "Labels": ["146 BCE", "27 BCE"]
      }
    ]
    ,
    
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
   "Timeline": [-5000, 2000],
    "Origin of history": "-",
    "Author's framework": "Secular, philosophical",
    "Stages of cycles": "-",

    "Timeline Stages": [
      {
        "Stage": "The Reign of Tiberius",
        "Years": [14, 37],
        "Labels": ["14 CE", "37 CE"]
      },
      {
        "Stage": "Republican Rome and Internal Struggles",
        "Years": [37, 41],
        "Labels": ["37 CE", "41 CE"]
      },
      {
        "Stage": "Rome's Wars and Expansion",
        "Years": [41, 54],
        "Labels": ["41 CE", "54 CE"]
      },
      {
        "Stage": "Moral Decline in the Late Republic",
        "Years": [54, 68],
        "Labels": ["54 CE", "68 CE"]
      }
    ]
    ,    
    
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
  "Timeline": [-5000, 2000],
    "Origin of history": "Theological: Genesis",
    "Author's framework": "Judaism",
    "Stages of cycles": ["Faithfulness and Prosperity", "Rebellion and Punishment", "Hope for Restoration"],

    "Timeline Stages": [
      {
        "Stage": "Creation to the Patriarchs (Genesis)",
        "Years": [-4000, -1300],
        "Labels": ["4000 BCE", "1300 BCE"]
      },
      {
        "Stage": "The Exodus and the Law",
        "Years": [-1300, -1200],
        "Labels": ["1300 BCE", "1200 BCE"]
      },
      {
        "Stage": "The Judges and the Kings of Israel",
        "Years": [-1200, -587],
        "Labels": ["1200 BCE", "587 BCE"]
      },
      {
        "Stage": "The Babylonian Exile and Return",
        "Years": [-587, -539],
        "Labels": ["587 BCE", "539 BCE"]
      },
      {
        "Stage": "Post-Biblical History",
        "Years": [-539, 94],
        "Labels": ["539 BCE", "94 CE"]
      },
      {
        "Stage": "The Jewish War",
        "Years": [66, 70],
        "Labels": ["66 CE", "70 CE"]
      }
    ]
    ,    

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
   "Timeline": [-5000, 2000], //x
    "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
    "Author's framework": "Shinto",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {
        "Stage": "Mythological Age (Time Before Human History)",
        "Years": [-4000, -660],
        "Labels": ["4000 BCE", "660 BCE"]
      },
      {
        "Stage": "Historical Age (Legendary and Semi-Historical Period)",
        "Years": [-660, -499],
        "Labels": ["660 BCE", "499 BCE"]
      }
    ]
    ,  
    "Ancient regions": ["Wa", "Yamato", "Izumo", "Tsukushi", "Takamagahara", "Ashihara no Nakatsukuni", "Koshi", 
      "Awaji", "Owari", "Hyuga", "Tsushima", "Hokkaido"],      

    "Geography": "Japan"
  },
  {
    "Index": 6,
    "Author/Text Title": "Nihongi",
    "Fundamental Works": { "Title": "Nihongi",  "Date of Issue": "720 CE" }, 
    "Timeline": [-5000, 2000], //x
    "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
    "Author's framework": "Primarily Shinto, secondarily Buddhism",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {
        "Stage": "Mythological Age (Kami no Yo)",
        "Years": [-4000, -660],
        "Labels": ["4000 BCE", "660 BCE"]
      },
      {
        "Stage": "Semi-Historical Age",
        "Years": [-660, 600],
        "Labels": ["660 BCE", "600 CE"]
      },
      {
        "Stage": "Historical Age",
        "Years": [600, 720],
        "Labels": ["600 CE", "720 CE"]
      }
    ]
    ,  
    "Ancient regions": ["Wa", "Yamato", "Tsukushi", "Koshi", "Kibi", "Silla", "Baekje", "Goguryeo", "Kara", 
      "Paekche", "Tunguska", "Lelang", "China", "Yamatai", "Ryukyu Islands"],
      
    "Geography": ["Japan", "South Korea", "North Korea", "China", "Russia (Manchuria)", "Ryukyu Islands"]
  },
  {
    "Index": 7,
    "Author/Text Title": "Ferdawsi",
    "Fundamental Works": {"Title": "Persian Book of Kings (Shahnameh)",  "Date of Issue": "1010 CE"}, 
   "Timeline": [-5000, 2000], //x
    "Origin of history": "Mythological: Ahura Mazda creates universe.",
    "Author's framework": "Primarily Zoroastrianism, secondarily Islam",
    "Stages of cycles": ["Truth and Justice  ->  Prosperity and Victory", "Tyranny, greed, and falsehood  ->  Death and Decline"],
    "Timeline Stages": [
      {
        "Stage": "Mythical Age",
        "Years": [-4000, -2000],
        "Labels": ["4000 BCE", "2000 BCE"]
      },
      {
        "Stage": "Legendary Age",
        "Years": [-2000, -330],
        "Labels": ["2000 BCE", "330 BCE"]
      },
      {
        "Stage": "Historical Age",
        "Years": [-330, 651],
        "Labels": ["330 BCE", "651 CE"]
      }
    ]
    ,
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
   "Timeline": [-5000, 2000],
    "Origin of history": "-",
    "Author's framework": "Rational, sociological",
    "Stages of cycles": ["The Formation of a Dynasty (Gaining Asabiyyah)", "The Flourishing of the Dynasty", "The Decline of the Dynasty (Losing Asabiyyah)"],
    "Timeline Stages": [
      {
        "Stage": "Ancient Egypt",
        "Years": [-3100, -30],
        "Labels": ["3100 BCE", "30 BCE"]
      },
      {
        "Stage": "Mesopotamia",
        "Years": [-3000, -539],
        "Labels": ["3000 BCE", "539 BCE"]
      },
      {
        "Stage": "Pre-Islamic Tribal Arabia",
        "Years": [-500, 622],
        "Labels": ["500 BCE", "622 CE"]
      },
      {
        "Stage": "Life of the Prophet Muhammad",
        "Years": [570, 632],
        "Labels": ["570 CE", "632 CE"]
      },
      {
        "Stage": "Umayyad Caliphate",
        "Years": [661, 750],
        "Labels": ["661 CE", "750 CE"]
      },
      {
        "Stage": "Abbasid Caliphate",
        "Years": [750, 1258],
        "Labels": ["750 CE", "1258 CE"]
      },
      {
        "Stage": "Almoravid Dynasty",
        "Years": [1040, 1147],
        "Labels": ["1040 CE", "1147 CE"]
      },
      {
        "Stage": "Almohad Dynasty",
        "Years": [1121, 1269],
        "Labels": ["1121 CE", "1269 CE"]
      },
      {
        "Stage": "Hafsids of Tunisia",
        "Years": [1229, 1574],
        "Labels": ["1229 CE", "1574 CE"]
      },
      {
        "Stage": "Mongol Empire",
        "Years": [1206, 1368],
        "Labels": ["1206 CE", "1368 CE"]
      },
      {
        "Stage": "Reconquista",
        "Years": [718, 1377],
        "Labels": ["718 CE", "1377 CE"]
      }
    ]
    ,

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
   "Timeline": [-5000, 2000],
    
    
    "Origin of history": "Theological: Genesis",
    "Author's framework": "Christian, scientific",
    "Stages of cycles": "-",
    "Timeline Stages": [
      {
        "Stage": "Early Biblical Events",
        "Years": [-4000, -2500],
        "Labels": ["4000 BCE", "2500 BCE"]
      },
      {
        "Stage": "Ancient Egypt",
        "Years": [-2000, -568],
        "Labels": ["2000 BCE", "568 BCE"]
      },
      {
        "Stage": "Assyria",
        "Years": [-1500, -600],
        "Labels": ["1500 BCE", "600 BCE"]
      },
      {
        "Stage": "Babylon",
        "Years": [-1500, -539],
        "Labels": ["1500 BCE", "539 BCE"]
      },
      {
        "Stage": "Persia",
        "Years": [-550, -330],
        "Labels": ["550 BCE", "330 BCE"]
      },
      {
        "Stage": "Trojan war, Greek period",
        "Years": [-950, -146],
        "Labels": ["950 BCE", "146 BCE"]
      }
    ]
    ,

    "Ancient regions": ["Egypt", "Assyria", "Babylon", "Greece", "Israel", "Judah", "Persia", "Scythia", 
      "Troy", "Thebes", "Phrygia"],
      
    "Geography": ["Egypt", "Iraq", "Syria", "Greece", "Israel", "Turkey", "Iran", "Georgia", "Ukraine", "Lebanon", "Jordan"]
  },
  {
    "Index": 10,
    "Author/Text Title": "Edward Gibbon",
    "Fundamental Works": {"Title":  "The History of the Decline and Fall of the Roman Empire",  "Date of Issue": "1781 CE"},
   "Timeline": [-5000, 2000],
    "Origin of history": "-",
    "Author's framework": "Sociological, philosophical",
    "Stages of cycles": ["Rise", "Fall"],
    "Timeline Stages": [
      {
        "Stage": "The Roman Empire from Trajan to the Fall of the Western Roman Empire",
        "Years": [98, 476],
        "Labels": ["98 CE", "476 CE"]
      },
      {
        "Stage": "The Byzantine (Eastern Roman) Empire",
        "Years": [476, 1204],
        "Labels": ["476 CE", "1204 CE"]
      },
      {
        "Stage": "The Final Decline of the Byzantine Empire and the Fall of Constantinople",
        "Years": [1204, 1453],
        "Labels": ["1204 CE", "1453 CE"]
      }
    ]
    ,
    
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
"Timeline": [-5000, 2000],
    "Origin of history": "History begins with the emergence of self-consciousness",
    "Author's framework": "Philosophical, teleological",    
    "Stages of cycles": ["Thesis", "Antithesis", "Synthesis"],
        
    "Timeline Stages": [
      {
        "Stage": "Oriental World",
        "Years": [-3000, -500],
        "Labels": ["3000 BCE", "500 BCE"]
      },
      {
        "Stage": "Greek World",
        "Years": [-800, -300],
        "Labels": ["800 BCE", "300 BCE"]
      },
      {
        "Stage": "Roman World",
        "Years": [-500, 476],
        "Labels": ["500 BCE", "476 CE"]
      },
      {
        "Stage": "Germanic World",
        "Years": [476, 1800],
        "Labels": ["476 CE", "1800 CE"]
      }
    ]
    ,
 
    "Ancient regions": ["China", "India", "Persia", "Egypt", "Greece", "Rome", "Germany"],
    "Geography": ["China", "India", "Iran", "Egypt", "Greece", "Italy", "Germany"]
  },
  {
    "Index": 12,
    "Author/Text Title": "Max Weber",
    "Fundamental Works": [{"Title":  "The Sociology of Religion",  "Date of Issue": "1920 CE"},
                          {"Title":  "Economy and Society",  "Date of Issue": "1922 CE"}],

 "Timeline": [-5000, 2000],
    "Origin of history": "-",
    "Author's framework": "Sociological: theological, historical, economic",    
    "Stages of cycles": ["Rationalization"],
        
    "Timeline Stages": [
      {
        "Stage": "Ancient Religions: Patrimonial and theocratic rule, kinship-based governance",
        "Years": [-3000, -500],
        "Labels": ["3000 BCE", "500 BCE"]
      },
      {
        "Stage": "Axial Age Religions: Feudalism, charismatic authority, decentralized governance",
        "Years": [-600, 200],
        "Labels": ["600 BCE", "200 CE"]
      },
      {
        "Stage": "Medieval Religions: Rise of centralized monarchies, early bureaucratic structures, absolutism",
        "Years": [400, 1500],
        "Labels": ["400 CE", "1500 CE"]
      },
      {
        "Stage": "Modern Religions: Bureaucratization, rational-legal authority, industrial capitalism",
        "Years": [1500, 2000],
        "Labels": ["1500 CE", "2000 CE"]
      }
    ]
    ,
   
    "Ancient regions": ["Persia", "Switzerland", "The Netherlands", "Eastern Europe", "Ancient Israel", "Western Europe", "France", "Ancient Greece", 
      "Medieval Europe", "Germany", "Medieval Japan", "Ottoman Empire", "Islamic World", "Byzantine Empire", "Buddhist Asia", "Japan", "Mesopotamia", 
      "China", "Ancient Egypt", "India", "United States", "Medieval Christendom", "England", "Ancient Rome"],
    
    "Geography": ["Switzerland", "Lebanon", "The Netherlands", "France", "Egypt", "Greece", "Palestine", "Myanmar", "Czech Republic", "Bangladesh", "Sri Lanka", "Germany", 
      "Vietnam", "Pakistan", "Italy", "Poland", "Israel", "Syria", "Iran", "Turkey", "Iraq", "Japan", "United Kingdom", "Combodia", "Hungary", "Indonesia", "Europe", "Thailand",
       "Malaysia", "China", "Yemen", "United States", "India", "Saudi Arabia", "Jordan", "Japan"]
  },
  {
    "Index": 13,
    "Author/Text Title": "Oswald Spengler",
    "Fundamental Works": {"Title":  "The Decline of the West",  "Date of Issue": "1921 CE"},
   "Timeline": [-5000, 2000],
    
    "Origin of history": "-",
    "Author's framework": "Philosophical, fatalistic",    
    "Stages of cycles": ["Birth (Spring)", "Growth and Flourishing (Summer)", "Maturity and Rationalization (Autumn)", "Decline (Winter)"],
        
    "Timeline Stages": [
      {
        "Stage": "Egyptian Civilization (early high culture)",
        "Years": [-3000, -300],
        "Labels": ["3000 BCE", "300 BCE"]
      },
      {
        "Stage": "Mesopotamian/Babylonian Civilization (early high culture)",
        "Years": [-3000, -500],
        "Labels": ["3000 BCE", "500 BCE"]
      },
      {
        "Stage": "Greek (Classical Civilization)",
        "Years": [-1100, -200],
        "Labels": ["1100 BCE", "200 BCE"]
      },
      {
        "Stage": "Roman (Classical Civilization",
        "Years": [-500, 500],
        "Labels": ["500 BCE", "500 CE"]
      },
      {
        "Stage": "Arabian (Magian Civilization)",
        "Years": [300, 1500],
        "Labels": ["300 CE", "1500 CE"]
      },
      {
        "Stage": "Medieval Europe (Faustian Civilization)",
        "Years": [900, 1500],
        "Labels": ["900 CE", "1500 CE"]
      },
      {
        "Stage": "Renaissance and Reformation (Faustian Civilization)",
        "Years": [1500, 1800],
        "Labels": ["1500 CE", "1800 CE"]
      },
      {
        "Stage": "Industrialization and Modernity (Faustian Civilization)",
        "Years": [1800, 2000],
        "Labels": ["1800 CE", "2000 CE"]
      }
    ]
    ,
   
      "Ancient regions": ["Egypt", "Babylonia", "Greece", "Rome", "Mesopotamia", "Persia", "Byzantine Empire", 
      "Arabia", "India", "China"],

    "Geography": ["Egypt", "Iraq", "Greece", "Italy", "Iraq", "Iran", "Turkey", 
      "Saudi Arabia, Yemen, Oman, UAE, Qatar, Bahrain, Kuwait", "India, Pakistan, Bangladesh", "China"]

  },
  {
    "Index": 14,
    "Author/Text Title": "Arnold J. Toynbee",
    "Fundamental Works": {"Title":  "A Study of History",  "Date of Issue": "1934 – 1961 CE"},
   "Timeline": [-5000, 2000],

    "Origin of history": "History starts when societies respond to significant challenges",
    "Author's framework": "Spiritual, mystical, empirical",    
    "Stages of cycles": ["Birth","Growth", "Breakdown", "Disintegration"],
        
    "Timeline Stages": [
      {
        "Stage": "Egyptian Civilization",
        "Years": [-3000, -30],
        "Labels": ["3000 BCE", "30 BCE"]
      },
      {
        "Stage": "Sumerian/Babylonian Civilization",
        "Years": [-3000, -500],
        "Labels": ["3000 BCE", "500 BCE"]
      },
      {
        "Stage": "Minoan Civilization",
        "Years": [-2700, -1400],
        "Labels": ["2700 BCE", "1400 BCE"]
      },
      {
        "Stage": "Hittite Civilization",
        "Years": [-1600, -1200],
        "Labels": ["1600 BCE", "1200 BCE"]
      },
      {
        "Stage": "Indus Valley Civilization",
        "Years": [-2600, -1900],
        "Labels": ["2600 BCE", "1900 BCE"]
      },
      {
        "Stage": "Maya Civilization",
        "Years": [-1800, 900],
        "Labels": ["1800 BCE", "900 CE"]
      },
      {
        "Stage": "Classical Greek Civilization",
        "Years": [-800, -146],
        "Labels": ["800 BCE", "146 BCE"]
      },
      {
        "Stage": "Persian Civilization",
        "Years": [-550, 651],
        "Labels": ["550 BCE", "651 CE"]
      },
      {
        "Stage": "Western Roman Civilization",
        "Years": [-500, 476],
        "Labels": ["500 BCE", "476 CE"]
      },
      {
        "Stage": "Chinese Civilization",
        "Years": [-1000, 220],
        "Labels": ["1000 BCE", "220 CE"]
      },
      {
        "Stage": "Byzantine Civilization",
        "Years": [330, 1453],
        "Labels": ["330 CE", "1453 CE"]
      },
      {
        "Stage": "Islamic Civilization",
        "Years": [622, 2000],
        "Labels": ["622 CE", "2000 CE"]
      },
      {
        "Stage": "Western Christian Civilization",
        "Years": [800, 2000],
        "Labels": ["800 CE", "2000 CE"]
      },
      {
        "Stage": "Hindu Civilization",
        "Years": [-1500, 2000],
        "Labels": ["1500 BCE", "2000 CE"]
      },
      {
        "Stage": "Russian Civilization",
        "Years": [900, 2000],
        "Labels": ["900 CE", "2000 CE"]
      },
      {
        "Stage": "Japanese Civilization",
        "Years": [250, 2000],
        "Labels": ["250 CE", "2000 CE"]
      },
      {
        "Stage": "Hindu Civilization",
        "Years": [-1500, 2000],
        "Labels": ["1500 BCE", "2000 CE"]
      },
      {
        "Stage": "Western Renaissance",
        "Years": [-1400, 1760],
        "Labels": ["1400 BCE", "1760 CE"]
      },
      {
        "Stage": "Industrial Revolution",
        "Years": [1760, 1900],
        "Labels": ["1760 CE", "1900 CE"]
      },
      {
        "Stage": "World Wars and Globalization",
        "Years": [1900, 2000],
        "Labels": ["1900 CE", "2000 CE"]
      }
    ]
    ,

    "Ancient regions": ["Egypt", "Mesopotamia", "Sumer", "Greece", "Rome", "Byzantium", "Syria", "Persia", "India", "China", "Islamic Caliphates", 
      "Mesoamerica (Aztec and Maya)", "Andean (Inca)"],
     
    "Geography": ["Egypt", "Pakistan", "Bangladesh", "Iraq", "Syria", "Greece", "Italy", "Turkey", "Syria", "Iran", "India", "China",
       "Saudi Arabia", "Mexico", "Peru", "Germany", "France", "Spain", ]
  },
  {
    "Index": 15,
    "Author/Text Title": "Karl Jaspers",
    "Fundamental Works": {"Title":  "The Origin and Goal of History",  "Date of Issue": "1951 CE"},
 "Timeline": [-5000, 2000], //x

    "Origin of history": "Axial Age",
    "Author's framework": "Existentionalist, theological, philosophical",    
    "Stages of cycles": "-",

    "Timeline Stages":[
      {
        "Stage": "Pre-Axial Period",
        "Years": [-3000, -800],
        "Labels": ["3000 BCE", "800 BCE"]
      },
      {
        "Stage": "Axial Age",
        "Years": [-800, -200],
        "Labels": ["800 BCE", "200 BCE"]
      },
      {
        "Stage": "Post-Axial Age",
        "Years": [-200, 2000],
        "Labels": ["200 BCE", "2000 CE"]
      }
    ]
    ,
    
    "Ancient regions": ["Greece", "India", "China", "Israel", "Persia", "Mesopotamia", "Egypt", "Rome", "Western Europe", "Islamic World"],

    "Geography": ["Greece", "India", "China", "Israel", "Iran", "Iraq", "Egypt", "Italy", "Western Europe", "Saudi Arabia", "Turkey",
       "Iran", "Iraq", "Syria", "Jordan"]
  },
  {
    "Index": 16,
    "Author/Text Title": "Peter Turchin",
    "Fundamental Works": [{"Title":  "Historical Dynamics",  "Date of Issue": "2003 CE"},
                           {"Title":  "War and Peace and War",  "Date of Issue": "2006 CE"},
                           {"Title":  "Secular Cycles",  "Date of Issue": "2009 CE"}],

 "Timeline": [-5000, 2000],
    
    "Origin of history": "-",
    "Author's framework": "Cliodynamics, empirical",    
    "Stages of cycles": ["Growth: demographic, economic", "Stagflation: elite overproduction, malthusian stagnation", "Crisis: state breakdown, depopulation, economic collapse",
       "Depression: economic recovery, rebuilding state institutions"],
    
    "Timeline Stages": [
      {
        "Stage": "Medieval England",
        "Years": [1150, 1485],
        "Labels": ["1150 CE", "1485 CE"]
      },
      {
        "Stage": "Pre-Revolution France",
        "Years": [1200, 1800],
        "Labels": ["1200 CE", "1800 CE"]
      },
      {
        "Stage": "Imperial Russia",
        "Years": [1460, 1917],
        "Labels": ["1460 CE", "1917 CE"]
      },
      {
        "Stage": "Ancient Rome",
        "Years": [-200, 600],
        "Labels": ["200 BCE", "600 CE"]
      }
    ]
    ,

    "Ancient regions": ["Rome", "China", "Russia", "European Empires", "Islamic Caliphates", "Byzantium", "Ottoman Empire", "France", 
      "Britain", "Muscovite Russia", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"],

    "Geography": ["Italy", "China", "Russia", "Western Europe", "Middle East", "Turkey", "France", "United Kingdom", "Germany", "Saudi Arabia", "Iraq", "Iran", "Syria"]

  },
];

function OtahhIntro() {
  const [selectedAuthor, setSelectedAuthor] = useState(dataset[0]); // Set the initial author/text
  const svgRef = useRef();
  const zoomScaleRef = useRef(1); // Initialize zoom scale at 1
  const timelineRef = useRef(); // Reference for the timeline SVG

  // Memoized function to set up the projection and path generator
  const renderGlobe = useMemo(() => {
    const initialScale = 170;  // Default size of the globe
    const initialRotation = [0, 0];  // Default rotation angle [longitude, latitude]

    const projection = geoOrthographic()
      .scale(initialScale * zoomScaleRef.current)
      .translate([300, 400]) // Center the globe
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
  
    // Define the time scale dynamically based on the author's timeline
    const startYear = selectedAuthor.Timeline[0];
    const endYear = selectedAuthor.Timeline[1];
  
    const xScale = d3.scaleLinear()
      .domain([startYear, endYear])
      .range([50, width - 50]); // Leave padding on both sides
  
    // Create the axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(20)
      .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`));
  
    const g = svg.append("g");
  
    // Append the axis to the timeline
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(xAxis)
      .style('font-size', '16px')
      .selectAll('text')
      .style('font-family', 'Times New Roman, sans-serif');
  
    // Keep track of used levels to avoid overlaps
    const usedLevels = [];
    
    // Helper function to determine an available level for a stage
    const findAvailableLevel = (start, end) => {
      for (let level = 0; ; level++) {
        const intersecting = usedLevels[level]?.some(stage => (
          (start >= stage.start && start <= stage.end) || (end >= stage.start && end <= stage.end)
        ));
        if (!intersecting) {
          return level;
        }
      }
    };
  
    // Loop through timeline stages and highlight each period
    g.selectAll("rect")
      .data(selectedAuthor["Timeline Stages"])
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.Years[0]))
      .attr("y", function(d) {
        const level = findAvailableLevel(d.Years[0], d.Years[1]);
        if (!usedLevels[level]) usedLevels[level] = [];
        usedLevels[level].push({ start: d.Years[0], end: d.Years[1] });
        return 10 + level * 20; // Adjust `y` position based on level
      })
      .attr("width", d => xScale(d.Years[1]) - xScale(d.Years[0]))
      .attr("height", height - 50)
      .attr("fill", (d, index) => d3.schemeCategory10[index % 10]) // Use different colors for each stage
      .attr("opacity", 0.5)
      .append("title") // Tooltip for stage
      .text(d => d.Stage);
  
    // Add a label for each stage using the "Labels" array instead of "Years"
    g.selectAll(".stage-label")
      .data(selectedAuthor["Timeline Stages"])
      .enter()
      .append("text")
      .attr("class", "stage-label")
      .attr("x", d => (xScale(d.Years[0]) + xScale(d.Years[1])) / 2)
      .attr("y", function(d) {
        const level = findAvailableLevel(d.Years[0], d.Years[1]);
        return height - 60 - (level * 20); // Adjust `y` position based on level
      })
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .each(function(d) {
        const textElement = d3.select(this);
  
        // First part of the stage label (split into two lines)
        const stageParts = d.Stage.split(" ");
        const firstPart = stageParts.slice(0, Math.floor(stageParts.length / 2)).join(" ");
        const secondPart = stageParts.slice(Math.floor(stageParts.length / 2)).join(" ");
  
        // Append first line
        textElement.append("tspan")
          .attr("x", (xScale(d.Years[0]) + xScale(d.Years[1])) / 2)
          .attr("dy", "-1.5em") // Move first line up
          .text(firstPart);
  
        // Append second line
        textElement.append("tspan")
          .attr("x", (xScale(d.Years[0]) + xScale(d.Years[1])) / 2)
          .attr("dy", "1.2em") // Move second line below the first
          .text(secondPart);
  
        // Append third line for Labels (BCE/CE)
        textElement.append("tspan")
          .attr("x", (xScale(d.Years[0]) + xScale(d.Years[1])) / 2)
          .attr("dy", "1.2em") // Further offset for the third line
          .text(`(${d.Labels[0]} - ${d.Labels[1]})`);
      });
  
    // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 10]) // Set the zoom range
      .translateExtent([[0, 0], [width, height]]) // Restrict panning
      .on("zoom", (event) => {
        // Apply the zoom transformation
        const newXScale = event.transform.rescaleX(xScale);
  
        g.selectAll("rect")
          .attr("x", d => newXScale(d.Years[0]))
          .attr("width", d => newXScale(d.Years[1]) - newXScale(d.Years[0]));
  
        g.select(".x-axis").call(xAxis.scale(newXScale));
  
        // Update labels with zoom and render as multiline with `tspan`
        g.selectAll(".stage-label")
          .each(function(d) {
            const textElement = d3.select(this);
  
            // Recalculate x position based on newXScale
            const newXPos = (newXScale(d.Years[0]) + newXScale(d.Years[1])) / 2;
  
            // Remove any existing `tspan` elements to prevent duplication
            textElement.selectAll("tspan").remove();
  
            // First part of the stage label (split into two lines)
            const stageParts = d.Stage.split(" ");
            const firstPart = stageParts.slice(0, Math.floor(stageParts.length / 2)).join(" ");
            const secondPart = stageParts.slice(Math.floor(stageParts.length / 2)).join(" ");
  
            // Append first line
            textElement.append("tspan")
              .attr("x", newXPos)
              .attr("dy", "-1.5em") // Move first line up
              .text(firstPart);
  
            // Append second line
            textElement.append("tspan")
              .attr("x", newXPos)
              .attr("dy", "1.2em") // Move second line below the first
              .text(secondPart);
  
            // Append third line for Labels (BCE/CE)
            textElement.append("tspan")
              .attr("x", newXPos)
              .attr("dy", "1.2em") // Further offset for the third line
              .text(`(${d.Labels[0]} - ${d.Labels[1]})`);
          });
      });
  
    // Apply the zoom behavior to the SVG
    svg.call(zoom);
  }, [selectedAuthor]);
  
  
  // Function to highlight relevant geography on the globe
  const highlightGeography = useCallback(() => {
    const { projection, path } = renderGlobe;
  
    d3.json('/datasets/110m.json') // Load modern country borders
      .then(worldData => {
        console.log("World data loaded for modern countries:", worldData);
  
        const land = topojson.feature(worldData, worldData.objects.countries);
  
        // Highlight regions based on the selected author's Geography and Ancient Regions
        d3.select(svgRef.current).selectAll('path.land')
          .data(land.features)
          .join('path')
          .attr('d', path)
          .attr('class', 'land')
          .attr('fill', d => {
            const countryName = d.properties.name;
            if (selectedAuthor.Geography.includes(countryName)) {
              return 'red'; // Modern countries highlighted in red
            }
            if (selectedAuthor["Ancient regions"].includes(countryName)) {
              return 'blue'; // Ancient regions highlighted in blue
            }
            return '#d3d3d3'; // Default color for other countries
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
    applyDrag();
  }, [renderStaticElements, applyDrag]);

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

      <div className="author-card-container">
      <div className="fundamental-works-container">
  {Array.isArray(selectedAuthor["Fundamental Works"]) ? (
    <div className="fundamental-works-column">
      {selectedAuthor["Fundamental Works"].map((work, index) => (
        <div key={index} className="author-card-label">{work.Title} - {work["Date of Issue"]}</div>
      ))}
    </div>
  ) : (
    <div className="author-card-label">{selectedAuthor["Fundamental Works"].Title} - {selectedAuthor["Fundamental Works"]["Date of Issue"]}</div>
  )}
</div>


        <div className="framework-container">
          <label>Framework: </label>
          <p>{selectedAuthor["Author's framework"]}</p>
        </div>

        
        <div className="territory-container">
          <label>Territory: </label>
          <p>{selectedAuthor["Ancient regions"].join(", ")}</p>
        </div>

        <div className="origin-of-history-container">
          <label>Origin of History: </label>
          <p>{selectedAuthor["Origin of history"]}</p>
        </div>




       <div className="stages-container">
  <div className="stages-label-container">
    <label>States of History:</label>
    {selectedAuthor["Stages of cycles"] === "-" ? (
      <p>-</p>
    ) : (
      <ul className="stages-list">
        {selectedAuthor["Stages of cycles"].map((stage, index) => (
          <li key={index}>{stage}</li>
        ))}
      </ul>
    )}
  </div>
</div>


      </div>

      <div className="globe-container" style={{ position: 'relative' }}>
        {/* Globe SVG */}
        <svg ref={svgRef} className="otahh-globe" width="600" height="600"></svg>
      </div>

      {/* Timeline SVG (moved outside the globe container) */}
      <div style={{ marginTop: '10px' }}>
        <svg ref={timelineRef} className="timeline"></svg>
      </div>
    </div>
  );
}

export default OtahhIntro;
