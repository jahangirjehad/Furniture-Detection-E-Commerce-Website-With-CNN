import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import { useState, useEffect, useRef } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminNavbar from './AdminNavbar';

const storage = getStorage();
const firestore = getFirestore();

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [className, setClassName] = useState('');

  const [model, setModel] = useState(null);
const [predictions, setPredictions] = useState([]);
const [imagee, setImagee]= useState();
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

  const handleInputChange1 = (event) => {
    setName(event.target.value);
  };
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
      let max = predictions[0];
let maxIndex = 0;

for (let i = 1; i < predictions.length; i++) {
  if (predictions[i] > max) {
    max = predictions[i];
    maxIndex = i;
  }
}
if(maxIndex==0) setClassName('Table');
else if(maxIndex == 1) setClassName('Chair');
else if(maxIndex == 2) setClassName('Sofa');
else setClassName('bed');
      console.log("prediction = "+maxIndex);
      setPredictions(predictions);
      image.dispose();
      resizedImage.dispose();
      expandedImage.dispose();
    } catch (error) {
      console.error('Failed to predict image:', error);
    }
  };

  const handleInputChange2 = (event) => {
    setPrice(event.target.value);
  };

  const handleInputChange3 = (event) => {
    setDetails(event.target.value);
  };
  const imageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagee(reader.result);
    };
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const imageURL = URL.createObjectURL(file);
    setImageUrl(imageURL);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagee(reader.result);
    };
  };

  const handleUploadImage = async () => {
    if (image) {
      try {
        setLoading(true);
        const storageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImageUrl(downloadURL);
        console.log('Image uploaded successfully' + imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      await addDoc(collection(firestore, 'products'), {
        name: name,
        price: price,
        details: details,
        image: imageUrl,
        category: className,
      });
      
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
      setName('');
      setPrice('');
      setImage(null);
      setDetails('');
      setClassName(''); 
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="card m-2 p-3">
      
      <h3 className="mb-3">Add Product</h3>
      <div className="form-group">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Selected"
            className="img-thumbnail mb-3"
            style={{ maxWidth: '200px' }}
          />
        )}
        <label>Image:</label>
        <input type="file" className="form-control-file" onChange={handleImageChange} />
        <button className="btn btn-primary my-3" 
        onClick={async () => {
          const imageURL = imagee;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            imageRef.current = img;
            predictImage();
            handleUploadImage();
          };
          img.src = imageURL;
        }}
         disabled={loading}>
          {loading ? 'Loading...' : 'Upload & Predict Image'}
        </button>
      </div>
      <div className="form-group">
        <label>Name:</label>
        <input type="text" className="form-control" value={name} onChange={handleInputChange1} />
      </div>
      <div className="form-group">
        <label>Catagory:</label>
        <input type="text" className="form-control" defaultValue={className} />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input type="text" className="form-control" value={price} onChange={handleInputChange2} />
      </div>
      <div className="form-group">
        <label>Details:</label>
        <input type="text" className="form-control" value={details} onChange={handleInputChange3} />
      </div>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Data'}
      </button>
    </div></>
  );
};

export default AddProduct;
