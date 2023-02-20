import React from 'react'
import { createMemoryRouter, generatePath, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { app } from '../firebase';
import { useState, useEffect } from 'react';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  setDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { async, map, RANDOM_FACTOR, uuidv4 } from '@firebase/util';
import Sidebar from './Sidebar';
import { getAuth } from "firebase/auth";
import { Firestore } from 'firebase/firestore';
import Comment from './Comment';
let pId;
const firestore = getFirestore();
const ProductDetails = () => {
  let name, image, price, details, pid;
  const Auth = getAuth();
    const User = Auth.currentUser;
    let cmtName = User.email;
  const location = useLocation();

  const storage = getStorage();
  const [info, setInfo] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const productId = location.state.name;
  pId = productId;
  useEffect(() => {
    Fetchdata();

    return () => {

    };
  }, []);
  const Fetchdata = async () => {
    const querySnapshot = await getDoc(doc(firestore, "products", productId));
    console.log("data = " + querySnapshot.data().name);
    name = querySnapshot.data().name;
    image = querySnapshot.data().image;
    price = querySnapshot.data().price;
    details = querySnapshot.data().details;
    pid = querySnapshot.id;
    console.log("pid = " + pid);
    setInfo(querySnapshot.data());
    console.log("in function = " + name + image + price)
  }
  console.log("out frame = " + name + image + price);

  //const [,save] = useDatabasePush('comments')
  const [comment, setComment] = useState('')

  const bttnClick = async () => {
    if(comment!=null)
       setShowDiv(true);
    const auth = getAuth();
    let user = auth.currentUser;
    console.log("pid = " + pId);
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    console.log(comment);
    const parentDocRef = doc(firestore, "comment", pId); // reference to the user1 document in the "users" collection
    const subcollectionRef = collection(parentDocRef, "allComment"); // reference to the "messages" subcollection

    const messageData = {
      value: comment,
      date: Date().toLocaleString(),
      name: email,

    };

    await setDoc(doc(subcollectionRef), messageData);
    
    
    

  }


  return (
    <>
      <div style={{ display: 'flex', overflow: 'scroll initial' }}>
        <Sidebar />
        <div style={{ display: 'grid', marginLeft: '5px', overflow: 'scroll initial', width: '40%' }}>
          {console.log("frame = " + name + image + price)}
          {
            <Frame
              name={info.name}
              price={info.price}
              image={info.image}
              details={info.details}
            />

          }

        </div>
        <div style={{ border: '2px solid black', width: '40%', marginLeft: '1s%', }}>
          <div className='card' style={{ width: '98%', border: '2px solid black', margin: '5px' }}>
            <textarea value={comment} onChange={evt => setComment(evt.target.value)} />
          </div>
          <button onClick={bttnClick}>Comment</button>
          {showDiv && 
          <div className='' style={{
            border:'1px solid black', 
            backgroundColor:'powderblue', height:'7%',justifyContent:'right',marginLeft:'2%'}}>
          <p>{cmtName}</p>
          <p>{comment}</p>
          <p>{Date().toLocaleString()}</p>
          </div>
          }
          <Comment pId = {pId}/>
        </div>
      </div>

    </>
  );
}


const Frame = ({ name, price, image, details }) => {
  const navigate = useNavigate();
  console.log("frame = " + name + " " + image + " " + price + " " + details);
  const btnClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
      let quantity = 1;
      console.log(email);
      await setDoc(doc(firestore, "add-to-cart", email, "products", pId), {
        name: name,
        price: price,
        image: image,
        quantity: 1,
        totalPrice: quantity * price
      });
    }
  }
  return (
    <>
      <div className='card row' >
        <div className='col'>
          <div className="center" >
            <img className='' src={image} alt="image product" style={{ width: '100%' }} />
            <p className='' style={{ color: "blue", fontSize: '30px' }}>Name : {name}</p>
            <p className='' style={{ color: 'green', fontSize: '40px' }}>Price : {price}</p>
          </div>
          <div>
            <p className='text-justify' style={{ fontFamily: 'cursive' }}>{details}</p>
          </div>
          <div className='btn btn-dark'>
            <button type='submit' onClick={btnClick} className='btn btn-dark' style={{ alignContent: 'center' }}><p style={{ fontSize: '20px' }}>Add to Cart</p></button>
          </div>

        </div>

      </div>

    </>

  );

}

export default ProductDetails