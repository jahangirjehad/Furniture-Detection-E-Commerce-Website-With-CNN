import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Comment = (props) => {
  const firestore = getFirestore();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'comment', props.pId, 'allComment'));
    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setComments(newData);
  };

  return (
    <div style={{ marginLeft: '3%' }}>
      {comments.map((element, i) => (
        <Frame key={i} name={element.name} date={element.date} value={element.value} id={element.id} />
      ))}
    </div>
  );
};

const Frame = ({ name, date, value, id }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  return (
    <>
      <div key={id} className="comment-container">
        <p className="comment-name">{name}</p>
        <p className="comment-date">{date}</p>
        <p className="comment-value">{value}</p>
        
        <div className="comment-actions">
          <button className={`btn btn-primary ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            {isLiked ? 'Unlike' : 'Like'}
          </button>
          <span className="comment-like-count">{likeCount} likes</span>
        </div>
      </div>
      <style>
        {`
          .comment-container {
            border: 1px solid black;
            background-color: white;
            margin-top: 3px;
            border-radius: 30px;
            display: grid;
            padding: 10px;
          }

          .comment-name {
            font-size: 20px;
            margin: 0;
          }

          .comment-value {
            margin: 5px 0;
            font-size:30px;
          }

          .comment-date {
            font-size: 12px;
            color: gray;
            margin: 0;
          }

          .comment-actions {
            display: flex;
            align-items: center;
          }

          .comment-actions button {
            margin-right: 10px;
          }

          .comment-like-count {
            font-size: 14px;
          }

          .comment-actions button.liked {
            background-color: red;
            color: white;
          }
        `}
      </style>
    </>
  );
};

export default Comment;
