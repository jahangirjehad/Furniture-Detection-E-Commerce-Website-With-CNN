import React, { useState, useEffect } from 'react';
import slide1 from '../slide1.jpg';
import slide2 from '../slide2.png';
import slide3 from '../slide3.png';
import './ImageBanner.css';

const CarouselSlider = () => {
  const images = [slide1, slide2, slide3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  const sliderStyle = {
    transform: `translateX(-${currentImageIndex * 33.33}%)`, // Adjust the percentage based on the number of images
  };

  return (
    <div className="image-banner">
      <div className="image-slider" style={sliderStyle}>
        {images.map((image, index) => (
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="image"
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselSlider;
