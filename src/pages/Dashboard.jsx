// Import Firestore database
import 'bootstrap/dist/css/bootstrap.min.css';
import { app } from '../firebase';
import { useState, useEffect } from 'react';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import React from 'react'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { map } from '@firebase/util';
import Sidebar from './Sidebar';
import ProductDetails from './ProductDetails';
//import './read.css';

const myStyle = {
  width: "5 rem"
};

const Dashboard = () => {

  var Id;
  var dataa;
  const firestore = getFirestore();
  const storage = getStorage();
  const [info, setInfo] = useState([]);
  // Start the fetch operation as soon as
  // the page loads
  useEffect(() => {
    Fetchdata();

    return () => {

    };
  }, []);
  // Fetch the required data using the get() method
  const Fetchdata = async () => {
    await getDocs(collection(firestore, "products"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setInfo(newData);
        console.log(info, newData);
      })
  }

  //console.log();
  //querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  //console.log(doc.id, " => ", doc.data());
  //setInfo(arr => [...arr , doc.data()]);
  //dataa = doc.data();
  //console.log(dataa['name']);
  return (

    <>
      <div style={{ display: 'flex', overflow: 'scroll initial' }}>
        <Sidebar />
        <div className='product' style={
          {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            overflow: 'scroll initial',
            width: '100%'
          }
        }>


          {
            info.map((element, i) => (
              <Frame key={i} name={element.name}
                price={element.price}
                image={element.image}
                id={element.id}

              />
            ))

          }
        </div>
      </div>
    </>

  );
}



const Frame = ({ name, price, image, id }) => {
  const navigate = useNavigate();
  console.log(name + " " + image + " " + price + " " + id);
  var Id = id;
  const btnClick = () => {
    navigate('/details', { state: { id: 1, name: Id } });
  }

  return (
    <>
      <div key={id} className='product card' style={{ height: '25rem', width: '20rem', border: '2px solid black', marginTop: '5px' }} >
        <div className=''>
          <div className="center" style={myStyle}>
            <img className='' src={image} alt="image product" style={{ width: '100%' }} />
            <p className=''>Name : {name}</p>
            <p className=''>Price : {price}</p>
            <button className='btn btn-primary' onClick={btnClick}>Details</button>
          </div>

        </div>

      </div>

    </>

  );

}   // Display the result on the page



// Define how each display entry will be structured

export default Dashboard;
