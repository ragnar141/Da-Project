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
            <p>Author: Amir Yakhin</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">7 lectures • 14 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">Go to Course >></Link>
          </div>
        </div>
        <div className="course-item">
          {/* First Column: Title and Description */}
          <div className="column column-title">
            <h2>
              <Link to="/courses/on-thinking-and-human-history">Public Relations</Link>
            </h2>
            <p>Although first over Public Relation course has appeared in 20th century, the mothods of this discipline have been practiced extensively throughout history.</p>
          </div>

          {/* Second Column: Author */}
          <div className="column column-author">
            <p>Author: Bekzod Maksudhanov</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">6 lectures • 10 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">Go to Course >></Link>
          </div>
        </div>
        <div className="course-item">
          {/* First Column: Title and Description */}
          <div className="column column-title">
            <h2>
              <Link to="/courses/on-thinking-and-human-history">Modern German thought: Conclusion of Philosophy</Link>
            </h2>
            <p>Tracing the origins of German Idealism, we will examine the history of philosophy and her limits.  </p>
          </div>

          {/* Second Column: Author */}
          <div className="column column-author">
            <p>Author: Jay Ryoo</p>
          </div>

          {/* Third Column: Info and Button */}
          <div className="column column-info">
            <p className="info">9 lectures • 18 hours</p>
            <Link to="/courses/on-thinking-and-human-history" className="course-button">Go to Course >></Link>
          </div>
        </div>

        {/* More courses can be added here in the future */}
      </div>
    </div>
  );
}

export default Courses;
