import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const NumberCounter = () => {
  const navigate = useNavigate();
  const counterRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const counterElement = counterRef.current;
    const boxElement = boxRef.current;

    const animation = gsap.fromTo(
      counterElement,
      { innerHTML: '0', opacity: 0 },
      {
        innerHTML: '100',
        duration: 1.25,
        ease: 'power3.out',
        delay: 1,
        opacity: 1,
        onUpdate: () => {
          const percentage = Number(counterElement.innerHTML);
          gsap.to(boxElement, { width: `${percentage}%` });
        },
        onComplete: () => {
          navigate('/dashboard');
        },
      }
    );

    return () => {
      animation.kill(); // Cancels the animation if the component is unmounted before completion
    };
  }, [navigate]);

  return (
    <div
      style={{
        background: 'lightgray',
        height: '100vh',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '50%',
          height: '30px',
          background: 'blue',
          overflow: 'hidden',
        }}
      >
        <div
          ref={boxRef}
          style={{
            width: '0%',
            height: '100%',
            background: 'green',
          }}
        ></div>
      </div>
      <h1
        ref={counterRef}
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'blue',
          fontFamily: 'Arial, sans-serif',
          margin: '2rem',
        }}
      ></h1>
    </div>
  );
};

export default NumberCounter;
