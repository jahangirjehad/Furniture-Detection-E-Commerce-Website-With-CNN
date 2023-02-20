import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from "react";
import "./style.css"
import{getAuth,createUserWithEmailAndPassword} from "firebase/auth";
import{app} from "../firebase";
const auth = getAuth();
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const createUser =()=>{
        createUserWithEmailAndPassword(auth,email,password).then((value)=>console.log(value));

    };
    return (
        <div className="form">
          <div className="form-body">
              <div className="username">
                  <label className="form__label" for="firstName">First Name </label>
                  <input className="form__input" type="text" id="firstName" placeholder="First Name"/>
              </div>
              <div className="lastname">
                  <label className="form__label" for="lastName">Last Name </label>
                  <input  type="text" name="" id="lastName"  className="form__input"placeholder="LastName"/>
              </div>
              <div className="email">
                  <label className="form__label" for="email">Email </label>
                  <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" for="password">Password </label>
                  <input onChange={(e)=>setPassword(e.target.value)} value={password} className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
              <div className="confirm-password">
                  <label className="form__label" for="confirmPassword">Confirm Password </label>
                  <input className="form__input" type="password" id="confirmPassword" placeholder="Confirm Password"/>
              </div>
          </div>
          <div class="footer">
              <button onClick={createUser} type="submit" className="btn btn-dark">Register</button>
          </div>
      </div> 
    );
}
export default SignUp;