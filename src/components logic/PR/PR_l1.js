import React from 'react';


function PR_l1() {
  return (
    <div className="course-content">
      <h1>Public Relations - Level 1</h1>
      <p>Welcome to the first module of the Public Relations course. In this module, you will learn the basics of PR, its history, and its role in modern communication strategies.</p>

      <section className="lecture-section">
        <h2>Lecture 1: The Origins of Public Relations</h2>
        <p>In this lecture, we explore the historical roots of public relations, tracing back to early civilizations and how they shaped communication strategies in warfare and politics.</p>
        <p>Duration: 45 minutes</p>
      </section>

      <section className="lecture-section">
        <h2>Lecture 2: The Evolution of PR in the 20th Century</h2>
        <p>In this lecture, we discuss the impact of mass media and technological advancements on the development of PR in the 20th century.</p>
        <p>Duration: 1 hour</p>
      </section>

      <section className="lecture-section">
        <h2>Lecture 3: Modern PR Strategies</h2>
        <p>This lecture focuses on modern PR techniques, including social media management, crisis communication, and branding.</p>
        <p>Duration: 1 hour 15 minutes</p>
      </section>

      <div className="course-navigation">
        <button className="previous-button">Previous Module</button>
        <button className="next-button">Next Module</button>
      </div>
    </div>
  );
}

export default PR_l1;
