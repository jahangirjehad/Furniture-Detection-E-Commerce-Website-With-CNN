import React from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';
import Comment from './Comment';

const firestore = getFirestore();
let pId;
const ProductDetails = () => {
  const location = useLocation();
  const [info, setInfo] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [showBeforeDiv, setShowBeforeDiv] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');


  const productId = location.state.name;
  pId = productId;

  useEffect(() => {
    fetchData();
    unsubscribe();

    return () => { };
  }, []);

  const unsubscribe = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.email) {
        setUser(user.email);

        // Check if the user has already liked the post
        const snap = await getDoc(doc(firestore, 'likes', pId, 'like', `${pId}-${user.email}`));
        if (snap.data().size !== 0) {
          setIsLiked(true);
        }
      } else {
        setUser(null);
        setIsLiked(false);
      }
    } catch (error) {
      console.log('User', error);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDoc(doc(firestore, 'products', productId));
      const data = querySnapshot.data();
      setInfo(data);
    } catch (error) {
      console.log('Fetch data', error);
    }
  };

  const handleCommentSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;

    const parentDocRef = doc(firestore, 'comment', pId);
    const subcollectionRef = collection(parentDocRef, 'allComment');

    const messageData = {
      value: comment,
      date: new Date().toLocaleString(),
      name: email,
    };

    await setDoc(doc(subcollectionRef), messageData);

    if (comment !== '') {
      if (showDiv && !showBeforeDiv) {
        setShowBeforeDiv(true);
        setShowDiv(false);
      } else {
        setShowBeforeDiv(false);
        setShowDiv(true);
      }
    }
  };

  const handleLike = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
      // Toggle the like status
      const isCurrentlyLiked = isLiked;
      setIsLiked(!isLiked);

      // Create or delete the like document in Firestore
      if (isCurrentlyLiked) {
        await deleteDoc(doc(firestore, 'likes', pId, 'like', `${pId}-${user.email}`));
        setLikeCount(count => count - 1);
      } else {
        await setDoc(doc(firestore, 'likes', pId, 'like', `${pId}-${user.email}`), {
          email: user.email,
        });
        setLikeCount(count => count + 1);
      }
    } else {
      alert('You must be logged in to like this post.');
    }
  };

  useEffect(() => {
    countLikes();

    return () => { };
  }, []);

  const countLikes = async () => {
    const collectionRef = collection(firestore, 'likes', pId, 'like');

    try {
      const querySnapshot = await getDoc(collectionRef);
      const totalSize = querySnapshot.docs.length;
      setLikeCount(totalSize);
    } catch (error) {
      console.error('Count likes', error);
    }
  };



  return (
    <>
      <CustomNavbar />
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card">
          <Frame
            name={info.name}
            price={info.price}
            image={info.image}
            details={info.details}
            like={info.like}
          />
          <div className="d-flex align-items-center" style={{ margin: '10px' }}>
            <button className={`btn btn-primary ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
              {isLiked ? 'Unlike' : 'Like'}
            </button>
            <span style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', height: '50px', width: '70px', backgroundColor: 'yellow', margin: '30px', fontSize: '20px' }}>{likeCount} likes</span>
          </div>
        </div>
        <div className="card">
          <textarea
            value={comment}
            onChange={evt => setComment(evt.target.value)}
            className="form-control"
            rows="3"
            placeholder="Write a comment..."
          ></textarea>
          <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>
            Comment
          </button>
          {showDiv && <Comment pId={pId} />}
          {showBeforeDiv && <Comment pId={pId} />}
        </div>
      </div>
      <Footer />
      <style>
        {`
          .liked {
            background-color: red;
            color: white;
          }

          .frame-container {
            display: flex;
            align-items: center;
            
          }

          .product-image {
            width: 200px;
            height: 200px;
            margin-right: 1.5rem;
          }

          .product-details {
            flex: 1;
          }

          .product-name {
            color: #007185;
            font-size: 24px;
            margin-bottom: 0;
          }

          .product-price {
            color: #008000;
            font-size: 20px;
          }

          .product-description {
            text-align: justify;
            margin-bottom: 1rem;
          }

          .add-to-cart-button {
            padding: 0.5rem 1rem;
            font-size: 16px;
          }
        `}
      </style>
    </>
  );
};

const Frame = ({ name, price, image, details, like }) => {
  const [showMessage, setShowMessage] = useState(false);
  const handleAddToCart = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
      const email = user.email;
      const quantity = 1;

      await setDoc(doc(firestore, 'add-to-cart', email, 'products', pId), {
        name: name,
        price: price,
        image: image,
        details: details,
        Quantity: 1,
        totalPrice: price,
      });
      setShowMessage(true);
    }
  };

  return (
    <div className="frame-container">
      <img className="product-image" src={image} alt="product" style={{ height: '500px', width: '450px' }} />
      <div className="product-details">
        <h2 className="product-name">{name}</h2>
        <h3 className="product-price">Price: {price}</h3>
        <p className="product-description">{details}</p>
        <button className="btn btn-primary add-to-cart-button" type="submit" onClick={handleAddToCart}>
          Add to Cart
        </button>
        {showMessage && <p style={{ fontSize: '30px' }}>Product added to cart!</p>}
      </div>
    </div>
  );
};

export default ProductDetails;
