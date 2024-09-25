import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to handle routing
import '../components css/Courses.css';

function Courses() {
  return (
    <div className="courses-section">
      <div className="course-list">
        {/* Course 1: On Thinking and Human History */}
        <div className="course-item">
          {/* First Column: Title and Description */}
          <div className="column column-title">
            <h2>
              <Link to="/courses/on-thinking-and-human-history">On Thinking and Human History</Link>
            </h2>
            <p>Explore the role of thinking in shaping human history through mythical, theological, philosophical, and sociological lenses.</p>
          </div>

          {/* Second Column: Author */}
          <div className="column column-author">
          <p>author and lecturer:</p> 
          <p>Amir Yakhin</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">7 lectures • 14 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">go to course >></Link>
          </div>
        </div>
        <div className="course-item">
          {/* First Column: Title and Description */}
          <div className="column column-title">
            <h2>
              <Link to="/courses/on-thinking-and-human-history">Public Relations</Link>
            </h2>
            <p>Politics, propogranda, war, strategic commincation, marketing and memes. </p>
          </div>

          {/* Second Column: Author */}
          <div className="column column-author">
            <p>author and lecturer:</p> 
            <p>Bekzod Maksudhanov</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">6 lectures • 10 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">go to course >></Link>
          </div>
        </div>
        <div className="course-item">
          {/* First Column: Title and Description */}
          <div className="column column-title">
            <h2>
              <Link to="/courses/on-thinking-and-human-history">Modern German thought: Conclusion of Philosophy</Link>
            </h2>
            <p>Tracing the origins of German Idealism, we will examine the history of philosophy and its limits.  </p>
          </div>

          {/* Second Column: Author */}
          <div className="column column-author">
          <p>author and lecturer:</p> 
          <p>Jay Ryoo</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">9 lectures • 18 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">go to course >></Link>
          </div>
        </div>

        {/* More courses can be added here in the future */}
      </div>
    </div>
  );
}

export default Courses;
