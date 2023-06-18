import React from 'react';
import img from '../Facebook-logo-500x313.png'
import img2 from '../Instagram-Logo-500x281.png'

const Footer = () => {
  const imageUrl = '../Facebook-logo-500x313.png';
  const footerStyle = {
    backgroundColor: '#27445C',
    padding: '20px',
    textAlign: 'center',
    outline: '2px solid #333',
    color:'#ffff'
  };

  const sectionStyle = {
    margin: '20px',
  };

  const socialMediaLinksStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#ffff',
  };

  return (
    <footer style={footerStyle}>
      <div style={{display:'flex', justifyContent:'center'}}>
        <div>
          <div style={sectionStyle}>
            <h4>Address</h4>
            <p>Jobra, Hathazari, Chittagong</p>
          </div>
          <div style={sectionStyle}>
            <h4>Contact</h4>
            <p>Phone: +8801631790814</p>
          </div>
          <div style={sectionStyle}>
            <h4>Email</h4>
            <p>furniturecollection@gmail.com</p>
          </div>

          
        </div>
        <div>
        <div style={sectionStyle}>
            <h4>Social Media</h4>
            <div style={socialMediaLinksStyle}>
              <a href="https://www.facebook.com" style={linkStyle}> <img src={img} height={'30px'} alt="Facebook"/> </a>
              <a href="https://www.instagram.com" style={linkStyle}><img src={img2} height={'30px'} alt="Instragram"/></a>
            </div>
            <div className="bottom-footer">
        <p>&copy; {new Date().getFullYear()} FurnitureClassification. All rights reserved.</p>
        <p ><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </div>
          </div>
        </div>
        <div style={{}}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7373.498708368447!2d91.81386259571575!3d22.47605135566134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sbn!2sbd!4v1686772539028!5m2!1sbn!2sbd" 
          width="400" height="300" frameborder="2" style={{}} allowfullscreen="" aria-hidden="false" tabindex="0" ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
