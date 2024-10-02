// OnThinkingAndHumanHistory.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../components css/otahh_main.css';

const OnThinkingAndHumanHistory = () => {
    return (
      <div className="otahh-container">
        <h1>On thinking and human history</h1>
        <ul>
          <li><Link to="/introduction">Introduction</Link></li>
          <li><Link to="/lecture1">Lecture 1</Link></li>
          <li><Link to="/lecture2">Lecture 2</Link></li>
          <li><Link to="/lecture3">Lecture 3</Link></li>
          <li><Link to="/lecture4">Lecture 4</Link></li>
          <li><Link to="/lecture5">Lecture 5</Link></li>
          <li><Link to="/lecture6">Lecture 6</Link></li>
          <li><Link to="/lecture7">Lecture 7</Link></li>
          <li><Link to="/lecture8">Lecture 8</Link></li>
          <li><Link to="/lecture9">Lecture 9</Link></li>
          <li><Link to="/lecture10">Lecture 10</Link></li>
        </ul>
      </div>
    );
  };
  
  export default OnThinkingAndHumanHistory;