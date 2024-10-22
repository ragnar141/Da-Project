// OnThinkingAndHumanHistory.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../components css/otahh_main.css';

const OnThinkingAndHumanHistory = () => {
    return (
      <div className="otahh-container">
        {/* Title element wrapping the h1 */}
        <div className="course-title">
          <h1>On History</h1>
        </div>

        <div className="course-author">
          <p>by Amir Yakhin</p>
        </div>

        {/* Description element */}
        <div className="course-description">
          Interdisciplinary course designed as an introduction to the rest of the courses at UNI, 
          mapping out the relationships between different branches of knowledge. It attempts to view History 
          as a mother of humanities and provide a foundational narrative of human 
          experience that serves as a critical framework for understanding disciplines like theology, philosophy, 
          psychology, literature, and the arts. Gaining a deeper understanding of History 
          certainly helps to ground ourselves in the present, and plan the future.
        </div>

        {/* Episode Title */}
        <div className="episode-title">
          <h2>Episode 1: Introduction</h2>
        </div>

        {/* Episode 1 container with video and links */}
        <div className="episode1">
          <div className="video-placeholder">
            video
          </div>
          <div className="episode1-links">
            <ul>
              <li><Link to="/introduction">Sources</Link></li>
              <li><Link to="/lecture1">Lecture 1</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
};

export default OnThinkingAndHumanHistory;
