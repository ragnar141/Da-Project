import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import '../../components css/otahh_intro.css';




const firstColor = 'black';    // Orange Red
const secondColor = '#32CD32';   // Lime Green
const thirdColor = '#FF0000';    // Bright Red
const fourthColor = '#1E90FF';   // Dodger Blue
const fifthColor = '#8A2BE2';
const sixthColor = '#FF4500';    // Spring Green
const seventhColor = '#B22222';  // Firebrick
const eighthColor = '#9370DB';   // Medium Purple
const ninthColor = '#00008B';    // Dark Blue
const tenthColor = '#ADFF2F';    // Green Yellow
const eleventhColor = '#8B4513'; // Saddle Brown
const twelvethColor = '#00CED1'; // Dark Turquoise
const thirteenthColor = '#FF69B4'; // Hot Pink
const fourteenthColor = '#4682B4'; // Steel Blue
const fifteenthColor = '#00FA9A';  // Medium Spring Green
const sixteenthColor = '#FF1493';  // Deep Pink


// Sample JSON dataset
const dataset = [
  {
    "Index": 1,
    "Author/Text Title": "Herodotus",
    "Date for timeline": -440,
    "Fundamental Works": { "Title": "The Histories", "Date of Issue": "around 440 BC" },
    "Timeline": [-5000, 2000], 
    "Origin of history": "Mythological: Ancient Civilizations",
    "Author's framework": "Ancient Greek",
    "Stages of cycles": ["Growth and Expansion", "Success and Prosperity", "Hubris and Overreach", "Divine Justince and Decline", "Crisis and Collapse" ],
       
    "Timeline Stages": [
      {
        "Stage": "The Ancient Civilizations", 
        "Years": [-2600, -700], 
        "Labels": ["2600 BCE", "700 BCE"],
        "Level" : 0, 
        "Color" : firstColor,
        "Geography": ["Egypt", "Iraq", "Iran", "Turkey", "Lebanon", "Syria", "Israel", 
          "Palestine", "Ukraine", "Kazakhstan", "Libya", "India", "Pakistan", "Greece", "Bulgaria", "Armenia"],
        "Centralized Goverments": ["Egypt", "Persia", "Lydia", "Babylon", "Media", "Macedonia", "Ethiopia (Kush)"],
        "Networks of Tribes": ["Scythia", "Libya", "Thrace", "Ionia", "Phoenicia", "Arabia"],


      
      
        },
        {
        "Stage": "The Rise of the Persian Empire",
        "Years": [-600, -490],
        "Labels": ["600 BCE", "490 BCE"],
        "Level" : 0,
        "Color" : secondColor,
        "Geography" : ["Iran", "Iraq", "Turkey", "Afghanistan", "Pakistan", "Syria", "Lebanon", "Israel", "Palestine", "Jordan",
           "Egypt", "Greece", "Bulgaria", "Macedonia", "Libya", "Turkmenistan", "Uzbekistan", "Armenia", "Azerbaijan", "Georgia"],
           "Territory": ["Persis", "Media", "Babylonia", "Elam", "Assyria", "Syria", "Phoenicia", "Lydia", "Caria",
             "Phrygia", "Ionian Greek city-states", "Bactria", "Sogdia", "Parthia", "India", "Egypt", "Libya", "Thrace", "Macedon"]

      },
      {
        "Stage": "The Greco-Persian Wars",
        "Years": [-499, -479],
        "Labels": ["499 BCE", "479 BCE"],
        "Level" : 1,
        "Color" : thirdColor,
        "Geography": ["Greece", "Turkey", "Cyprus", "Bulgaria", "Macedonia", "Egypt", "Iran", "Iraq", "Syria"],
        "Territory": []

      },
      {
        "Stage": "The Post-War Period and the Rise of Greek Power",
        "Years": [-479, -425],
        "Labels": ["479 BCE", "425 BCE"],
        "Level" : 0,
        "Color" : fourthColor,
        "Geography": ["Greece", "Turkey", "Cyprus", "Egypt", "Libya", "Syria", "Lebanon", "Israel", "Palestine", "Macedonia", "Italy", "Albania", "Bulgaria"],
        "Territory": []
      }
    ],

    "Ancient regions": ["Egypt", "Persia", "Media", "Babylon", "Lydia", "Scythia", "India", "Libya", 
      "Phoenicia", "Cilicia", "Thrace", "Sogdiana", "Macedonia", "Colchis", "Ionia", 
      "Syria", "Ethiopia", "Arabia", "Bactria"],

    "Initial Geography": ["Greece", "Turkey", "Iran", "Iraq", "Lebanon", "Syria", "Israel", "Palestine", "Jordan", 
      "Egypt", "Libya", "Ukraine", "Kazakhstan", "Bulgaria", "India", "Saudi Arabia", "Georgia", "Armenia",  "Albania", "Azerbaijan", "Ethiopia", 
      "Uzbekistan", "Tajikistan", "Afghanistan", "Sudan", "Pakistan", "Turkmenistan", "Tunisia", "Cyprus", "Macedonia", "Italy"]   ,
      "Territory": []
  },

  {
    "Index": 2,
    "Author/Text Title": "Titus Livius (Livy)",
    "Date for timeline": -9,
    "Fundamental Works": { "Title": "History of Rome", "Date of Issue": "around  27 - 9 BC" },
    "Timeline": [-5000, 2000], 
    "Origin of history": "Mythological: Trojan War",
   "Author's framework": "Ancient Roman",
    "Stages of cycles": "-",
    
    "Timeline Stages": [
      {
        "Stage": "Mythical and Monarchical Rome",
        "Years": [-753, -509],
        "Labels": ["753 BCE", "509 BCE"],
        "Level" : 0,
        "Color" : firstColor,
        "Geography": ["Italy"]
        
      },
      {
        "Stage": "Republican Rome and Internal Struggles",
        "Years": [-509, -264],
        "Labels": ["509 BCE", "264 BCE"],
        "Level" : 0,
        "Color" : secondColor,
        "Geography": ["Italy"]
      },
      {
        "Stage": "Rome's Wars and Expansion",
        "Years": [-264, -146],
        "Labels": ["264 BCE", "146 BCE"],
        "Level" : 0,
        "Color" : thirdColor,
        "Geography": ["Italy", "France", "Spain", "Portugal", "Tunisia", "Algeria", "Greece", "North Macedonia", "Albania", "Montenegro", "Croatia", "Turkey", "Libya", "Malta", "Syria"]
      },
      {
        "Stage": "Moral Decline in the Late Republic",
        "Years": [-146, -27],
        "Labels": ["146 BCE", "27 BCE"],
        "Level" : 0,
        "Color" : fourthColor,
        "Geography": ["Italy", "Greece", "North Macedonia", "Albania", "Spain", "Portugal", "France", "Belgium", "Tunisia", "Libya", "Algeria", "Turkey", "Syria", "Cyprus", "Egypt"]
      }
    ]
    ,
    
    "Ancient regions": ["Rome", "Etruria", "Latium", "Samnium", "Magna Graecia", "Carthage", "Gaul", "Hispania", 
      "Macedonia", "Greece", "Sicily", "Sardinia", "Illyria", "Cisalpine Gaul", "Transalpine Gaul", 
      "Egypt", "Syria", "Pergamon", "Numidia", "Britannia", "Parthia", "Armenia", "Thrace", 
      "Pontus", "Asia Minor", "Epirus", "Achaea", "Pannonia", "Dacia", "Corsica", "Cyrenaica"],      
    
 "Initial Geography": ["Italy", "Tunisia", "France", "Spain", "Portugal", 
  "Greece", "Turkey", "Egypt", "Libya", "Syria", "Albania", "Croatia", "Bosnia",
   "North Macedonia", "Serbia", "Bulgaria", "Hungary", "Romania", "Georgia", 
   "Armenia", "UK", "Iraq", "Iran", "Morocco", "Montenegro", "Luxembourg", 
   "Belgium", "Switzerland", "Algeria", "Slovenia", "Lebanon", "Israel", 
   "Palestine", "Jordan", "Netherlands", "Moldova", "Austria"]



  },
  {
    "Index": 3,
    "Author/Text Title": "Tacitus",
    "Date for timeline": 120,
    "Fundamental Works": { "Title": "Annals", "Date of Issue": "around  115 - 120 CE" },
   "Timeline": [-5000, 2000],
    "Origin of history": "-",
    "Author's framework": "Secular, philosophical",
    "Stages of cycles": "-",

    "Timeline Stages": [
      {
        "Stage": "The Reign of Tiberius",
        "Years": [14, 37],
        "Labels": ["14 CE", "37 CE"],
        "Level" : 0,
        "Color" : firstColor,
        "Geography": ["Italy", "France", "Spain", "Portugal", "Germany", "Switzerland", "Austria", "Belgium", "Netherlands", "Luxembourg", "United Kingdom", "Greece",
           "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Cyprus", "Bulgaria", "Romania"]
  
      },
      {
        "Stage": "Republican Rome and Internal Struggles",
        "Years": [37, 41],
        "Labels": ["37 CE", "41 CE"],
        "Level" : 0,
        "Color" : secondColor,
        "Geography": ["Italy", "France", "Spain", "Portugal", "Germany", "Switzerland", "Austria", "Belgium", "Netherlands", "Luxembourg", "United Kingdom", 
          "Greece", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Cyprus", "Bulgaria", "Romania",
           "Hungary", "Croatia", "Bosnia and Herzegovina", "Serbia", "Albania", "Macedonia", "Montenegro", "Slovenia", "Moldova", "Ukraine"]
      },
      {
        "Stage": "Rome's Wars and Expansion",
        "Years": [41, 54],
        "Labels": ["41 CE", "54 CE"],
        "Level" : 0,
        "Color" : thirdColor,
        "Geography": ["Italy", "France", "Spain", "Portugal", "Germany", "Switzerland", "Austria", "Belgium", "Netherlands", "Luxembourg", "United Kingdom", "Greece", 
          "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Cyprus", "Bulgaria", "Romania", "Hungary", 
          "Croatia", "Bosnia and Herzegovina", "Serbia", "Albania", "Macedonia", "Montenegro", "Slovenia", "Moldova", "Ukraine", "Armenia"]
      },
      {
        "Stage": "Moral Decline in the Late Republic",
        "Years": [54, 68],
        "Labels": ["54 CE", "68 CE"],
        "Level" : 0,
        "Color" : fourthColor,
        "Geography": ["Italy", "France", "Spain", "Portugal", "Germany", "Switzerland", "Austria", "Belgium", "Netherlands", "Luxembourg", "United Kingdom", 
          "Greece", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Cyprus", "Bulgaria", 
          "Romania", "Hungary", "Croatia", "Bosnia and Herzegovina", "Serbia", "Albania", "Macedonia", "Montenegro", "Slovenia", "Moldova", "Ukraine", "Armenia"]
      }
    ]
    ,    
    
    "Ancient regions": ["Rome", "Italia", "Germania", "Britannia", "Gaul", "Hispania", "Egypt", "Syria", "Judea", 
      "Armenia", "Parthia", "Pannonia", "Dalmatia", "Illyria", "Numidia", "Mauretania", 
      "Thrace", "Asia Minor", "Achaea", "Cappadocia", "Pontus", "Dacia", "Mesopotamia", 
      "Africa Proconsularis", "Sicily"],
      
     "Initial Geography": ["Italy", "Germany", "Tunisia", "France", "Spain", 
      "Portugal", "Greece", "Turkey", "Egypt", "Libya", "Syria", 
      "North Macedonia", "Serbia", "Slovenia", "Bulgaria", "Kosovo", "Albania", 
      "Croatia", "Bosnia", "Montenegro", "Hungary", "Romania", "Georgia", 
      "Armenia", "Azerbaijan", "Turkmenistan", "UK", "Iraq", "Iran", "Morocco", 
      "Luxembourg", "Belgium", "Switzerland", "Algeria", "Lebanon", "Israel", 
      "Palestine", "Jordan", "Netherlands", "Luxemburg", "Poland", 
      "Czech Republic", "Moldova", "Austria"]

    },
    {
      "Index": 4,
      "Author/Text Title": "Flavius Josephus",
      "Date for timeline": 93,
      "Fundamental Works": [
        { "Title": "The Jewish War", "Date of Issue": "around 93 CE" },
        { "Title": "Antiquities of the Jews", "Date of Issue": "around 93 CE" }
      ],
      "Timeline": [-5000, 2000],
      "Origin of history": "Theological: Genesis",
      "Author's framework": "Judaism",
      "Stages of cycles": ["Faithfulness and Prosperity", "Rebellion and Punishment", "Hope for Restoration"],
      "Timeline Stages": [
        {
          "Stage": "Creation to the Patriarchs (Genesis)",
          "Years": [-4000, -1300],
          "Labels": ["4000 BCE", "1300 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Iraq", "Syria", "Turkey", "Iran", "Israel", "Palestine", "Lebanon", "Jordan", "Egypt"]
        },
        {
          "Stage": "The Exodus and the Law",
          "Years": [-1300, -1200],
          "Labels": ["1300 BCE", "1200 BCE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Egypt", "Israel", "Palestine", "Jordan", "Saudi Arabia"]
        },
        {
          "Stage": "The Judges and the Kings of Israel",
          "Years": [-1200, -587],
          "Labels": ["1200 BCE", "587 BCE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Israel", "Palestine", "Jordan", "Lebanon", "Syria", "Iraq"]
        },
        {
          "Stage": "The Babylonian Exile and Return",
          "Years": [-587, -539],
          "Labels": ["587 BCE", "539 BCE"],
          "Level": 0,
          "Color": fourthColor,
          "Geography": ["Israel", "Palestine", "Jordan", "Lebanon", "Syria", "Iraq", "Iran"]
        },
        {
          "Stage": "Post-Biblical History",
          "Years": [-539, 94],
          "Labels": ["539 BCE", "94 CE"],
          "Level": 0,
          "Color": fifthColor,
          "Geography": ["Israel", "Palestine", "Jordan", "Lebanon", "Syria", "Iraq", "Iran", "Egypt", "Turkey", "Greece", "Italy", "Libya", "Tunisia", "Algeria",
             "Morocco", "Spain", "France", "Cyprus", "Armenia", "Georgia", "Saudi Arabia", "Yemen", "Oman", "Kuwait", "Bahrain", "UAE", "Qatar", "Afghanistan",
              "Pakistan", "Uzbekistan", "Turkmenistan", "Kazakhstan", "Bulgaria", "North Macedonia", "Albania", "Romania", "Sudan", "Ethiopia"]
        },
        {
          "Stage": "The Jewish War",
          "Years": [66, 70],
          "Labels": ["66 CE", "70 CE"],
          "Level": 1,
          "Color": sixthColor,
          "Geography": ["Israel", "Palestine", "Lebanon", "Syria", "Jordan", "Egypt", "Turkey", "Cyprus"]
        }
      ],
      "Ancient regions": ["Judea", "Galilee", "Samaria", "Idumea", "Jerusalem", "Perea", "Decapolis", "Syria", "Alexandria", "Egypt", "Rome", "Parthia", "Babylonia", "Arabia", "Phoenicia", "Mesopotamia", "Cyprus", "Persia", "Galatia", "Asia Minor"],
      
      "Initial Geography": ["Israel", "Palestine", "Jordan", "Lebanon", "Egypt", 
        "Syria", "Iraq", "Saudi Arabia", "Turkey", "Cyprus", "Italy", "Iran"]

    },
    {
      "Index": 5,
      "Author/Text Title": "Kojiki",
      "Date for timeline": 712,
      "Fundamental Works": { "Title": "Kojiki", "Date of Issue": "712 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
      "Author's framework": "Shinto",
      "Stages of cycles": "-",
      "Timeline Stages": [
        {
          "Stage": "Mythological Age (Time Before Human History)",
          "Years": [-4000, -660],
          "Labels": ["4000 BCE", "660 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Japan"],
        },
        {
          "Stage": "Historical Age (Legendary and Semi-Historical Period)",
          "Years": [-660, -499],
          "Labels": ["660 BCE", "499 BCE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Japan"]
        }
      ],
      "Ancient regions": ["Wa", "Yamato", "Izumo", "Tsukushi", "Takamagahara", "Ashihara no Nakatsukuni", "Koshi", "Awaji", "Owari", "Hyuga", "Tsushima", "Hokkaido"],
      
      "Initial Geography": ["Japan"]
    },
    {
      "Index": 6,
      "Author/Text Title": "Nihongi",
      "Date for timeline": 720,
      "Fundamental Works": { "Title": "Nihongi", "Date of Issue": "720 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
      "Author's framework": "Primarily Shinto, secondarily Buddhism",
      "Stages of cycles": "-",
      "Timeline Stages": [
        {
          "Stage": "Mythological Age (Kami no Yo)",
          "Years": [-4000, -660],
          "Labels": ["4000 BCE", "660 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Japan", "Korea"]
        },
        {
          "Stage": "Semi-Historical Age",
          "Years": [-660, 600],
          "Labels": ["660 BCE", "600 CE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Japan", "South Korea", "North Korea", "China"]
        },
        {
          "Stage": "Historical Age",
          "Years": [600, 720],
          "Labels": ["600 CE", "720 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Japan", "South Korea", "North Korea", "China", "Vietnam", "Laos", "Thailand", "Malaysia", "Indonesia", "Philippines", "Cambodia", "Myanmar"]
        }
      ],
      "Ancient regions": ["Wa", "Yamato", "Tsukushi", "Koshi", "Kibi", "Silla", "Baekje", "Goguryeo", "Kara", "Paekche", "Tunguska", "Lelang", "China", "Yamatai", "Ryukyu Islands"],
      
     "Initial Geography": ["Japan", "South Korea", "North Korea", "China"]

    },

    {
      "Index": 7,
      "Author/Text Title": "Ferdawsi",
      "Date for timeline": 1010,
      "Fundamental Works": { "Title": "Persian Book of Kings (Shahnameh)", "Date of Issue": "1010 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "Mythological: Ahura Mazda creates universe.",
      "Author's framework": "Primarily Zoroastrianism, secondarily Islam",
      "Stages of cycles": ["Truth and Justice -> Prosperity and Victory", "Tyranny, greed, and falsehood -> Death and Decline"],
      "Timeline Stages": [
        {
          "Stage": "Mythical Age",
          "Years": [-4000, -2000],
          "Labels": ["4000 BCE", "2000 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Iran", "Afghanistan", "Iraq", "Uzbekistan", "Tajikistan", "Kazakhstan", "Turkmenistan", "Armenia", "Azerbaijan",
             "Georgia", "Turkey", "India", "China", "Yemen", "Egypt"]
        },
        {
          "Stage": "Legendary Age",
          "Years": [-2000, -330],
          "Labels": ["2000 BCE", "330 BCE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Iran", "Afghanistan", "Iraq", "Turkmenistan", "Uzbekistan", "Tajikistan", "Armenia", "Azerbaijan", "Georgia", "Turkey", "Syria", "Pakistan"]
        },
        {
          "Stage": "Historical Age",
          "Years": [-330, 651],
          "Labels": ["330 BCE", "651 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Iran", "Afghanistan", "Iraq", "Syria", "Turkey", "Armenia", "Azerbaijan", "Georgia", "Turkmenistan", "Uzbekistan", "Tajikistan", "Pakistan", "India"]
        }
      ],
      "Ancient regions": ["Iran", "Turan", "Zabulistan", "Sistan", "Mazandaran", "Khwarazm", "India", "China", "Rome", "Arabia", "Balkh", "Khorasan", "Ctesiphon", "Isfahan", "Herat", "Rey", "Armenia", "Caucasus", "Bukhara", "Gorgan", "Syria", "Yemen", "Sogdiana", "Parthia", "Azerbaijan", "Tabaristan", "Georgia"],
      
      "Initial Geography": ["Iran", "Central Asia", "Afghanistan", "Uzbekistan", "Pakistan",
        "Turkmenistan", "India", "China", "Turkey", "Iraq", "Syria", "Armenia", 
        "Georgia", "Azerbaijan", "Yemen", "Tajikistan", "Oman", "Saudi Arabia"]

    },
    {
      "Index": 8,
      "Author/Text Title": "Ibn Khaldun",
      "Date for timeline": 1377,
      "Fundamental Works": { "Title": "Muqaddimah", "Date of Issue": "1377 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "-",
      "Author's framework": "Rational, sociological",
      "Stages of cycles": ["The Formation of a Dynasty (Gaining Asabiyyah)", "The Flourishing of the Dynasty", "The Decline of the Dynasty (Losing Asabiyyah)"],
      "Timeline Stages": [
        {
          "Stage": "Ancient Egypt",
          "Years": [-3100, -30],
          "Labels": ["3100 BCE", "30 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Egypt", "Sudan", "Israel", "Palestine", "Syria", "Lebanon", "Jordan", "Libya", "Saudi Arabia", "Greece", "Turkey"]
        },
        {
          "Stage": "Mesopotamia",
          "Years": [-3000, -539],
          "Labels": ["3000 BCE", "539 BCE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": ["Iraq", "Kuwait", "Syria", "Turkey", "Iran"]
        },
        {
          "Stage": "Pre-Islamic Tribal Arabia",
          "Years": [-500, 622],
          "Labels": ["500 BCE", "622 CE"],
          "Level": 1,
          "Color": thirdColor,
          "Geography": ["Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Bahrain", "Kuwait", "Jordan", "Iraq", "Syria"]
        },
        {
          "Stage": "Life of the Prophet Muhammad",
          "Years": [570, 632],
          "Labels": ["570 CE", "632 CE"],
          "Level": 0,
          "Color": fourthColor,
          "Geography": ["Saudi Arabia", "Jordan", "Syria", "Yemen"]
        },
        {
          "Stage": "Umayyad Caliphate",
          "Years": [661, 750],
          "Labels": ["661 CE", "750 CE"],
          "Level": 1,
          "Color": fifthColor,
          "Geography": ["Spain", "Portugal", "France", "Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Sudan", "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates",
             "Qatar", "Bahrain", "Kuwait", "Iraq", "Syria", "Jordan", "Lebanon", "Israel", "Palestine", "Turkey", "Armenia", "Georgia", "Azerbaijan", "Iran", "Afghanistan", "Pakistan", 
             "Turkmenistan", "Uzbekistan", "Tajikistan", "Kazakhstan"]
        },
        {
                  "Stage": "Abbasid Caliphate",
                  "Years": [750, 1258],
                  "Labels": ["750 CE", "1258 CE"],
                  "Level" : 1,
                  "Color" : sixthColor,
                  "Geography": ["Spain", "Portugal", "Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Sudan", "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", 
                    "Qatar", "Bahrain", "Kuwait", "Iraq", "Syria", "Jordan", "Lebanon", "Israel", "Palestine", "Turkey", "Armenia", "Georgia", "Azerbaijan", "Iran", "Afghanistan", 
                    "Pakistan", "Turkmenistan", "Uzbekistan", "Tajikistan", "Kazakhstan", "Kyrgyzstan", "Bangladesh", "India"]
                },
                {
                  "Stage": "Almoravid Dynasty",
                  "Years": [1040, 1147],
                  "Labels": ["1040 CE", "1147 CE"],
                  "Level" : 2,
                  "Color" : seventhColor,
                  "Geography": ["Morocco", "Mauritania", "Algeria", "Tunisia", "Mali", "Spain", "Portugal", "Western Sahara", "Senegal"]
                },
                {
                  "Stage": "Almohad Dynasty",
                  "Years": [1121, 1269],
                  "Labels": ["1121 CE", "1269 CE"],
                  "Level" : 3,
                  "Color" : eighthColor,
                  "Geography": ["Morocco", "Mauritania", "Algeria", "Tunisia", "Libya", "Mali", "Spain", "Portugal", "Western Sahara", "Senegal", "Niger"]
                },
                {
                  "Stage": "Hafsids of Tunisia",
                  "Years": [1229, 1574],
                  "Labels": ["1229 CE", "1574 CE"],
                  "Level" : 2,
                  "Color" : ninthColor,
                  "Geography": ["Tunisia", "Algeria", "Libya"]
                },
                {
                  "Stage": "Mongol Empire",
                  "Years": [1206, 1368],
                  "Labels": ["1206 CE", "1368 CE"],
                  "Level" : 4,
                  "Color" : tenthColor,
                  "Geography": ["China", "Mongolia", "Russia", "Kazakhstan", "Kyrgyzstan", "Uzbekistan", "Turkmenistan", "Tajikistan", "Afghanistan", "Pakistan",
                     "India", "Iran", "Iraq", "Turkey", "Armenia", "Georgia", "Azerbaijan", "Ukraine", "Belarus", "Moldova", "Romania", "Bulgaria", "Poland", "Hungary" , "Lithuania", 
                     "Latvia", "Estonia", "South Korea", "North Korea", "Myanmar", "Vietnam"]
                },
                {
                  "Stage": "Reconquista",
                  "Years": [718, 1377],
                  "Labels": ["718 CE", "1377 CE"],
                  "Level" : 0,
                  "Color" : eleventhColor,
                  "Geography": ["Portugal", "Spain"]
                }
      ],
      "Ancient regions": ["Ifriqiya", "Maghreb", "Egypt", "Al-Andalus", "Arabia", "Persia", "Syria", "Iraq", "Yemen", "Berber Kingdoms", "Byzantium", "Sudan", "Sicily", "Constantinople", "Khorasan", "Transoxiana", "Sassanid Empire"],
      
      "Initial Geography": ["Tunisia", "Algeria", "Libya", "Morocco", "Egypt", 
        "Spain", "Portugal", "Saudi Arabia", "Iran", "Syria", "Iraq", "Yemen", 
        "Turkey", "Sudan", "Italy", "Uzbekistan", "Tajikistan", "Turkmenistan"]

    },
    {
      "Index": 9,
      "Author/Text Title": "Isaac Newton",
      "Date for timeline": 1728,
      "Fundamental Works": { "Title": "The Chronology of Ancient Kingdoms Amended", "Date of Issue": "1728 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "Theological: Genesis",
      "Author's framework": "Christian, scientific",
      "Stages of cycles": "-",
      "Timeline Stages": [
        {
          "Stage": "Early Biblical Events",
          "Years": [-4000, -2500],
          "Labels": ["4000 BCE", "2500 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Iraq", "Kuwait", "Syria", "Turkey", "Egypt", "Israel", "Palestine", "Lebanon", "Jordan", "Iran", "Saudi Arabia", "Ethiopia", "Sudan", "Greece"]
        },
        {
          "Stage": "Ancient Egypt",
          "Years": [-2000, -568],
          "Labels": ["2000 BCE", "568 BCE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Egypt", "Sudan", "Libya", "Israel", "Palestine", "Lebanon", "Syria", "Jordan"]
        },
        {
          "Stage": "Assyria",
          "Years": [-1500, -600],
          "Labels": ["1500 BCE", "600 BCE"],
          "Level": 1,
          "Color": thirdColor,
          "Geography": ["Iraq", "Syria", "Turkey", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Iran", "Armenia", "Saudi Arabia", "Kuwait"]
        },
        {
          "Stage": "Babylon",
          "Years": [-1500, -539],
          "Labels": ["1500 BCE", "539 BCE"],
          "Level": 2,
          "Color": fourthColor,
          "Geography": ["Iraq", "Kuwait", "Syria", "Turkey", "Lebanon", "Israel", "Palestine", "Jordan", "Saudi Arabia", "Iran", "Egypt"]
        },
        {
                  "Stage": "Persia",
                  "Years": [-550, -330],
                  "Labels": ["550 BCE", "330 BCE"],
                  "Level" : 0,
                  "Color": fifthColor,
                  "Geography": ["Iran", "Iraq", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Egypt", "Jordan", "Afghanistan", "Pakistan", "Armenia", 
                    "Uzbekistan", "Turkmenistan", "Tajikistan", "Greece"]
                },
                {
                  "Stage": "Trojan war, Greek period",
                  "Years": [-950, -146],
                  "Labels": ["950 BCE", "146 BCE"],
                  "Level" : 3,
                  "Color": sixthColor,
                  "Geography": ["Turkey", "Greece", "Cyprus", "Italy", "Albania", "North Macedonia", "Bulgaria", "Libya", "Egypt"]
                }
      ],
      "Ancient regions": ["Egypt", "Assyria", "Babylon", "Greece", "Israel", "Judah", "Persia", "Scythia", "Troy", "Thebes", "Phrygia"],
      
      "Initial Geography": ["Egypt", "Iraq", "Syria", "Greece", "Israel", 
        "Turkey", "Iran", "Georgia", "Ukraine", "Lebanon", "Jordan"]

    },
    {
      "Index": 10,
      "Author/Text Title": "Edward Gibbon",
      "Date for timeline": 1781,
      "Fundamental Works": { "Title": "The History of the Decline and Fall of the Roman Empire", "Date of Issue": "1781 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "-",
      "Author's framework": "Sociological, philosophical",
      "Stages of cycles": ["Rise", "Fall"],
      "Timeline Stages": [
        {
          "Stage": "The Roman Empire from Trajan to the Fall of the Western Roman Empire",
          "Years": [98, 476],
          "Labels": ["98 CE", "476 CE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Italy", "Spain", "Portugal", "France", "Germany", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Austria", "Hungary", "Slovenia", "Croatia",
             "Bosnia and Herzegovina", "Serbia", "Romania", "Bulgaria", "Greece", "Albania", "North Macedonia", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan",
              "Iraq", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "United Kingdom", "Montenegro", "Cyprus"]
        },
        {
          "Stage": "The Byzantine (Eastern Roman) Empire",
          "Years": [476, 1204],
          "Labels": ["476 CE", "1204 CE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Turkey", "Greece", "Cyprus", "Bulgaria", "Serbia", "Albania", "Macedonia", "Bosnia and Herzegovina", "Montenegro", "Croatia", "Italy", "Ukraine", "Georgia", 
            "Armenia", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco"]
        },
        {
          "Stage": "The Final Decline of the Byzantine Empire and the Fall of Constantinople",
          "Years": [1204, 1453],
          "Labels": ["1204 CE", "1453 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Turkey", "Greece", "Albania", "North Macedonia", "Bulgaria", "Serbia", "Montenegro", "Bosnia and Herzegovina", "Romania", "Cyprus"]
        }
      ],
      "Ancient regions": ["Rome", "Gaul", "Britannia", "Hispania", "Germania", "North Africa", "Constantinople", "Asia Minor", "Greece", "Syria", "Palestine", "Egypt", "Visigothic Kingdom", "Ostrogothic Kingdom", "Vandal Kingdom", "Francia", "Persia", "Arabia"],
      
      "Initial Geography": ["Italy", "France", "United Kingdom", "Spain", 
        "Germany", "Tunisia", "Algeria", "Libya", "Turkey", "Greece", "Syria",
         "Israel", "Palestine", "Egypt", "Iraq", "Iran", "Saudi Arabia", "Jordan",
          "Portugal", "Hungary", "Bulgaria", "Serbia"]

    },
    {
      "Index": 11,
      "Author/Text Title": "Georg Wilhelm Friedrich Hegel",
      "Date for timeline": 1837,
      "Fundamental Works": { "Title": "Philosophy of History", "Date of Issue": "1837 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "History begins with the emergence of self-consciousness",
      "Author's framework": "Philosophical, teleological",
      "Stages of cycles": ["Thesis", "Antithesis", "Synthesis"],
      "Timeline Stages": [
        {
          "Stage": "Oriental World",
          "Years": [-3000, -500],
          "Labels": ["3000 BCE", "500 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Iraq", "Syria", "Kuwait", "Egypt", "Sudan", "Iran", "India", "Pakistan", "China", "Israel", "Palestine", "Lebanon", "Jordan", "Turkey", 
            "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates"]
        },
        {
          "Stage": "Greek World",
          "Years": [-800, -300],
          "Labels": ["800 BCE", "300 BCE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": ["Greece", "Turkey", "Italy", "Albania", "North Macedonia", "Bulgaria", "Cyprus", "Egypt", "Syria", "Lebanon", "Israel", "Palestine", "Libya", 
            "Iran", "Afghanistan", "Pakistan"]
        },
        {
          "Stage": "Roman World",
          "Years": [-500, 476],
          "Labels": ["500 BCE", "476 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Italy", "France", "Spain", "Portugal", "Germany", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Austria", "Hungary", "Slovenia", "Croatia", 
            "Bosnia and Herzegovina", "Serbia", "Romania", "Bulgaria", "Greece", "Albania", "Macedonia", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "Jordan", 
            "Iraq", "Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "United Kingdom", "Malta"]
        },
        {
          "Stage": "Germanic World",
          "Years": [476, 1800],
          "Labels": ["476 CE", "1800 CE"],
          "Level": 0,
          "Color": fourthColor,
          "Geography": ["Germany", "France", "Austria", "Switzerland", "Belgium", "Netherlands", "Luxembourg", "Italy", "England", "Denmark", "Sweden",
             "Norway", "Poland", "Czech Republic", "Hungary", "Slovenia", "Slovakia", "Romania", "Estonia", "Latvia", "Lithuania", "Finland"]
        }
      ],
      "Ancient regions": ["China", "India", "Persia", "Egypt", "Greece", "Rome", "Germany"],

      "Initial Geography": ["China", "India", "Iran", "Egypt", "Greece", "Italy",
         "Germany"]

    },
    {
      "Index": 12,
      "Author/Text Title": "Max Weber",
      "Date for timeline": 1920,
      "Fundamental Works": [
        { "Title": "The Sociology of Religion", "Date of Issue": "1920 CE" },
        { "Title": "Economy and Society", "Date of Issue": "1922 CE" }
      ],
      "Timeline": [-5000, 2000],
      "Origin of history": "-",
      "Author's framework": "Sociological: theological, historical, economic",
      "Stages of cycles": ["Rationalization"],
      "Timeline Stages": [
        {
          "Stage": "Ancient Religions: Patrimonial and theocratic rule, kinship-based governance",
          "Years": [-3000, -500],
          "Labels": ["3000 BCE", "500 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Iraq", "Syria", "Kuwait", "Egypt", "Sudan", "Iran", "Pakistan", "India", "China", "Israel", "Palestine", "Lebanon", "Jordan",
             "Turkey", "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Bahrain", "Qatar", "Greece"]
        },
        {
          "Stage": "Axial Age Religions: Feudalism, charismatic authority, decentralized governance",
          "Years": [-600, 200],
          "Labels": ["600 BCE", "200 CE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": ["China", "India", "Pakistan", "Nepal", "Sri Lanka", "Iran", "Iraq", "Afghanistan", "Turkey", "Greece", "Italy", "Israel", "Palestine", "Lebanon", 
            "Jordan", "Syria", "Japan", "South Korea", "North Korea", "Vietnam", "Cambodia", "Thailand", "Indonesia", "Myanmar", "Egypt", "Libya", "Tunisia", "Spain", "France"]
        },
        {
          "Stage": "Medieval Religions: Rise of centralized monarchies, early bureaucratic structures, absolutism",
          "Years": [400, 1500],
          "Labels": ["400 CE", "1500 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["France", "Germany", "Spain", "Portugal", "Italy", "United Kingdom", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Austria", "Poland", 
            "Hungary", "Czech Republic", "Slovakia", "Ireland", "Turkey", "Greece", "Bulgaria", "North Macedonia", "Serbia", "Romania", "Saudi Arabia", "Iraq", "Syria", "Lebanon", 
            "Israel", "Palestine", "Jordan", "Egypt", "Libya", "Algeria", "Morocco", "Tunisia", "Russia", "Ukraine", "Sweden", "Norway", "Denmark", "Finland"]
        },
        {
          "Stage": "Modern Religions: Bureaucratization, rational-legal authority, industrial capitalism",
          "Years": [1500, 2000],
          "Labels": ["1500 CE", "2000 CE"],
          "Level": 0,
          "Color": fourthColor,
          "Geography": ["United Kingdom", "France", "Germany", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Austria", "United States",
             "Canada", "Sweden", "Denmark", "Norway", "Finland", "Italy", "Spain", "Portugal", "Greece", "Russia", "Ukraine", "Belarus", "Poland", 
             "Hungary", "Bulgaria", "Romania", "Turkey", "Saudi Arabia", "Egypt", "Algeria", "Morocco", "Tunisia", "Libya", "Israel", "Jordan", 
             "Lebanon", "Syria", "Iraq", "Iran", "India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "China", "Japan", "South Korea", "Taiwan", 
             "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "South Africa", "Nigeria", "Kenya", "Ghana",
             "Tanzania", "Ethiopia", "Dem. Rep. Congo"]
        }
      ],
      "Ancient regions": [
        "Persia", "Switzerland", "The Netherlands", "Eastern Europe", "Ancient Israel", "Western Europe", "France", 
        "Ancient Greece", "Medieval Europe", "Germany", "Medieval Japan", "Ottoman Empire", "Islamic World", "Byzantine Empire", 
        "Buddhist Asia", "Japan", "Mesopotamia", "China", "Ancient Egypt", "India", "United States", "Medieval Christendom", 
        "England", "Ancient Rome"
      ],
      "Initial Geography": ["Switzerland", "Lebanon", "The Netherlands", "France", 
        "Egypt", "Greece", "Palestine", "Myanmar", "Czech Republic", "Bangladesh", 
        "Sri Lanka", "Germany", "Vietnam", "Pakistan", "Italy", "Poland", "Israel",
         "Syria", "Iran", "Turkey", "Iraq", "Japan", "United Kingdom", "Cambodia",
          "Hungary", "Indonesia", "Europe", "Thailand", "Malaysia", "China", 
          "Yemen", "United States", "India", "Saudi Arabia", "Jordan", "Japan"]

    },
    {
      "Index": 13,
      "Author/Text Title": "Oswald Spengler",
      "Date for timeline": 1921,
      "Fundamental Works": { "Title": "The Decline of the West", "Date of Issue": "1921 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "-",
      "Author's framework": "Philosophical, fatalistic",
      "Stages of cycles": ["Birth (Spring)", "Growth and Flourishing (Summer)", "Maturity and Rationalization (Autumn)", "Decline (Winter)"],
      "Timeline Stages": [
        {
          "Stage": "Egyptian Civilization (early high culture)",
          "Years": [-3000, -300],
          "Labels": ["3000 BCE", "300 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": []
        },
        {
          "Stage": "Mesopotamian/Babylonian Civilization (early high culture)",
          "Years": [-3000, -500],
          "Labels": ["3000 BCE", "500 BCE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": []
        },
        {
          "Stage": "Greek (Classical Civilization)",
          "Years": [-1100, -200],
          "Labels": ["1100 BCE", "200 BCE"],
          "Level": 2,
          "Color": thirdColor,
          "Geography": []
        },
        {
          "Stage": "Roman (Classical Civilization)",
          "Years": [-500, 500],
          "Labels": ["500 BCE", "500 CE"],
          "Level": 1,
          "Color": fourthColor,
          "Geography": []
        },
        {
                  "Stage": "Arabian (Magian Civilization)",
                  "Years": [300, 1500],
                  "Labels": ["300 CE", "1500 CE"],
                  "Level" : 0,
                  "Color": fifthColor,
                  "Geography": ["Egypt", "Sudan", "Libya", "Israel", "Palestine", "Lebanon", "Syria", "Jordan", "Saudi Arabia", "Iraq", "Cyprus"]
                },
                {
                  "Stage": "Medieval Europe (Faustian Civilization)",
                  "Years": [900, 1500],
                  "Labels": ["900 CE", "1500 CE"],
                  "Level" : 1,
                  "Color": sixthColor,
                  "Geography": ["France", "Germany", "United Kingdom", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Switzerland", "Austria", "Hungary", "Poland", "Czech Republic", 
                    "Sweden", "Norway", "Denmark", "Romania", "Croatia", "Slovakia", "Ireland"]
                },
                {
                  "Stage": "Renaissance and Reformation (Faustian Civilization)",
                  "Years": [1500, 1800],
                  "Labels": ["1500 CE", "1800 CE"],
                  "Level" : 0,
                  "Color": seventhColor,
                  "Geography": ["Italy", "Germany", "United Kingdom", "France", "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Hungary", "Poland", "Sweden", "Norway", 
                    "Denmark", "Russia", "United States", "Canada"]
                },
                {
                  "Stage": "Industrialization and Modernity (Faustian Civilization)",
                  "Years": [1800, 2000],
                  "Labels": ["1800 CE", "2000 CE"],
                  "Level" : 0,
                  "Color": eighthColor,
                  "Geography": ["United Kingdom", "United States", "Germany", "France", "Belgium", "Netherlands", "Italy", "Russia", "Japan", "Sweden", "Denmark", "Norway", "Canada", "Mexico", 
                    "Brazil", "Argentina", "Austria", "Hungary", "Spain", "Portugal", "Australia", "New Zealand"]
                }
      ],
      "Ancient regions": ["Egypt", "Babylonia", "Greece", "Rome", "Mesopotamia", "Persia", "Byzantine Empire", "Arabia", "India", "China"],
      
      "Initial Geography": ["Egypt", "Iraq", "Greece", "Italy", "Iran", "Turkey", 
        "Saudi Arabia", "India", "China", "Yemen", "Oman", "UAE", "Qatar", 
        "Bahrain", "Kuwait", "Pakistan", "Bangladesh"]

    },
    {
      "Index": 14,
      "Author/Text Title": "Arnold J. Toynbee",
      "Date for timeline": 1950,
      "Fundamental Works": { "Title": "A Study of History", "Date of Issue": "1934–1961 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "History starts when societies respond to significant challenges",
      "Author's framework": "Spiritual, mystical, empirical",
      "Stages of cycles": ["Birth", "Growth", "Breakdown", "Disintegration"],
      "Timeline Stages": [
        {
          "Stage": "Egyptian Civilization",
          "Years": [-3000, -30],
          "Labels": ["3000 BCE", "30 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Egypt", "Sudan", "Libya", "Israel", "Palestine", "Lebanon", "Syria", "Jordan", "Saudi Arabia", "Cyprus", "Ethiopia"]
        },
        {
          "Stage": "Sumerian/Babylonian Civilization",
          "Years": [-3000, -500],
          "Labels": ["3000 BCE", "500 BCE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": ["Iraq", "Kuwait", "Syria", "Turkey", "Iran", "Jordan", "Israel", "Palestine", "Lebanon", "Saudi Arabia", "Bahrain", "Qatar", "United Arab Emirates", "Egypt"]
        },
        {
          "Stage": "Minoan Civilization",
          "Years": [-2700, -1400],
          "Labels": ["2700 BCE", "1400 BCE"],
          "Level": 2,
          "Color": thirdColor,
          "Geography": ["Greece", "Turkey", "Cyprus", "Egypt", "Syria", "Israel", "Palestine", "Italy", "Malta", "Libya"]
        },
        {
          "Stage": "Hittite Civilization",
          "Years": [-1600, -1200],
          "Labels": ["1600 BCE", "1200 BCE"],
          "Level": 4,
          "Color": fourthColor,
          "Geography": ["Turkey", "Syria", "Iraq", "Lebanon", "Israel", "Palestine", "Jordan", "Cyprus", "Greece", "Armenia", "Georgia"]
        },
        {
                  "Stage": "Indus Valley Civilization",
                  "Years": [-2600, -1900],
                  "Labels": ["2600 BCE", "1900 BCE"],
                  "Level" : 3,
                  "Color": fifthColor,
                  "Geography": ["Pakistan", "India", "Afghanistan", "Iran", "Oman", "United Arab Emirates"]
                },
                {
                  "Stage": "Maya Civilization",
                  "Years": [-1800, 900],
                  "Labels": ["1800 BCE", "900 CE"],
                  "Level" : 3,
                  "Color": sixthColor,
                  "Geography": ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador"]
                },
                {
                  "Stage": "Classical Greek Civilization",
                  "Years": [-800, -146],
                  "Labels": ["800 BCE", "146 BCE"],
                  "Level" : 2,
                  "Color": seventhColor,
                  "Geography": ["Greece", "Turkey", "Italy", "Cyprus", "Egypt", "Syria", "Lebanon", "Israel", "Palestine", "Albania", "Bulgaria", "North Macedonia", "Libya", 
                    "Georgia"]
                },
                {
                  "Stage": "Persian Civilization",
                  "Years": [-550, 651],
                  "Labels": ["550 BCE", "651 CE"],
                  "Level" : 4,
                  "Color": eighthColor,
                  "Geography": ["Iran", "Iraq", "Turkey", "Afghanistan", "Pakistan", "Syria", "Egypt", "Lebanon", "Israel", "Palestine", "Jordan", "Armenia", "Azerbaijan", 
                    "Georgia", "Bulgaria", "Libya", "Uzbekistan", "Tajikistan", "Turkmenistan"]
                },
                {
                  "Stage": "Western Roman Civilization",
                  "Years": [-500, 476],
                  "Labels": ["500 BCE", "476 CE"],
                  "Level" : 1,
                  "Color": ninthColor,
                  "Geography": ["Italy", "France", "Spain", "Portugal", "United Kingdom", "Germany", "Switzerland", "Belgium", "Netherlands", "Austria", "Hungary", "Croatia", 
                    "Serbia", "Albania", "Tunisia", "Libya", "Morocco", "Algeria", "Bulgaria", "Greece", "Turkey"]
                },
                {
                  "Stage": "Chinese Civilization",
                  "Years": [-1600, 2000],
                  "Labels": ["1000 BCE", "220 CE"],
                  "Level" : 5,
                  "Color": tenthColor,
                  "Geography": ["China", "Taiwan", "Mongolia", "North Korea", "South Korea", "Vietnam", "Japan", "Tibet", "Xinjiang", "Bhutan", "Nepal", "Laos", "Myanmar"]
                },
                {
                  "Stage": "Byzantine Civilization",
                  "Years": [330, 1453],
                  "Labels": ["330 CE", "1453 CE"],
                  "Level" : 7,
                  "Color": eleventhColor,
                  "Geography": ["Turkey", "Greece", "Bulgaria", "Serbia", "Macedonia", "Albania", "Cyprus", "Syria", "Israel", "Palestine", "Lebanon", "Jordan", "Egypt", 
                    "Libya", "Tunisia", "Italy", "Montenegro", "Bosnia and Herzegovina", "Romania", "Georgia", "Armenia", "Iraq", "Algeria"]
                },
                {
                  "Stage": "Islamic Civilization",
                  "Years": [622, 2000],
                  "Labels": ["622 CE", "2000 CE"],
                  "Level" : 0,
                  "Color": twelvethColor,
                  "Geography": ["Saudi Arabia", "Iraq", "Syria", "Egypt", "Turkey", "Iran", "Pakistan", "India", "Spain", "Morocco", "Algeria", "Libya", "Tunisia", "Sudan",
                     "Yemen", "Afghanistan", "Lebanon", "Jordan", "Israel", "Palestine", "Uzbekistan", "Kazakhstan", "Malaysia", "Indonesia", "Bangladesh", "Somalia", "Mauritania",
                      "Mali", "Niger", "Chad", "Bosnia and Herzegovina"]
                },
                {
                  "Stage": "Western Christian Civilization",
                  "Years": [800, 2000],
                  "Labels": ["800 CE", "2000 CE"],
                  "Level" : 4,
                  "Color": thirteenthColor,
                  "Geography": ["France", "Germany", "Italy", "United Kingdom", "Spain", "Portugal", "Switzerland", "Belgium", "Netherlands", "Austria", "Hungary", "Poland", 
                    "Sweden", "Denmark", "Norway", "Ireland", "United States", "Canada", "Australia", "New Zealand", "Mexico", "Brazil", "Argentina", "Chile", "South Africa", 
                    "Czech Republic", "Slovakia", "Luxembourg"]
                },
                {
                  "Stage": "Hindu Civilization",
                  "Years": [-1500, 2000],
                  "Labels": ["1500 BCE", "2000 CE"],
                  "Level" : 6,
                  "Color": fourteenthColor,
                  "Geography": ["India", "Nepal", "Pakistan", "Bangladesh", "Sri Lanka", "Afghanistan", "Indonesia", "Malaysia", "Thailand", "Cambodia", "Myanmar", 
                    "Laos", "Vietnam", "Mauritius", "Fiji"]
                },
                {
                  "Stage": "Russian Civilization",
                  "Years": [900, 2000],
                  "Labels": ["900 CE", "2000 CE"],
                  "Level" : 3,
                  "Color": fifteenthColor,
                  "Geography": ["Russia", "Ukraine", "Belarus", "Moldova", "Georgia", "Armenia", "Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Latvia",
                     "Lithuania", "Estonia", "Azerbaijan", "Finland"]
                },
                {
                  "Stage": "Japanese Civilization",
                  "Years": [250, 2000],
                  "Labels": ["250 CE", "2000 CE"],
                  "Level" : 2,
                  "Color": sixteenthColor,
                  "Geography": ["Japan", "South Korea", "Taiwan", "China", "Russia", "Philippines", "Micronesia", "North Korea", "Singapore", "Malaysia", 
                    "Indonesia", "Vietnam", "Myanmar", "Thailand", "Palau"]
                }               
      ],
      "Ancient regions": [
        "Egypt", "Mesopotamia", "Sumer", "Greece", "Rome", "Byzantium", "Syria", "Persia", "India", "China", 
        "Islamic Caliphates", "Mesoamerica (Aztec and Maya)", "Andean (Inca)"
      ],
      "Initial Geography": ["Egypt", "Pakistan", "Bangladesh", "Iraq", "Syria",
         "Greece", "Italy", "Turkey", "Iran", "India", "China", "Saudi Arabia", 
         "Mexico", "Peru", "Germany", "France", "Spain"]

    },
    {
      "Index": 15,
      "Date for timeline": 1951,
      "Author/Text Title": "Karl Jaspers",
      "Fundamental Works": { "Title": "The Origin and Goal of History", "Date of Issue": "1951 CE" },
      "Timeline": [-5000, 2000],
      "Origin of history": "Axial Age",
      "Author's framework": "Existentialist, theological, philosophical",
      "Stages of cycles": "-",
      "Timeline Stages": [
        {
          "Stage": "Pre-Axial Period",
          "Years": [-3000, -800],
          "Labels": ["3000 BCE", "800 BCE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["Egypt", "Iraq", "Iran", "Pakistan", "India", "Turkey", "Syria", "Lebanon", "Israel", "Palestine", "China", "Greece", "Italy", "Afghanistan", "Sudan"]
        },
        {
          "Stage": "Axial Age",
          "Years": [-800, -200],
          "Labels": ["800 BCE", "200 BCE"],
          "Level": 0,
          "Color": secondColor,
          "Geography": ["Greece", "India", "China", "Israel", "Iran", "Iraq", "Pakistan", "Afghanistan", "Turkey", "Lebanon", "Syria", "Israel", "Palestine", "Italy", "Sudan"]
        },
        {
          "Stage": "Post-Axial Age",
          "Years": [-200, 2000],
          "Labels": ["200 BCE", "2000 CE"],
          "Level": 0,
          "Color": thirdColor,
          "Geography": ["Italy", "Turkey", "Iraq", "Saudi Arabia", "Iran", "China", "India", "Pakistan", "Afghanistan", "Russia", "Spain", "Mexico", "Peru",
             "United States", "Germany", "France", "Brazil", "Portugal", "Egypt", "Syria", "Algeria", "Mongolia", "Kazakhstan", "Ecuador", "Chile", "Guatemala", "England", 
             "Australia", "South Africa"]
        }
      ],
      "Ancient regions": ["Greece", "India", "China", "Israel", "Persia", "Mesopotamia", "Egypt", "Rome", "Western Europe", "Islamic World"],
     
"Initial Geography": ["Greece", "India", "China", "Israel", "Iran", "Iraq", 
  "Egypt", "Italy", "Western Europe", "Saudi Arabia", "Turkey", "Syria", "Jordan"]

    },
    {
      "Index": 16,
      "Author/Text Title": "Peter Turchin",
      "Date for timeline": 2006,
      "Fundamental Works": [
        { "Title": "Historical Dynamics", "Date of Issue": "2003 CE" },
        { "Title": "War and Peace and War", "Date of Issue": "2006 CE" },
        { "Title": "Secular Cycles", "Date of Issue": "2009 CE" }
      ],
      "Timeline": [-5000, 2000],
      "Origin of history": "-",
      "Author's framework": "Cliodynamics, empirical",
      "Stages of cycles": ["Growth: demographic, economic", "Stagflation: elite overproduction, malthusian stagnation", "Crisis: state breakdown, depopulation, economic collapse", "Depression: economic recovery, rebuilding state institutions"],
      "Timeline Stages": [
        {
          "Stage": "Medieval England",
          "Years": [1150, 1485],
          "Labels": ["1150 CE", "1485 CE"],
          "Level": 0,
          "Color": firstColor,
          "Geography": ["England", "Wales", "Scotland", "Ireland", "France"]
        },
        {
          "Stage": "Pre-Revolution France",
          "Years": [1200, 1800],
          "Labels": ["1200 CE", "1800 CE"],
          "Level": 1,
          "Color": secondColor,
          "Geography": ["France", "Belgium", "Luxembourg", "Germany", "Switzerland", "Italy", "Spain", "Canada", "United States", "Haiti", "India"]
        },
        {
          "Stage": "Imperial Russia",
          "Years": [1460, 1917],
          "Labels": ["1460 CE", "1917 CE"],
          "Level": 2,
          "Color": thirdColor,
          "Geography": ["Russia", "Ukraine", "Belarus", "Poland", "Lithuania", "Latvia", "Estonia", "Finland", "Georgia", "Armenia", "Azerbaijan", "Kazakhstan",
             "Uzbekistan", "Turkmenistan", "Tajikistan", "Kyrgyzstan", "Moldova", "Romania", "Turkey", "Alaska"]
        },
        {
          "Stage": "Ancient Rome",
          "Years": [-200, 600],
          "Labels": ["200 BCE", "600 CE"],
          "Level": 0,
          "Color": fourthColor,
          "Geography": ["Italy", "Spain", "Portugal", "France", "Belgium", "Switzerland", "Germany", "United Kingdom", "Netherlands", "Austria", "Hungary", "Croatia", 
            "Slovenia", "Serbia", "Romania", "Greece", "Turkey", "Bulgaria", "Albania", "Syria", "Israel", "Palestine", "Jordan", "Lebanon", "Egypt", "Libya", "Tunisia",
             "Algeria", "Morocco", "Cyprus"]
        }
      ],
      "Ancient regions": ["Rome", "China", "Russia", "European Empires", "Islamic Caliphates", "Byzantium", "Ottoman Empire", "France", "Britain", "Muscovite Russia", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"],
      "Initial Geography": ["Italy", "China", "Russia", "Western Europe", 
        "Middle East", "Turkey", "France", "United Kingdom", "Germany", 
        "Saudi Arabia", "Iraq", "Iran", "Syria"]

    }
    
    
   
  ];

  function OtahhIntro() {
    const [selectedAuthor, setSelectedAuthor] = useState(dataset[0]); // Set the initial author/text
    const [hoveredStageColor, setHoveredStageColor] = useState(null); // Store the hovered stage color
    const [hoveredStageCountries, setHoveredStageCountries] = useState([]); // Store the hovered stage countries
    
    const [initialColor, setInitialColor] = useState(null); // Store the initial base color
    const [selectedCircleIndex, setSelectedCircleIndex] = useState(null); // Track the selected circle index
    const svgRef = useRef();
    const zoomScaleRef = useRef(1); // Initialize zoom scale at 1
    const timelineRef = useRef(); // Reference for the timeline SVG

     

  // Function to calculate stroke opacity based on zoom scale factor
  
  
    // Memoized function to set up the projection and path generator
    const renderGlobe = useMemo(() => {
      const initialScale = 170;  // Default size of the globe
      const initialRotation = [0, 0];  // Default rotation angle [longitude, latitude]
  
      const projection = geoOrthographic()
        .scale(initialScale * zoomScaleRef.current)
        .translate([420, 380]) // Center the globe
        .rotate(initialRotation); // Initial rotation [longitude, latitude]
  
      const path = geoPath(projection);
      console.log('Globe projection initialized');
      return { projection, path };
    }, []);
  
    // Static rendering of globe elements (globe outline, landmasses)
    const renderStaticElements = useCallback(() => {
      const { path } = renderGlobe;
  
      d3.json('/datasets/110m.json')
        .then(worldData => {
          console.log('World Data Loaded:', worldData);
          if (!worldData || !worldData.objects || !worldData.objects.countries) {
            console.error('Invalid world data structure:', worldData);
            return;
          }
  
          const land = topojson.feature(worldData, worldData.objects.countries);
  
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
            .attr('fill', '#d3d3d3');
        })
        .catch(error => console.error('Error fetching world data:', error));
    }, [renderGlobe]);
  
    // Function to handle zoom and drag
    const applyDragAndZoom = useCallback(() => {
      const { projection, path } = renderGlobe;
  
      const drag = d3.drag()
        .on('drag', (event) => {
          const rotate = projection.rotate();
          projection.rotate([rotate[0] + event.dx / 4, rotate[1] - event.dy / 4]);
          d3.select(svgRef.current).selectAll('path').attr('d', path);
          console.log('Globe rotated');
        });
  
      const zoom = d3.zoom()
        .scaleExtent([0.5, 8]) // Limit the zoom scale
        .on('zoom', (event) => {
          const currentTransform = event.transform;
          projection.scale(170 * currentTransform.k);  // Adjust the scale based on zoom
          d3.select(svgRef.current).selectAll('path').attr('d', path);  // Update paths
          console.log('Zoom scale:', currentTransform.k);
        });
  
      d3.select(svgRef.current).call(drag).call(zoom);  // Apply both drag and zoom
    }, [renderGlobe]);
  
    // Function to highlight relevant geography on the globe (initial geography effect)
    const highlightGeography = useCallback(() => {
      const { path } = renderGlobe;
  
      d3.json('/datasets/110m.json')
        .then(worldData => {
          console.log("World data loaded for modern countries:", worldData);
  
          const land = topojson.feature(worldData, worldData.objects.countries);
  
          // Clear previous base and hover layers to ensure new countries are rendered
          d3.select(svgRef.current).selectAll('path.land-base').remove();
  
          // Render the base layer using initialColor for each country in "Initial Geography"
          d3.select(svgRef.current).selectAll('path.land-base')
            .data(land.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'land-base')
            .attr('fill', d => {
              const countryName = d.properties.name;
              const initialGeography = selectedAuthor["Initial Geography"];
  
              if (initialGeography && initialGeography.includes(countryName)) {
                
                return initialColor;
              }
  
              return '#d3d3d3';
            })
            .attr('opacity', 1);
        })
        .catch(error => console.error('Error loading world data:', error));
    }, [renderGlobe, selectedAuthor, initialColor]);
  
    // Function to highlight relevant geography on hover
    const highlightGeographyOnHover = useCallback(() => {
      const { path } = renderGlobe;
    
      d3.json('/datasets/110m.json')
        .then(worldData => {
          const land = topojson.feature(worldData, worldData.objects.countries);
          d3.select(svgRef.current).selectAll('path.land-hover').remove();
    
          // Update countries during hover
          d3.select(svgRef.current).selectAll('path.land-hover')
            .data(land.features)
            .join('path')
            .attr('d', path)
            .attr('class', 'land-hover')
            .attr('fill', d => {
              const countryName = d.properties.name;
    
              // If countries are hovered, use the stage color for the hovered countries
              if (hoveredStageCountries.includes(countryName)) {
                return hoveredStageColor;
              }
    
              // If the country is part of "Initial Geography" but not part of the hovered stage, use initialColor
              if (selectedAuthor["Initial Geography"] && selectedAuthor["Initial Geography"].includes(countryName)) {
                return initialColor;
              }
    
              // Default color for countries not part of the hovered stage or "Initial Geography"
              return '#d3d3d3';
            })
            .attr('opacity', 1)
            .raise();
        })
        .catch(error => console.error('Error loading world data:', error));
    }, [renderGlobe, hoveredStageCountries, hoveredStageColor, selectedAuthor, initialColor]);
    
    
  
    // Highlight countries on hover
    useEffect(() => {
      if (hoveredStageColor && hoveredStageCountries.length > 0) {
        highlightGeographyOnHover();
      }
    }, [hoveredStageColor, hoveredStageCountries, highlightGeographyOnHover]);
  
    // Update initialColor when selectedAuthor changes
    useEffect(() => {
      if (selectedAuthor["Initial Geography"]) {
        setInitialColor("#ffcc00");
        console.log("Initial color set:", "#ffcc00");
      }
    }, [selectedAuthor]);
  
    // Render static elements, apply drag/zoom, and highlight geography initially
    useEffect(() => {
      renderStaticElements();
      applyDragAndZoom();
      highlightGeography();
    }, [renderStaticElements, applyDragAndZoom, highlightGeography]);
  
    
  
    const renderTimeline = useCallback(() => {
      const width = 1500;
      const height = 200;
     

    // Calculate numSegments as the maximum "Level" value from "Timeline Stages" + 1
   
  
      const svg = d3.select(timelineRef.current)
        .attr("width", width)
        .attr("height", height);
  
      svg.selectAll("*").remove();
  
      const startYear = selectedAuthor.Timeline[0];
      const endYear = selectedAuthor.Timeline[1];
  
      const xScale = d3.scaleLinear()
        .domain([startYear, endYear])
        .range([50, width - 50]);
  
      const xAxis = d3.axisBottom(xScale)
        .ticks(10)
        .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`));
  
      const g = svg.append("g");
  
      const xAxisGroup = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - 20})`)
        .call(xAxis)
        .style('font-size', '16px');
  
      xAxisGroup.selectAll('text')
        .style('font-family', 'Times New Roman, sans-serif');
  
        const timelineRects = g.selectAll("rect")
        .data(selectedAuthor["Timeline Stages"])
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.Years[0]))
        .attr("y", d => 160 - d.Level * 20) // Position based on the level
        .attr("width", d => xScale(d.Years[1]) - xScale(d.Years[0]))
        .attr("height", 20)
        .attr("fill", d => d.Color) // Use the corresponding color from the dataset
        .attr("opacity", 0.5)
        .on("mouseover", function (event, d) {
          const segmentCard = d3.select(".segment-card");
  
          // Set the hovered stage color and countries for highlighting the corresponding countries
          setHoveredStageColor(d.Color);
          setHoveredStageCountries(d.Geography);
       
  
          // Increase border opacity and show segment-card
          d3.select(this)
            .interrupt()
            .transition()
            .duration(200)
            .attr("stroke", d.Color) // Use the same fill color for the border
            .attr("stroke-width", 2)
            .attr("opacity", 1); // Increase opacity of the segment on hover
  
          // Get the bounding box of the hovered rect
          const rectBounds = this.getBoundingClientRect();
          const authorCardBounds = document.querySelector('.author-card-container').getBoundingClientRect();
  
          // Show the segment-card with details and position it centered above the rect
          segmentCard
          .interrupt()
          .style("display", "block")
          .style("border-color", d.Color)
          .style("opacity", 0.9)
          .html(`
            <strong>${d.Stage}</strong><br>
            ${d.Labels[0] || 'N/A'} - ${d.Labels[1] || 'N/A'}<br>
            ${d.Territory ? `<div style="margin-top: 10px;"><label>Stage Territory: </label><p>${d.Territory.join(", ")}</p></div>` : ''}
          `)
          .style("left", `${rectBounds.left + window.scrollX + rectBounds.width / 2 - segmentCard.node().offsetWidth / 2}px`)
          .style("top", `${rectBounds.top - segmentCard.node().offsetHeight - 10 + window.scrollY}px`);
        
  
          // Check for overlap with the author card
          const segmentCardBounds = segmentCard.node().getBoundingClientRect();
          if (
            segmentCardBounds.right > authorCardBounds.left &&
            segmentCardBounds.left < authorCardBounds.right &&
            segmentCardBounds.bottom > authorCardBounds.top &&
            segmentCardBounds.top < authorCardBounds.bottom
          ) {
            segmentCard.style("top", `${rectBounds.top - segmentCardBounds.height - 20 + window.scrollY}px`);
          }
        })
        .on("mousemove", function (event) {
          const segmentCard = d3.select(".segment-card");
          const rectBounds = this.getBoundingClientRect();
  
          segmentCard
            .style("left", `${rectBounds.left + window.scrollX + rectBounds.width / 2 - segmentCard.node().offsetWidth / 2}px`)
            .style("top", `${rectBounds.top - segmentCard.node().offsetHeight - 10 + window.scrollY}px`)
            .style("display", "block");
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke", "none")
            .attr("opacity", 0.5);
        
          d3.select(".segment-card")
            .interrupt()
            .transition()
            .duration(200)
            .style("opacity", 0)
            .on("end", function () {
              d3.select(this).style("display", "none");
            });
        
          // Reset the hovered stage color and countries when mouse is out
          setHoveredStageColor(null);
          setHoveredStageCountries([]);
          
          highlightGeography(); // This will repaint the map with the initialColor
        })
  
      
  

          if (selectedCircleIndex !== null) {
           
          
            // Add the vertical dotted line
            g.append("line")
              .attr("x1", xScale(dataset[selectedCircleIndex]["Date for timeline"]))
              .attr("x2", xScale(dataset[selectedCircleIndex]["Date for timeline"]))
              .attr("y1", height - 200) // Start from the timeline axis
              .attr("y2", height + 30) // End at the bottom of the circle
              .attr("stroke", "red")
              .attr("stroke-width", 1.5)
              .attr("stroke-dasharray", "6 6") // Dotted line
              .attr("opacity", 1)
              .attr("class", "dotted-line"); // Add class for easy selection during zoom
          }
        
        
  
      // Define the zoom behavior
     // Define the zoom behavior
const zoom = d3.zoom()
.scaleExtent([1, 5]) // Set the zoom range
.translateExtent([[0, 0], [width, height]]) // Restrict panning to the SVG area
.on("zoom", (event) => {
  const currentZoomState = event.transform;
  zoomScaleRef.current = currentZoomState.k; // Update the current zoom scale
  const newXScale = currentZoomState.rescaleX(xScale);

  // Update rectangles and circles with the zoom scale
  timelineRects
    .attr("x", d => newXScale(d.Years[0]))
    .attr("width", d => newXScale(d.Years[1]) - newXScale(d.Years[0]));

  // If a circle is selected, update the red dotted line's position
  if (selectedCircleIndex !== null) {
    g.selectAll("line.dotted-line") // Ensure we only select the dotted line
      .attr("x1", newXScale(dataset[selectedCircleIndex]["Date for timeline"]))
      .attr("x2", newXScale(dataset[selectedCircleIndex]["Date for timeline"]));
  }

  // Update axis with the new scale
  xAxisGroup.call(
    d3.axisBottom(newXScale)
      .ticks(10)
      .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`))
  );
});


    
    // Apply the zoom behavior to the group (g) element
    svg.append("rect")
    .attr("x", 0)
    .attr("y", 180) // Start at the y position of the timeline rects (no upward stretch)
    .attr("width", width)
    .attr("height", 45) // Stretch downward based on number of segments
      .attr("fill", "transparent") // Invisible rectangle
      .on("mouseenter", () => {
        svg.call(zoom); // Apply zoom behavior when the mouse enters the invisible zoom area
      })
      .on("mouseleave", () => {
        svg.on(".zoom", null); // Remove zoom behavior when the mouse leaves the invisible zoom area
      });
  }, [selectedAuthor, selectedCircleIndex, highlightGeography]);
    
  useEffect(() => {
    setSelectedCircleIndex(0); // Set index to the first entry initially
    setSelectedAuthor(dataset[0]); // Ensure selected author matches
  }, []);
  
    useEffect(() => {
      renderTimeline();
    }, [selectedAuthor, renderTimeline]);
  
    const handleAuthorChange = (event) => {
      const selectedIndex = event.target.value;
      setSelectedAuthor(dataset[selectedIndex]);
      setSelectedCircleIndex(selectedIndex); // Sync the circle selection with dropdown
    };
  
    return (
      <div>
        <div className="dropdown-container">
          <label htmlFor="author-select">History according to: </label>
          <select id="author-select" onChange={handleAuthorChange} value={selectedCircleIndex}>
            {dataset.map((author, index) => (
              <option key={index} value={index}>
                {author["Author/Text Title"]}
              </option>
            ))}
          </select>
        </div>
    
        <div className="author-card-container">
          <div className="fundamental-works-container">
            <div className="author-card-label">
              {selectedAuthor["Fundamental Works"].Title} - {selectedAuthor["Fundamental Works"]["Date of Issue"]}
            </div>
          </div>
    
          <div className="lower-author-card-container">
            {/* Left Column */}
            <div className="left-column">
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
    
            {/* Right Column */}
            <div className="right-column">
              <div className="framework-container">
                <label>Framework: </label>
                <p>{selectedAuthor["Author's framework"]}</p>
              </div>
    
              <div className="territory-container">
                <label>Territory: </label>
                <p>{selectedAuthor["Ancient regions"] ? selectedAuthor["Ancient regions"].join(", ") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
    
        <div className="globe-container" style={{ position: 'relative' }}>
          {/* Globe SVG */}
          <svg ref={svgRef} className="otahh-globe" width="600" height="600"></svg>
        </div>
    
        {/* Timeline SVG */}
        <div style={{ marginTop: '10px' }}>
          <svg ref={timelineRef} className="timeline"></svg>
        </div>
    
        {/* Segment card element for hover effect */}
        <div className="segment-card"></div>
      </div>
    );
    
    
  }
  
  export default OtahhIntro;
  