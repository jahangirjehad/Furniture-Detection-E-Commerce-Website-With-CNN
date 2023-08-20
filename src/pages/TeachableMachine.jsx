import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import CustomNavbar from './CustomNavbar'
import Footer from './Footer';

function TeachableMachine() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imagee, setImagee] = useState();
  const imageRef = useRef(null);

  const loadModel = async () => {
    try {
      const model = await tf.loadLayersModel('https://storage.googleapis.com/tm-model/SkGRjNtMm/model.json');
      setModel(model);
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  const predictImage = async () => {
    try {
      if (!model) {
        console.error('Model not loaded');
        return;
      }

      if (!imageRef.current) {
        console.error('Image not loaded');
        return;
      }

      const image = tf.browser.fromPixels(imageRef.current);
      console.log(image);
      const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
      const expandedImage = resizedImage.expandDims();
      const predictions = await model.predict(expandedImage).data();
      console.log("prediction = " + predictions);
      setPredictions(predictions);
      image.dispose();
      resizedImage.dispose();
      expandedImage.dispose();
    } catch (error) {
      console.error('Failed to predict image:', error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagee(reader.result);
    };
  };

  return (<>
    <CustomNavbar />
    <div className='card' style={{ display: 'grid', justifyContent:'center', justifyItems:'center' }}>
      <div style={{display:'flex', margin:'20px'}}>
        <div style={{display:'grid'}}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        { imagee === null ? <p>No Image selected</p>: <img src={imagee} height='400px' width='400px'/> }
        
        <button className='btn btn-primary' onClick={async () => {
          const imageURL = imagee;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            imageRef.current = img;
            predictImage();
          };
          img.src = imageURL;
        }}>Predict</button>
        </div>
        
        {predictions.length > 0 ? (
          <div style={{fontSize: '20px', fontWeight:'bold', display:'grid', justifyContent:'center' }}>
            
              <ul>
              <li>Table = {(predictions[0] * 100).toFixed(2)}%</li>
              <li>Chair = {(predictions[1] * 100).toFixed(2)}%</li>
              <li>Sofa = {(predictions[2] * 100).toFixed(2)}%</li>
              <li>Bed = {(predictions[3] * 100).toFixed(2)}%</li>
              </ul>
            
          </div>
        ):<div></div>}
      </div>

      
    </div>
    <Footer />
  </>
  );
}

export default TeachableMachine;