import React from 'react';
import '../components css/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Google Sheets Embed */}
      <iframe 
        className="contact-iframe"
        src="https://docs.google.com/spreadsheets/d/15CMT_dpOG_d-5iJHO4o--50rGTyO3oujhDAgJXYm0XM/edit?usp=sharing"
        width="100%" 
        height="600" 
        title="Student Log"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Contact;
