import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState,useEffect} from "react";
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import{Link, useNavigate} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";

import "./style.css"

import{app} from "../firebase";
 const auth = getAuth();
 

const Login = () => {
    const nevigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    
    
    const loginUser = () => {
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            nevigate("/dashboard")
            //console.log(user);
        })
        .catch((err)=>console.log(err));
    }
    
    
    return (
        <div className="form">
          <div className="form-body">
              
              <div className="email">
                  <label className="form__label" for="email">Email </label>
                  <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" for="password">Password </label>
                  <input onChange={(e)=>setPassword(e.target.value)} value={password} className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
              
          </div>
          <div class="footer">
              
                <button onClick={loginUser} type="submit" className="btn btn-dark">Login</button><br/>
                <p>
                    Didn't have an account? <button onClick={()=>nevigate('/signup')} type="submit" className="btn btn-secondary btn-sm">Sign Up</button>
                </p>
                
          </div>
      </div> 
    );
}
export default Login;