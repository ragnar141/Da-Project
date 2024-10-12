import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import '../../components css/otahh_intro.css';



const initialColor = '#ffd17e';
const firstColor = '#ff6c00';
const secondColor = '#219100';
const thirdColor = '#ff0000';
const fourthColor = '#4169E1';
const fifthColor = '#ecdcad';
const sixthColor = '#9cef50';
const seventhColor = '#b90628';
const eighthColor = '#b8a8ca';
const ninthColor = '#7e6771';
const tenthColor = '#d9ef9d';
const eleventhColor = '#8f4b0d';
const twelvethColor = '#3e82d9';
const thirteenthColor = '#cd6886';
const fourteenthColor = '#6c9cea';
const fifteenthColor = '#b2efdd';
const sixteenthColor = '#e81590';
const seventeenthColor = '#1f9fab';


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
      {
        "Stage": "The Ancient Civilizations", 
        "Years": [-2600, -700], 
        "Labels": ["2600 BCE", "700 BCE"],
        "Level" : 0, 
        "Color" : firstColor,
        "Geography": ["Egypt", "Iraq", "Iran", "Turkey", "Lebanon", "Syria", "Israel", 
          "Palestine", "Ukraine", "Russia", "Kazakhstan", "Libya", "India", "Pakistan", "Greece", "Bulgaria", "Armenia"]
      },
      {
        "Stage": "The Rise of the Persian Empire",
        "Years": [-600, -490],
        "Labels": ["600 BCE", "490 BCE"],
        "Level" : 0,
        "Color" : secondColor,
        "Geography" : ["Iran", "Iraq", "Turkey", "Afghanistan", "Pakistan", "Syria", "Lebanon", "Israel", "Palestine", "Jordan",
           "Egypt", "Greece", "Bulgaria", "Macedonia (North Macedonia)", "Libya", "Turkmenistan", "Uzbekistan", "Armenia", "Azerbaijan", "Georgia"]

      },
      {
        "Stage": "The Greco-Persian Wars",
        "Years": [-499, -479],
        "Labels": ["499 BCE", "479 BCE"],
        "Level" : 1,
        "Color" : thirdColor,
        "Geography": ["Greece", "Turkey", "Iran", "Iraq", "Egypt", "Syria", "Lebanon", "Israel", 
          "Palestine", "Jordan", "Cyprus", "Bulgaria", "Macedonia (North Macedonia)", "Libya"]

      },
      {
        "Stage": "The Post-War Period and the Rise of Greek Power",
        "Years": [-479, -425],
        "Labels": ["479 BCE", "425 BCE"],
        "Level" : 0,
        "Color" : fourthColor,
        "Geography": ["Greece", "Turkey", "Cyprus", "Egypt", "Libya", "Syria", "Lebanon", "Israel", "Palestine", "Macedonia (North Macedonia)", "Italy", "Albania", "Bulgaria"]
      }
    ],

    "Ancient regions": ["Egypt", "Persia", "Media", "Babylon", "Lydia", "Scythia", "India", "Libya", 
      "Phoenicia", "Cilicia", "Thrace", "Sogdiana", "Macedonia", "Colchis", "Ionia", 
      "Syria", "Ethiopia", "Arabia", "Bactria"],

    "Initial Geography": ["Greece", "Turkey", "Iran", "Iraq", "Lebanon", "Syria", "Israel", "Palestine", "Jordan", 
      "Egypt", "Libya", "Ukraine", "Kazakhstan", "Bulgaria", "India", "Saudi Arabia", "Georgia", "Armenia", "Azerbaijan", "Ethiopia", 
      "Uzbekistan", "Tajikistan", "Afghanistan", "Sudan", "Pakistan", "Turkmenistan", "Tunisia", "Cyprus", "Macedonia", "Italy"]   
  },

//   {
//     "Index": 2,
//     "Author/Text Title": "Titus Livius (Livy)",
//     "Fundamental Works": { "Title": "History of Rome", "Date of Issue": "around  27 - 9 BC" },
//     "Timeline": [-5000, 2000], 
//     "Origin of history": "Mythological: Trojan War",
//    "Author's framework": "Ancient Roman",
//     "Stages of cycles": "-",
    
//     "Timeline Stages": [
//       {
//         "Stage": "Mythical and Monarchical Rome",
//         "Years": [-753, -509],
//         "Labels": ["753 BCE", "509 BCE"],
//         "Level" : 0,
//         "Color" : firstColor,
//       },
//       {
//         "Stage": "Republican Rome and Internal Struggles",
//         "Years": [-509, -264],
//         "Labels": ["509 BCE", "264 BCE"],
//         "Level" : 0,
//         "Color" : secondColor,
//       },
//       {
//         "Stage": "Rome's Wars and Expansion",
//         "Years": [-264, -146],
//         "Labels": ["264 BCE", "146 BCE"],
//         "Level" : 0,
//         "Color" : thirdColor,
//       },
//       {
//         "Stage": "Moral Decline in the Late Republic",
//         "Years": [-146, -27],
//         "Labels": ["146 BCE", "27 BCE"],
//         "Level" : 0,
//         "Color" : fourthColor,
//       }
//     ]
//     ,
    
//     "Ancient regions": ["Rome", "Etruria", "Latium", "Samnium", "Magna Graecia", "Carthage", "Gaul", "Hispania", 
//       "Macedonia", "Greece", "Sicily", "Sardinia", "Illyria", "Cisalpine Gaul", "Transalpine Gaul", 
//       "Egypt", "Syria", "Pergamon", "Numidia", "Britannia", "Parthia", "Armenia", "Thrace", 
//       "Pontus", "Asia Minor", "Epirus", "Achaea", "Pannonia", "Dacia", "Corsica", "Cyrenaica"],      
    
//   "Geography": [
//   { "Country": "Italy", "Color": [initialColor, firstColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Tunisia", "Color": [initialColor, firstColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "France", "Color": [initialColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Spain", "Color": [initialColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Portugal", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Greece", "Color": [initialColor, firstColor, thirdColor, fourthColor] },
//   { "Country": "Turkey", "Color": [initialColor, firstColor, thirdColor, fourthColor] },
//   { "Country": "Egypt", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Libya", "Color": [initialColor, firstColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Syria", "Color": [initialColor,] },
//   { "Country": "Albania", "Color": [initialColor, firstColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Croatia", "Color": [initialColor, secondColor, fourthColor] },
//   { "Country": "Bosnia", "Color": [initialColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "North Macedonia", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Serbia", "Color": [initialColor, thirdColor ] },
//   { "Country": "Bulgaria", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Hungary", "Color": [initialColor, thirdColor, fourthColor ] },
//   { "Country": "Romania", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Georgia", "Color": [initialColor, firstColor] },
//   { "Country": "Armenia", "Color": [initialColor, ] },
//   { "Country": "UK", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Iraq", "Color": [initialColor] },
//   { "Country": "Iran", "Color": [initialColor] },
//   { "Country": "Morocco", "Color": [initialColor, ] },
//   { "Country": "Montenegro", "Color": [initialColor, secondColor, thirdColor, fourthColor] },
//   { "Country": "Luxembourg", "Color": [initialColor, thirdColor] },
//   { "Country": "Belgium", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Switzerland", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Luxembourg", "Color": [initialColor, thirdColor] },
//   { "Country": "Algeria", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Croatia", "Color": [initialColor, thirdColor] },
//   { "Country": "Slovenia", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Syria", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Lebanon", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Israel", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Palestine", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Jordan", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Netherlands", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Moldova", "Color": [initialColor, thirdColor, fourthColor] },
//   { "Country": "Austria", "Color": [initialColor, thirdColor, fourthColor] },
  
// ]

//   },
//   {
//     "Index": 3,
//     "Author/Text Title": "Tacitus",
//     "Fundamental Works": { "Title": "Annals", "Date of Issue": "around  115 - 120 CE" },
//    "Timeline": [-5000, 2000],
//     "Origin of history": "-",
//     "Author's framework": "Secular, philosophical",
//     "Stages of cycles": "-",

//     "Timeline Stages": [
//       {
//         "Stage": "The Reign of Tiberius",
//         "Years": [14, 37],
//         "Labels": ["14 CE", "37 CE"],
//         "Level" : 0,
//         "Color" : firstColor,

  
//       },
//       {
//         "Stage": "Republican Rome and Internal Struggles",
//         "Years": [37, 41],
//         "Labels": ["37 CE", "41 CE"],
//         "Level" : 0,
//         "Color" : secondColor,
//       },
//       {
//         "Stage": "Rome's Wars and Expansion",
//         "Years": [41, 54],
//         "Labels": ["41 CE", "54 CE"],
//         "Level" : 0,
//         "Color" : thirdColor,
//       },
//       {
//         "Stage": "Moral Decline in the Late Republic",
//         "Years": [54, 68],
//         "Labels": ["54 CE", "68 CE"],
//         "Level" : 0,
//         "Color" : fourthColor,
//       }
//     ]
//     ,    
    
//     "Ancient regions": ["Rome", "Italia", "Germania", "Britannia", "Gaul", "Hispania", "Egypt", "Syria", "Judea", 
//       "Armenia", "Parthia", "Pannonia", "Dalmatia", "Illyria", "Numidia", "Mauretania", 
//       "Thrace", "Asia Minor", "Achaea", "Cappadocia", "Pontus", "Dacia", "Mesopotamia", 
//       "Africa Proconsularis", "Sicily"],
      
//       "Geography": [
//         { "Country": "Italy", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Germany", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Tunisia", "Color": [initialColor, secondColor] },
//         { "Country": "France", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Spain", "Color": [initialColor, secondColor] },
//         { "Country": "Portugal", "Color": [initialColor, secondColor] },
//         { "Country": "Greece", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Turkey", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Egypt", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Libya", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "North Macedonia", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Serbia", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Slovenia", "Color": [initialColor, firstColor] },
//         { "Country": "Bulgaria", "Color": [initialColor] },
//         { "Country": "Kosovo", "Color": [initialColor, firstColor] },
//         { "Country": "Albania", "Color": [initialColor, firstColor] },
//         { "Country": "Croatia", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Bosnia", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Montenegro", "Color": [initialColor, firstColor] },
//         { "Country": "Hungary", "Color": [initialColor, secondColor] },
//         { "Country": "Romania", "Color": [initialColor] },
//         { "Country": "Georgia", "Color": [initialColor] },
//         { "Country": "Armenia", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Azerbaijan", "Color": [initialColor, firstColor] },
//         { "Country": "Turkmenistan", "Color": [initialColor, firstColor] },
//         { "Country": "UK", "Color": [initialColor, secondColor] },
//         { "Country": "Iraq", "Color": [initialColor, firstColor] },
//         { "Country": "Iran", "Color": [initialColor, firstColor] },
//         { "Country": "Morocco", "Color": [initialColor] },  
//         { "Country": "Luxembourg", "Color": [initialColor] },
//         { "Country": "Belgium", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Switzerland", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Algeria", "Color": [initialColor, secondColor] },
//         { "Country": "Slovenia", "Color": [initialColor, firstColor] },
//         { "Country": "Lebanon", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Israel", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Palestine", "Color": [initialColor, firstColor] },
//         { "Country": "Jordan", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Netherlands", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Luxemburg", "Color": [initialColor, firstColor, secondColor] },
//         { "Country": "Poland", "Color": [initialColor, firstColor] },
//         { "Country": "Czech Republic", "Color": [initialColor, firstColor] },
//         { "Country": "Moldova", "Color": [initialColor] },
//         { "Country": "Austria", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 4,
//       "Author/Text Title": "Flavius Josephus",
//       "Fundamental Works": [
//         { "Title": "The Jewish War", "Date of Issue": "around 93 CE" },
//         { "Title": "Antiquities of the Jews", "Date of Issue": "around 93 CE" }
//       ],
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Theological: Genesis",
//       "Author's framework": "Judaism",
//       "Stages of cycles": ["Faithfulness and Prosperity", "Rebellion and Punishment", "Hope for Restoration"],
//       "Timeline Stages": [
//         {
//           "Stage": "Creation to the Patriarchs (Genesis)",
//           "Years": [-4000, -1300],
//           "Labels": ["4000 BCE", "1300 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "The Exodus and the Law",
//           "Years": [-1300, -1200],
//           "Labels": ["1300 BCE", "1200 BCE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "The Judges and the Kings of Israel",
//           "Years": [-1200, -587],
//           "Labels": ["1200 BCE", "587 BCE"],
//           "Level": 0,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "The Babylonian Exile and Return",
//           "Years": [-587, -539],
//           "Labels": ["587 BCE", "539 BCE"],
//           "Level": 0,
//           "Color": fourthColor
//         },
//         {
//           "Stage": "Post-Biblical History",
//           "Years": [-539, 94],
//           "Labels": ["539 BCE", "94 CE"],
//           "Level": 0,
//           "Color": fifthColor
//         },
//         {
//           "Stage": "The Jewish War",
//           "Years": [66, 70],
//           "Labels": ["66 CE", "70 CE"],
//           "Level": 1,
//           "Color": sixthColor
//         }
//       ],
//       "Ancient regions": ["Judea", "Galilee", "Samaria", "Idumea", "Jerusalem", "Perea", "Decapolis", "Syria", "Alexandria", "Egypt", "Rome", "Parthia", "Babylonia", "Arabia", "Phoenicia", "Mesopotamia", "Cyprus", "Persia", "Galatia", "Asia Minor"],
//       "Geography": [
//         { "Country": "Israel", "Color": [initialColor] },
//         { "Country": "Palestine", "Color": [initialColor] },
//         { "Country": "Jordan", "Color": [initialColor] },
//         { "Country": "Lebanon", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Cyprus", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 5,
//       "Author/Text Title": "Kojiki",
//       "Fundamental Works": { "Title": "Kojiki", "Date of Issue": "712 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
//       "Author's framework": "Shinto",
//       "Stages of cycles": "-",
//       "Timeline Stages": [
//         {
//           "Stage": "Mythological Age (Time Before Human History)",
//           "Years": [-4000, -660],
//           "Labels": ["4000 BCE", "660 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Historical Age (Legendary and Semi-Historical Period)",
//           "Years": [-660, -499],
//           "Labels": ["660 BCE", "499 BCE"],
//           "Level": 0,
//           "Color": secondColor
//         }
//       ],
//       "Ancient regions": ["Wa", "Yamato", "Izumo", "Tsukushi", "Takamagahara", "Ashihara no Nakatsukuni", "Koshi", "Awaji", "Owari", "Hyuga", "Tsushima", "Hokkaido"],
      
//       "Geography": [{ "Country": "Japan", "Color": [initialColor] }]
//     },
//     {
//       "Index": 6,
//       "Author/Text Title": "Nihongi",
//       "Fundamental Works": { "Title": "Nihongi", "Date of Issue": "720 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Mythological: out of primordial chaos, the first gods spontaneously emerged.",
//       "Author's framework": "Primarily Shinto, secondarily Buddhism",
//       "Stages of cycles": "-",
//       "Timeline Stages": [
//         {
//           "Stage": "Mythological Age (Kami no Yo)",
//           "Years": [-4000, -660],
//           "Labels": ["4000 BCE", "660 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Semi-Historical Age",
//           "Years": [-660, 600],
//           "Labels": ["660 BCE", "600 CE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Historical Age",
//           "Years": [600, 720],
//           "Labels": ["600 CE", "720 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         }
//       ],
//       "Ancient regions": ["Wa", "Yamato", "Tsukushi", "Koshi", "Kibi", "Silla", "Baekje", "Goguryeo", "Kara", "Paekche", "Tunguska", "Lelang", "China", "Yamatai", "Ryukyu Islands"],
      
//       "Geography": [
//         { "Country": "Japan", "Color": [initialColor] },
//         { "Country": "South Korea", "Color": [initialColor] },
//         { "Country": "North Korea", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Russia (Manchuria)", "Color": [initialColor] },
//         { "Country": "Ryukyu Islands", "Color": [initialColor] }
//       ]
//     },

//     {
//       "Index": 7,
//       "Author/Text Title": "Ferdawsi",
//       "Fundamental Works": { "Title": "Persian Book of Kings (Shahnameh)", "Date of Issue": "1010 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Mythological: Ahura Mazda creates universe.",
//       "Author's framework": "Primarily Zoroastrianism, secondarily Islam",
//       "Stages of cycles": ["Truth and Justice -> Prosperity and Victory", "Tyranny, greed, and falsehood -> Death and Decline"],
//       "Timeline Stages": [
//         {
//           "Stage": "Mythical Age",
//           "Years": [-4000, -2000],
//           "Labels": ["4000 BCE", "2000 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Legendary Age",
//           "Years": [-2000, -330],
//           "Labels": ["2000 BCE", "330 BCE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Historical Age",
//           "Years": [-330, 651],
//           "Labels": ["330 BCE", "651 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         }
//       ],
//       "Ancient regions": ["Iran", "Turan", "Zabulistan", "Sistan", "Mazandaran", "Khwarazm", "India", "China", "Rome", "Arabia", "Balkh", "Khorasan", "Ctesiphon", "Isfahan", "Herat", "Rey", "Armenia", "Caucasus", "Bukhara", "Gorgan", "Syria", "Yemen", "Sogdiana", "Parthia", "Azerbaijan", "Tabaristan", "Georgia"],
      
//       "Geography": [
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Central Asia", "Color": [initialColor] },
//         { "Country": "Afghanistan", "Color": [initialColor] },
//         { "Country": "Uzbekistan", "Color": [initialColor] },
//         { "Country": "Turkmenistan", "Color": [initialColor] },
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Armenia", "Color": [initialColor] },
//         { "Country": "Georgia", "Color": [initialColor] },
//         { "Country": "Azerbaijan", "Color": [initialColor] },
//         { "Country": "Yemen", "Color": [initialColor] },
//         { "Country": "Tajikistan", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 8,
//       "Author/Text Title": "Ibn Khaldun",
//       "Fundamental Works": { "Title": "Muqaddimah", "Date of Issue": "1377 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "-",
//       "Author's framework": "Rational, sociological",
//       "Stages of cycles": ["The Formation of a Dynasty (Gaining Asabiyyah)", "The Flourishing of the Dynasty", "The Decline of the Dynasty (Losing Asabiyyah)"],
//       "Timeline Stages": [
//         {
//           "Stage": "Ancient Egypt",
//           "Years": [-3100, -30],
//           "Labels": ["3100 BCE", "30 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Mesopotamia",
//           "Years": [-3000, -539],
//           "Labels": ["3000 BCE", "539 BCE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Pre-Islamic Tribal Arabia",
//           "Years": [-500, 622],
//           "Labels": ["500 BCE", "622 CE"],
//           "Level": 1,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Life of the Prophet Muhammad",
//           "Years": [570, 632],
//           "Labels": ["570 CE", "632 CE"],
//           "Level": 0,
//           "Color": fourthColor
//         },
//         {
//           "Stage": "Umayyad Caliphate",
//           "Years": [661, 750],
//           "Labels": ["661 CE", "750 CE"],
//           "Level": 1,
//           "Color": fifthColor
//         },
//         {
//                   "Stage": "Abbasid Caliphate",
//                   "Years": [750, 1258],
//                   "Labels": ["750 CE", "1258 CE"],
//                   "Level" : 1,
//                   "Color" : sixthColor
//                 },
//                 {
//                   "Stage": "Almoravid Dynasty",
//                   "Years": [1040, 1147],
//                   "Labels": ["1040 CE", "1147 CE"],
//                   "Level" : 2,
//                   "Color" : seventhColor
//                 },
//                 {
//                   "Stage": "Almohad Dynasty",
//                   "Years": [1121, 1269],
//                   "Labels": ["1121 CE", "1269 CE"],
//                   "Level" : 3,
//                   "Color" : eighthColor
//                 },
//                 {
//                   "Stage": "Hafsids of Tunisia",
//                   "Years": [1229, 1574],
//                   "Labels": ["1229 CE", "1574 CE"],
//                   "Level" : 2,
//                   "Color" : ninthColor
//                 },
//                 {
//                   "Stage": "Mongol Empire",
//                   "Years": [1206, 1368],
//                   "Labels": ["1206 CE", "1368 CE"],
//                   "Level" : 4,
//                   "Color" : tenthColor
//                 },
//                 {
//                   "Stage": "Reconquista",
//                   "Years": [718, 1377],
//                   "Labels": ["718 CE", "1377 CE"],
//                   "Level" : 0,
//                   "Color" : eleventhColor
//                 }
//       ],
//       "Ancient regions": ["Ifriqiya", "Maghreb", "Egypt", "Al-Andalus", "Arabia", "Persia", "Syria", "Iraq", "Yemen", "Berber Kingdoms", "Byzantium", "Sudan", "Sicily", "Constantinople", "Khorasan", "Transoxiana", "Sassanid Empire"],
      
//       "Geography": [
//         { "Country": "Tunisia", "Color": [initialColor] },
//         { "Country": "Algeria", "Color": [initialColor] },
//         { "Country": "Libya", "Color": [initialColor] },
//         { "Country": "Morocco", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Spain", "Color": [initialColor] },
//         { "Country": "Portugal", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Yemen", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Sudan", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Uzbekistan", "Color": [initialColor] },
//         { "Country": "Tajikistan", "Color": [initialColor] },
//         { "Country": "Turkmenistan", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 9,
//       "Author/Text Title": "Isaac Newton",
//       "Fundamental Works": { "Title": "The Chronology of Ancient Kingdoms Amended", "Date of Issue": "1728 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Theological: Genesis",
//       "Author's framework": "Christian, scientific",
//       "Stages of cycles": "-",
//       "Timeline Stages": [
//         {
//           "Stage": "Early Biblical Events",
//           "Years": [-4000, -2500],
//           "Labels": ["4000 BCE", "2500 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Ancient Egypt",
//           "Years": [-2000, -568],
//           "Labels": ["2000 BCE", "568 BCE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Assyria",
//           "Years": [-1500, -600],
//           "Labels": ["1500 BCE", "600 BCE"],
//           "Level": 1,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Babylon",
//           "Years": [-1500, -539],
//           "Labels": ["1500 BCE", "539 BCE"],
//           "Level": 2,
//           "Color": fourthColor
//         },
//         {
//                   "Stage": "Persia",
//                   "Years": [-550, -330],
//                   "Labels": ["550 BCE", "330 BCE"],
//                   "Level" : 0,
//                   "Color": fifthColor
//                 },
//                 {
//                   "Stage": "Trojan war, Greek period",
//                   "Years": [-950, -146],
//                   "Labels": ["950 BCE", "146 BCE"],
//                   "Level" : 3,
//                   "Color": sixthColor
//                 }
//       ],
//       "Ancient regions": ["Egypt", "Assyria", "Babylon", "Greece", "Israel", "Judah", "Persia", "Scythia", "Troy", "Thebes", "Phrygia"],
      
//       "Geography": [
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Israel", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Georgia", "Color": [initialColor] },
//         { "Country": "Ukraine", "Color": [initialColor] },
//         { "Country": "Lebanon", "Color": [initialColor] },
//         { "Country": "Jordan", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 10,
//       "Author/Text Title": "Edward Gibbon",
//       "Fundamental Works": { "Title": "The History of the Decline and Fall of the Roman Empire", "Date of Issue": "1781 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "-",
//       "Author's framework": "Sociological, philosophical",
//       "Stages of cycles": ["Rise", "Fall"],
//       "Timeline Stages": [
//         {
//           "Stage": "The Roman Empire from Trajan to the Fall of the Western Roman Empire",
//           "Years": [98, 476],
//           "Labels": ["98 CE", "476 CE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "The Byzantine (Eastern Roman) Empire",
//           "Years": [476, 1204],
//           "Labels": ["476 CE", "1204 CE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "The Final Decline of the Byzantine Empire and the Fall of Constantinople",
//           "Years": [1204, 1453],
//           "Labels": ["1204 CE", "1453 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         }
//       ],
//       "Ancient regions": ["Rome", "Gaul", "Britannia", "Hispania", "Germania", "North Africa", "Constantinople", "Asia Minor", "Greece", "Syria", "Palestine", "Egypt", "Visigothic Kingdom", "Ostrogothic Kingdom", "Vandal Kingdom", "Francia", "Persia", "Arabia"],
      
//       "Geography": [
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "France", "Color": [initialColor] },
//         { "Country": "United Kingdom", "Color": [initialColor] },
//         { "Country": "Spain", "Color": [initialColor] },
//         { "Country": "Germany", "Color": [initialColor] },
//         { "Country": "Tunisia", "Color": [initialColor] },
//         { "Country": "Algeria", "Color": [initialColor] },
//         { "Country": "Libya", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Israel", "Color": [initialColor] },
//         { "Country": "Palestine", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Jordan", "Color": [initialColor] },
//         { "Country": "Portugal", "Color": [initialColor] },
//         { "Country": "Hungary", "Color": [initialColor] },
//         { "Country": "Bulgaria", "Color": [initialColor] },
//         { "Country": "Serbia", "Color": [initialColor] },
//       ]
//     },
//     {
//       "Index": 11,
//       "Author/Text Title": "Georg Wilhelm Friedrich Hegel",
//       "Fundamental Works": { "Title": "Philosophy of History", "Date of Issue": "1837 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "History begins with the emergence of self-consciousness",
//       "Author's framework": "Philosophical, teleological",
//       "Stages of cycles": ["Thesis", "Antithesis", "Synthesis"],
//       "Timeline Stages": [
//         {
//           "Stage": "Oriental World",
//           "Years": [-3000, -500],
//           "Labels": ["3000 BCE", "500 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Greek World",
//           "Years": [-800, -300],
//           "Labels": ["800 BCE", "300 BCE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Roman World",
//           "Years": [-500, 476],
//           "Labels": ["500 BCE", "476 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Germanic World",
//           "Years": [476, 1800],
//           "Labels": ["476 CE", "1800 CE"],
//           "Level": 0,
//           "Color": fourthColor
//         }
//       ],
//       "Ancient regions": ["China", "India", "Persia", "Egypt", "Greece", "Rome", "Germany"],

//       "Geography": [
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Germany", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 12,
//       "Author/Text Title": "Max Weber",
//       "Fundamental Works": [
//         { "Title": "The Sociology of Religion", "Date of Issue": "1920 CE" },
//         { "Title": "Economy and Society", "Date of Issue": "1922 CE" }
//       ],
//       "Timeline": [-5000, 2000],
//       "Origin of history": "-",
//       "Author's framework": "Sociological: theological, historical, economic",
//       "Stages of cycles": ["Rationalization"],
//       "Timeline Stages": [
//         {
//           "Stage": "Ancient Religions: Patrimonial and theocratic rule, kinship-based governance",
//           "Years": [-3000, -500],
//           "Labels": ["3000 BCE", "500 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Axial Age Religions: Feudalism, charismatic authority, decentralized governance",
//           "Years": [-600, 200],
//           "Labels": ["600 BCE", "200 CE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Medieval Religions: Rise of centralized monarchies, early bureaucratic structures, absolutism",
//           "Years": [400, 1500],
//           "Labels": ["400 CE", "1500 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Modern Religions: Bureaucratization, rational-legal authority, industrial capitalism",
//           "Years": [1500, 2000],
//           "Labels": ["1500 CE", "2000 CE"],
//           "Level": 0,
//           "Color": fourthColor
//         }
//       ],
//       "Ancient regions": [
//         "Persia", "Switzerland", "The Netherlands", "Eastern Europe", "Ancient Israel", "Western Europe", "France", 
//         "Ancient Greece", "Medieval Europe", "Germany", "Medieval Japan", "Ottoman Empire", "Islamic World", "Byzantine Empire", 
//         "Buddhist Asia", "Japan", "Mesopotamia", "China", "Ancient Egypt", "India", "United States", "Medieval Christendom", 
//         "England", "Ancient Rome"
//       ],
//       "Geography": [
//         { "Country": "Switzerland", "Color": [initialColor] },
//         { "Country": "Lebanon", "Color": [initialColor] },
//         { "Country": "The Netherlands", "Color": [initialColor] },
//         { "Country": "France", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Palestine", "Color": [initialColor] },
//         { "Country": "Myanmar", "Color": [initialColor] },
//         { "Country": "Czech Republic", "Color": [initialColor] },
//         { "Country": "Bangladesh", "Color": [initialColor] },
//         { "Country": "Sri Lanka", "Color": [initialColor] },
//         { "Country": "Germany", "Color": [initialColor] },
//         { "Country": "Vietnam", "Color": [initialColor] },
//         { "Country": "Pakistan", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Poland", "Color": [initialColor] },
//         { "Country": "Israel", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Japan", "Color": [initialColor] },
//         { "Country": "United Kingdom", "Color": [initialColor] },
//         { "Country": "Cambodia", "Color": [initialColor] },
//         { "Country": "Hungary", "Color": [initialColor] },
//         { "Country": "Indonesia", "Color": [initialColor] },
//         { "Country": "Europe", "Color": [initialColor] },
//         { "Country": "Thailand", "Color": [initialColor] },
//         { "Country": "Malaysia", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Yemen", "Color": [initialColor] },
//         { "Country": "United States", "Color": [initialColor] },
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Jordan", "Color": [initialColor] },
//         { "Country": "Japan", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 13,
//       "Author/Text Title": "Oswald Spengler",
//       "Fundamental Works": { "Title": "The Decline of the West", "Date of Issue": "1921 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "-",
//       "Author's framework": "Philosophical, fatalistic",
//       "Stages of cycles": ["Birth (Spring)", "Growth and Flourishing (Summer)", "Maturity and Rationalization (Autumn)", "Decline (Winter)"],
//       "Timeline Stages": [
//         {
//           "Stage": "Egyptian Civilization (early high culture)",
//           "Years": [-3000, -300],
//           "Labels": ["3000 BCE", "300 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Mesopotamian/Babylonian Civilization (early high culture)",
//           "Years": [-3000, -500],
//           "Labels": ["3000 BCE", "500 BCE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Greek (Classical Civilization)",
//           "Years": [-1100, -200],
//           "Labels": ["1100 BCE", "200 BCE"],
//           "Level": 2,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Roman (Classical Civilization)",
//           "Years": [-500, 500],
//           "Labels": ["500 BCE", "500 CE"],
//           "Level": 1,
//           "Color": fourthColor
//         },
//         {
//                   "Stage": "Arabian (Magian Civilization)",
//                   "Years": [300, 1500],
//                   "Labels": ["300 CE", "1500 CE"],
//                   "Level" : 0,
//                   "Color": fifthColor
//                 },
//                 {
//                   "Stage": "Medieval Europe (Faustian Civilization)",
//                   "Years": [900, 1500],
//                   "Labels": ["900 CE", "1500 CE"],
//                   "Level" : 1,
//                   "Color": sixthColor
//                 },
//                 {
//                   "Stage": "Renaissance and Reformation (Faustian Civilization)",
//                   "Years": [1500, 1800],
//                   "Labels": ["1500 CE", "1800 CE"],
//                   "Level" : 0,
//                   "Color": seventhColor
//                 },
//                 {
//                   "Stage": "Industrialization and Modernity (Faustian Civilization)",
//                   "Years": [1800, 2000],
//                   "Labels": ["1800 CE", "2000 CE"],
//                   "Level" : 0,
//                   "Color": eighthColor
//                 }
//       ],
//       "Ancient regions": ["Egypt", "Babylonia", "Greece", "Rome", "Mesopotamia", "Persia", "Byzantine Empire", "Arabia", "India", "China"],
//       "Geography": [
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] }, 
//         { "Country": "Saudi Arabia", "Color": [initialColor] },    
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Yemen", "Color": [initialColor] },
//         { "Country": "Oman", "Color": [initialColor] },
//         { "Country": "UAE", "Color": [initialColor] },
//         { "Country": "Qatar", "Color": [initialColor] },
//         { "Country": "Bahrain", "Color": [initialColor] },
//         { "Country": "Kuwait", "Color": [initialColor] },
//         { "Country": "Pakistan", "Color": [initialColor] },
//         { "Country": "Bangladesh", "Color": [initialColor] }

//       ]
//     },
//     {
//       "Index": 14,
//       "Author/Text Title": "Arnold J. Toynbee",
//       "Fundamental Works": { "Title": "A Study of History", "Date of Issue": "1934–1961 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "History starts when societies respond to significant challenges",
//       "Author's framework": "Spiritual, mystical, empirical",
//       "Stages of cycles": ["Birth", "Growth", "Breakdown", "Disintegration"],
//       "Timeline Stages": [
//         {
//           "Stage": "Egyptian Civilization",
//           "Years": [-3000, -30],
//           "Labels": ["3000 BCE", "30 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Sumerian/Babylonian Civilization",
//           "Years": [-3000, -500],
//           "Labels": ["3000 BCE", "500 BCE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Minoan Civilization",
//           "Years": [-2700, -1400],
//           "Labels": ["2700 BCE", "1400 BCE"],
//           "Level": 2,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Hittite Civilization",
//           "Years": [-1600, -1200],
//           "Labels": ["1600 BCE", "1200 BCE"],
//           "Level": 4,
//           "Color": fourthColor
//         },
//         {
//                   "Stage": "Indus Valley Civilization",
//                   "Years": [-2600, -1900],
//                   "Labels": ["2600 BCE", "1900 BCE"],
//                   "Level" : 3,
//                   "Color": fifthColor
//                 },
//                 {
//                   "Stage": "Maya Civilization",
//                   "Years": [-1800, 900],
//                   "Labels": ["1800 BCE", "900 CE"],
//                   "Level" : 3,
//                   "Color": sixthColor
//                 },
//                 {
//                   "Stage": "Classical Greek Civilization",
//                   "Years": [-800, -146],
//                   "Labels": ["800 BCE", "146 BCE"],
//                   "Level" : 2,
//                   "Color": seventhColor
//                 },
//                 {
//                   "Stage": "Persian Civilization",
//                   "Years": [-550, 651],
//                   "Labels": ["550 BCE", "651 CE"],
//                   "Level" : 4,
//                   "Color": eighthColor
//                 },
//                 {
//                   "Stage": "Western Roman Civilization",
//                   "Years": [-500, 476],
//                   "Labels": ["500 BCE", "476 CE"],
//                   "Level" : 1,
//                   "Color": ninthColor
//                 },
//                 {
//                   "Stage": "Chinese Civilization",
//                   "Years": [-1000, 220],
//                   "Labels": ["1000 BCE", "220 CE"],
//                   "Level" : 5,
//                   "Color": tenthColor
//                 },
//                 {
//                   "Stage": "Byzantine Civilization",
//                   "Years": [330, 1453],
//                   "Labels": ["330 CE", "1453 CE"],
//                   "Level" : 5,
//                   "Color": eleventhColor
//                 },
//                 {
//                   "Stage": "Islamic Civilization",
//                   "Years": [622, 2000],
//                   "Labels": ["622 CE", "2000 CE"],
//                   "Level" : 0,
//                   "Color": twelvethColor
//                 },
//                 {
//                   "Stage": "Western Christian Civilization",
//                   "Years": [800, 2000],
//                   "Labels": ["800 CE", "2000 CE"],
//                   "Level" : 4,
//                   "Color": thirteenthColor
//                 },
//                 {
//                   "Stage": "Hindu Civilization",
//                   "Years": [-1500, 2000],
//                   "Labels": ["1500 BCE", "2000 CE"],
//                   "Level" : 6,
//                   "Color": fourteenthColor
//                 },
//                 {
//                   "Stage": "Russian Civilization",
//                   "Years": [900, 2000],
//                   "Labels": ["900 CE", "2000 CE"],
//                   "Level" : 3,
//                   "Color": fifteenthColor,
//                 },
//                 {
//                   "Stage": "Japanese Civilization",
//                   "Years": [250, 2000],
//                   "Labels": ["250 CE", "2000 CE"],
//                   "Level" : 2,
//                   "Color": sixteenthColor,
//                 },
//                 {
//                   "Stage": "Hindu Civilization",
//                   "Years": [-1500, 2000],
//                   "Labels": ["1500 BCE", "2000 CE"],
//                   "Level" : 6,
//                   "Color": seventeenthColor,
//                 }
//       ],
//       "Ancient regions": [
//         "Egypt", "Mesopotamia", "Sumer", "Greece", "Rome", "Byzantium", "Syria", "Persia", "India", "China", 
//         "Islamic Caliphates", "Mesoamerica (Aztec and Maya)", "Andean (Inca)"
//       ],
//       "Geography": [
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Pakistan", "Color": [initialColor] },
//         { "Country": "Bangladesh", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Mexico", "Color": [initialColor] },
//         { "Country": "Peru", "Color": [initialColor] },
//         { "Country": "Germany", "Color": [initialColor] },
//         { "Country": "France", "Color": [initialColor] },
//         { "Country": "Spain", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 15,
//       "Author/Text Title": "Karl Jaspers",
//       "Fundamental Works": { "Title": "The Origin and Goal of History", "Date of Issue": "1951 CE" },
//       "Timeline": [-5000, 2000],
//       "Origin of history": "Axial Age",
//       "Author's framework": "Existentialist, theological, philosophical",
//       "Stages of cycles": "-",
//       "Timeline Stages": [
//         {
//           "Stage": "Pre-Axial Period",
//           "Years": [-3000, -800],
//           "Labels": ["3000 BCE", "800 BCE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Axial Age",
//           "Years": [-800, -200],
//           "Labels": ["800 BCE", "200 BCE"],
//           "Level": 0,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Post-Axial Age",
//           "Years": [-200, 2000],
//           "Labels": ["200 BCE", "2000 CE"],
//           "Level": 0,
//           "Color": thirdColor
//         }
//       ],
//       "Ancient regions": ["Greece", "India", "China", "Israel", "Persia", "Mesopotamia", "Egypt", "Rome", "Western Europe", "Islamic World"],
     
//       "Geography": [
//         { "Country": "Greece", "Color": [initialColor] },
//         { "Country": "India", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Israel", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Egypt", "Color": [initialColor] },
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "Western Europe", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] },
//         { "Country": "Jordan", "Color": [initialColor] }
//       ]
//     },
//     {
//       "Index": 16,
//       "Author/Text Title": "Peter Turchin",
//       "Fundamental Works": [
//         { "Title": "Historical Dynamics", "Date of Issue": "2003 CE" },
//         { "Title": "War and Peace and War", "Date of Issue": "2006 CE" },
//         { "Title": "Secular Cycles", "Date of Issue": "2009 CE" }
//       ],
//       "Timeline": [-5000, 2000],
//       "Origin of history": "-",
//       "Author's framework": "Cliodynamics, empirical",
//       "Stages of cycles": ["Growth: demographic, economic", "Stagflation: elite overproduction, malthusian stagnation", "Crisis: state breakdown, depopulation, economic collapse", "Depression: economic recovery, rebuilding state institutions"],
//       "Timeline Stages": [
//         {
//           "Stage": "Medieval England",
//           "Years": [1150, 1485],
//           "Labels": ["1150 CE", "1485 CE"],
//           "Level": 0,
//           "Color": firstColor
//         },
//         {
//           "Stage": "Pre-Revolution France",
//           "Years": [1200, 1800],
//           "Labels": ["1200 CE", "1800 CE"],
//           "Level": 1,
//           "Color": secondColor
//         },
//         {
//           "Stage": "Imperial Russia",
//           "Years": [1460, 1917],
//           "Labels": ["1460 CE", "1917 CE"],
//           "Level": 2,
//           "Color": thirdColor
//         },
//         {
//           "Stage": "Ancient Rome",
//           "Years": [-200, 600],
//           "Labels": ["200 BCE", "600 CE"],
//           "Level": 0,
//           "Color": fourthColor
//         }
//       ],
//       "Ancient regions": ["Rome", "China", "Russia", "European Empires", "Islamic Caliphates", "Byzantium", "Ottoman Empire", "France", "Britain", "Muscovite Russia", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"],
      
//       "Geography": [
//         { "Country": "Italy", "Color": [initialColor] },
//         { "Country": "China", "Color": [initialColor] },
//         { "Country": "Russia", "Color": [initialColor] },
//         { "Country": "Western Europe", "Color": [initialColor] },
//         { "Country": "Middle East", "Color": [initialColor] },
//         { "Country": "Turkey", "Color": [initialColor] },
//         { "Country": "France", "Color": [initialColor] },
//         { "Country": "United Kingdom", "Color": [initialColor] },
//         { "Country": "Germany", "Color": [initialColor] },
//         { "Country": "Saudi Arabia", "Color": [initialColor] },
//         { "Country": "Iraq", "Color": [initialColor] },
//         { "Country": "Iran", "Color": [initialColor] },
//         { "Country": "Syria", "Color": [initialColor] }
//       ]
//     }
    
    
   
  ];

  function OtahhIntro() {
    const [selectedAuthor, setSelectedAuthor] = useState(dataset[0]); // Set the initial author/text
    const [hoveredColor, setHoveredColor] = useState(null); // Store the color of the hovered segment
    const [hoveredStageColor, setHoveredStageColor] = useState(null); // Store the hovered stage color
    const [hoveredStageCountries, setHoveredStageCountries] = useState([]); // Store the hovered stage countries
    const [initialColor, setInitialColor] = useState(null); // Store the initial base color
    const svgRef = useRef();
    const zoomScaleRef = useRef(1); // Initialize zoom scale at 1
    const timelineRef = useRef(); // Reference for the timeline SVG
  
    // Memoized function to set up the projection and path generator
    const renderGlobe = useMemo(() => {
      const initialScale = 170;  // Default size of the globe
      const initialRotation = [0, 0];  // Default rotation angle [longitude, latitude]
  
      const projection = geoOrthographic()
        .scale(initialScale * zoomScaleRef.current)
        .translate([420, 400]) // Center the globe
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
          console.log('World Data Loaded:', worldData); // Log the fetched data
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
            .attr('fill', '#d3d3d3');    // Fill countries with grey
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
      const { projection, path } = renderGlobe;
  
      // Fetch world data only once, not on every re-render
      d3.json('/datasets/110m.json') // Load modern country borders
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
            const initialGeography = selectedAuthor["Initial Geography"]; // Access the Initial Geography array from the selectedAuthor object
  
            // Check if the country exists in the Initial Geography array
            if (initialGeography && initialGeography.includes(countryName)) {
              console.log(`Country ${countryName} is in Initial Geography. Applying initialColor:`, initialColor);
              return initialColor; // Use the initialColor if the country is in Initial Geography
            }
  
            return '#d3d3d3'; // Default color for countries not in Initial Geography
          })
          .attr('opacity', 1); // Ensure the base layer is fully visible
  
      })
      .catch(error => console.error('Error loading world data:', error));
    }, [renderGlobe, selectedAuthor, initialColor]);
  
    // Function to highlight relevant geography on the globe (hover effect)
   // Function to highlight relevant geography on the globe (hover effect)
const highlightGeographyOnHover = useCallback(() => {
  const { projection, path } = renderGlobe;

  // Fetch world data only once, not on every re-render
  d3.json('/datasets/110m.json') // Load modern country borders
    .then(worldData => {
      console.log("World data loaded for modern countries:", worldData);

      const land = topojson.feature(worldData, worldData.objects.countries);

      // Clear previous hover layers to ensure new countries are rendered
      d3.select(svgRef.current).selectAll('path.land-hover').remove();

      // Add a hover layer for the timeline stage countries
      d3.select(svgRef.current).selectAll('path.land-hover')
        .data(land.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'land-hover')
        .attr('fill', d => {
          const countryName = d.properties.name;

          // If hoveredStageCountries is empty or null, revert to initial color
          if (!hoveredStageCountries || hoveredStageCountries.length === 0) {
            // Check if the country exists in the "Initial Geography" array
            if (selectedAuthor["Initial Geography"] && selectedAuthor["Initial Geography"].includes(countryName)) {
              return initialColor; // Use the initialColor if the country is in Initial Geography
            }
            return '#d3d3d3'; // Default color for countries not in Initial Geography
          }

          // Otherwise, highlight countries based on the hovered stage
          if (hoveredStageCountries.includes(countryName)) {
            console.log(`Country ${countryName} is in the hovered stage. Applying stage color:`, hoveredStageColor);
            return hoveredStageColor; // Use the color of the hovered stage
          }

          return 'none'; // Transparent if not in the hovered stage
        })
        .attr('opacity', 0.7) // Slightly transparent hover layer
        .raise(); // Bring highlighted countries to the front
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
        setInitialColor("#ffcc00"); // Set a specific default color, or choose logic based on the country
        console.log("Initial color set:", "#ffcc00");
      }
    }, [selectedAuthor]);
  
    // Render static elements, apply drag/zoom, and highlight geography initially
    useEffect(() => {
      renderStaticElements();
      applyDragAndZoom();
      highlightGeography(); // Ensure countries from "Initial Geography" are rendered with initialColor
    }, [renderStaticElements, applyDragAndZoom, highlightGeography]);
  
    // Function to render the timeline with highlighted period
    const renderTimeline = useCallback(() => {
      const width = 1500;
      const height = 200;
  
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
        .ticks(10)
        .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`));
  
      const g = svg.append("g");
  
      // Append the axis to the timeline
      const xAxisGroup = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - 20})`)
        .call(xAxis)
        .style('font-size', '16px');
  
      xAxisGroup.selectAll('text')
        .style('font-family', 'Times New Roman, sans-serif');
  
      // Append each timeline stage as a rectangle with the corresponding color
      const timelineRects = g.selectAll("rect")
        .data(selectedAuthor["Timeline Stages"])
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.Years[0]))
        .attr("y", d => 150 - d.Level * 30) // Position based on the level
        .attr("width", d => xScale(d.Years[1]) - xScale(d.Years[0]))
        .attr("height", 30)
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
            .html(`<strong>${d.Stage}</strong><br>${d.Labels[0] || 'N/A'} - ${d.Labels[1] || 'N/A'}`)
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
        })
        
  
      // Define the zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([1, 5]) // Set the zoom range
        .translateExtent([[0, 0], [width, height]]) // Restrict panning
        .on("zoom", (event) => {
          const transform = event.transform;
  
          // Apply the zoom transformation
          const newXScale = transform.rescaleX(xScale);
  
          // Remove old tick markers
          xAxisGroup.selectAll(".tick").remove();  // Remove existing ticks before updating
  
          // Update rectangles
          timelineRects
            .attr("x", d => newXScale(d.Years[0]))
            .attr("width", d => newXScale(d.Years[1]) - newXScale(d.Years[0]));
  
          // Update axis with the new scale
          xAxisGroup.call(
            d3.axisBottom(newXScale)
              .ticks(10)
              .tickFormat(d => (d < 0 ? `${Math.abs(d)} BC` : `${d} CE`))
          );
        });
  
      // Apply the zoom behavior to the SVG
      svg.call(zoom);
    }, [selectedAuthor]);
  
    // Call renderTimeline only when selectedAuthor changes
    useEffect(() => {
      renderTimeline();
    }, [selectedAuthor, renderTimeline]);
  
    // Function to handle change in dropdown selection
    const handleAuthorChange = (event) => {
      const selectedIndex = event.target.value;
      setSelectedAuthor(dataset[selectedIndex]);
    };
  
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
            <div className="author-card-label">
              {selectedAuthor["Fundamental Works"].Title} - {selectedAuthor["Fundamental Works"]["Date of Issue"]}
            </div>
          </div>
  
          <div className="framework-container">
            <label>Framework: </label>
            <p>{selectedAuthor["Author's framework"]}</p>
          </div>
  
          <div className="territory-container">
            <label>Territory: </label>
            <p>{selectedAuthor["Ancient regions"] ? selectedAuthor["Ancient regions"].join(", ") : "N/A"}</p>
          </div>
  
          <div className="lower-author-card-container">
            <div className="timeline-stages-column">
              {Array.isArray(selectedAuthor["Timeline Stages"]) && selectedAuthor["Timeline Stages"].map((stage, index) => (
                <div key={index} className="timeline-stage">
                  <p style={{ marginBottom: '10px', display: 'inline' }}><strong>{stage.Stage}</strong></p>{" "}
                  <p style={{ marginBottom: '10px', display: 'inline' }}>{stage.Labels ? stage.Labels.join(" - ") : "N/A"}</p>
                </div>
              ))}
            </div>
  
            <div className="right-column">
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
  
        {/* Segment card element for hover effect */}
        <div className="segment-card"></div>
      </div>
    );
  }
  
  export default OtahhIntro;
  
