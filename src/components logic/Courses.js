import React from 'react';
import { Link } from 'react-router-dom';
import '../components css/Courses.css';

const courses = [
  {
    title: 'On History',
    description: 'Introduction to humanitarian arts and sciences by exploring human history through different optics.',
    author: 'Amir Yakhin',
    lectures: 7,
    hours: 14,
    route: '/courses/on-thinking-and-human-history',
  },
  {
    title: 'Public Relations',
    description: 'Politics, propaganda, war, strategic communication, marketing, and memes.',
    author: 'Bekzod Maksudhanov',
    lectures: 6,
    hours: 10,
    route: '/courses/public-relations',
  },
  {
    title: 'Modern German Thought: Conclusion of Philosophy',
    description: 'Tracing the origins of German Idealism, we will examine the history of philosophy and its limits.',
    author: 'Jay Ryoo',
    lectures: 9,
    hours: 18,
    route: '/courses/modern-german-thought',
  },
];

function Courses() {
  return (
    <div className="courses-section">
      <div className="course-list">
        {courses.map((course, index) => (
          <Link to={course.route} key={index} className="course-item-link">
            <div className="course-item">
              <div className="text-container">
                {/* Title and Description */}
                <div className="column-title">
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                </div>

                {/* Author */}
                <div className="column-author">
                  <p>Author and lecturer:</p>
                  <p>{course.author}</p>
                </div>

                {/* Info Text */}
                <p className="column-info-text">{course.lectures} lectures • {course.hours} hours</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;
