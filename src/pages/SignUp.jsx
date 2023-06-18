import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import "./style.css"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { app } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
const auth = getAuth();
const firestore = getFirestore();

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [username, setUsername] = useState('');
  const nevigate = useNavigate();
  const divisions = [
    {
      name: 'Dhaka',
      districts: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail']
    },
    {
      name: 'Chittagong',
      districts: ['Chittagong', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Comilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati']
    },
    {
      name: 'Rajshahi',
      districts: ['Rajshahi', 'Bogra', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Sirajganj']
    },
    {
      name: 'Khulna',
      districts: ['Khulna', 'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira']
    },
    {
      name: 'Barisal',
      districts: ['Barisal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur']
    },
    {
      name: 'Sylhet',
      districts: ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj']
    },
    {
      name: 'Rangpur',
      districts: ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon']
    },
    {
      name: 'Mymensingh',
      districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
    }
    // Add more divisions with their respective districts here
  ];
  const [selectedDivision, setSelectedDivision] = useState('');
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'userNames'));
        const user = [];
        querySnapshot.forEach((doc) => {
          user.push(
            doc.data().name
          );
        });
        setUsers(user);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
    console.log(users);
  }, [firestore]);
  const createUser = async () => {


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registration successful
        const user = userCredential.user;
        console.log('Registered user:', user);
        // Send verification email to the user
        sendVerificationEmail(user);
        nevigate("/login")
      })
      .catch((error) => {
        // Handle registration errors
        console.error('Registration error:', error);
      });
    await setDoc(doc(collection(firestore, 'userNames')), {
      name: username,
    }).then((value) => console.log(value));

  };
  const sendVerificationEmail = (user) => {
    sendEmailVerification(user)
      .then(() => {
        console.log('Verification email sent');
        // Redirect the user to a verification page or show a success message
      })
      .catch((error) => {
        console.error('Error sending verification email:', error);
      });
  };
  function handleUsernameChange(event) {
    setUsername(event.target.value.trim());
    setIsUsernameTaken(users.includes(event.target.value.trim()));
  }
  const handleDivisionChange = (e) => {
    const selectedDivision = e.target.value;
    setSelectedDivision(selectedDivision);

    const selectedDistricts = divisions.find((division) => division.name === selectedDivision)?.districts || [];
    setDistricts(selectedDistricts);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 style={{ justifyContent: 'center', justifyItems: 'center' }}>Sign Up</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name:</label>
                  <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name:</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} placeholder="Email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input type="text" className="form-control" id="username" name="username" value={username} onChange={handleUsernameChange} placeholder="Username" />
                  {isUsernameTaken && (
                    <div style={{ color: 'red' }}>This username is already taken. Please choose a different one.</div>
                  ) || <div style={{ color: 'green' }}>Unique User Name.</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="birthDate" className="form-label">Birth Date:</label>
                  <input type="date" className="form-control" id="birthDate" />
                </div>
                <div className="mb-3">
                  <label htmlFor="division" className="form-label">Select Division:</label>
                  <select id="division" className="form-select" value={selectedDivision} onChange={handleDivisionChange}>
                    <option value="">Select Division</option>
                    {divisions.map((division) => (
                      <option key={division.name} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedDivision && (
                  <div className="mb-3">
                    <label htmlFor="district" className="form-label">Select District:</label>
                    <select id="district" className="form-select">
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                </div>
                <div className="text-center">
                  <button type="button" className="btn btn-primary" onClick={createUser}>Register</button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default SignUp;