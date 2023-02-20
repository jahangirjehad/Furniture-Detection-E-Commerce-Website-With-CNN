
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import {BrowserRouter, Route,Routes  } from 'react-router-dom';   
import Sidebar from './pages/Sidebar';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';



function App() {
 
  return (
    <div className="App">
      
    <div className="App">
      
      <Routes>
        <Route path='/sidebar' element = {<Sidebar/>} />
        <Route path='/signup' element = {<SignUp/>}/>
        <Route path='/' element = {<Login/>}/>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/details' element = {<ProductDetails/>}/>
        <Route path='/cart' element = {<Cart/>}/>
      </Routes>
      

    </div>
    </div>
  );
}

export default App;
