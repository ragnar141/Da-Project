import React from 'react';
import '../components css/Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Text above the contact container */}
      <p className="contact-description">
        Below is a Google Sheet that you can use to connect with other students.<br></br> We encourage you to find somebody and strike a conversation about something you have learned.
      </p>

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
    </div>
  );
};

export default Contact;
