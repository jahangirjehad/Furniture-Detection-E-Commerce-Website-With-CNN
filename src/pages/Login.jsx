import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import "./style.css"

const auth = getAuth();

const Login = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
    localStorage.setItem('rememberMe', rememberMe);
    const s = localStorage.getItem('rememberMe');
    console.log("s= " + s);
  };

  const loginUser = () => {
    if (email === 'admin' && password === 'admin') {
      navigate("/adminHome");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const session = userCredential;
          localStorage.setItem('userEmail', session.user.email);
          localStorage.setItem('userId', session.user.uid);
          localStorage.setItem('rememberMe', rememberMe);
          const s = localStorage.getItem('rememberMe');
          console.log("ss =" + s);
          navigate("/gsap");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    gsap.fromTo(
      bannerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 3 },
      
    );
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="bannerStyle" ref={bannerRef}>
                <h2 className="headingStyle">Welcome to FurnitureCollection!</h2>
                <p className="paragraphStyle">Discover amazing deals and offers.</p>
              </div>
              <div className="form-group">
                <br />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <br />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="rememberMeCheckbox">
                  Keep Me Logged In
                </label>
              </div>
              <button onClick={loginUser} type="submit" className="btn btn-primary btn-block">
                Login
              </button>
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;