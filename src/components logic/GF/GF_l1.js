import React from 'react';


function GF_l1() {
  return (
    <div className="course-content">
      <h1>German Philosophy - Level 1</h1>
      <p>Welcome to the first module of the German Philosophy course. In this module, we will cover foundational ideas in German philosophy, focusing on the works of Kant, Hegel, and Nietzsche.</p>

      <section className="lecture-section">
        <h2>Lecture 1: Immanuel Kant and the Critique of Pure Reason</h2>
        <p>This lecture introduces Kant's transcendental idealism, exploring his critical philosophy and its revolutionary impact on metaphysics and epistemology.</p>
        <p>Duration: 1 hour 30 minutes</p>
      </section>

      <section className="lecture-section">
        <h2>Lecture 2: Hegel’s Dialectical Method</h2>
        <p>In this lecture, we explore Hegel’s dialectic and his concept of absolute idealism, which shaped much of 19th-century German thought.</p>
        <p>Duration: 1 hour</p>
      </section>

      <section className="lecture-section">
        <h2>Lecture 3: Nietzsche and the Will to Power</h2>
        <p>This lecture examines Nietzsche’s critique of morality, religion, and his notion of the will to power as the driving force of human behavior.</p>
        <p>Duration: 1 hour 15 minutes</p>
      </section>

      <div className="course-navigation">
        <button className="previous-button">Previous Module</button>
        <button className="next-button">Next Module</button>
      </div>
    </div>
  );
}

export default GF_l1;
