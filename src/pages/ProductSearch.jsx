import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import CustomNavbar from './CustomNavbar'
import './Navbar.css';

const ProductSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryTerm = queryParams.get('query');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      console.log(location);
      const db = getFirestore();
      const productsCollection = collection(db, 'products');
      const productsQuery = query(productsCollection);

      try {
        const snapshot = await getDocs(productsQuery);
        const products = snapshot.docs.map((doc) => ({id:doc.id, ...doc.data()}));
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(queryTerm.toLowerCase()) ||
        product.price.toString() === queryTerm
    );
    setResults(filteredProducts);
  }, [queryTerm, allProducts]);

  return (
    <div style={{backgroundColor:'#202A44', color:'white'}}>
        <CustomNavbar/>
      <div style={{display:'flex', flexWrap:'wrap',justifyContent:'center', justifyItems:'center'}}>
      <h2>Search Results</h2>
      </div>
      {results.length > 0 ? (
        <div className='product' style={
            {
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              overflow: 'scroll initial'
              
            }
          } >
  
  
            {
              results.map((element, i) => (
                <Frame key={i} name={element.name}
                  price={element.price}
                  image={element.image}
                  id={element.id}
  
                />
              ))
  
            }
            
            
          </div>
      ) : (
        <p>No search results found.</p>
      )}
    </div>
  );
};


const Frame = ({ name, price, image, id }) => {
    const [backgroundColor, setBackgroundColor] = useState('#00BFFF');
    const containerStyle = {
      backgroundColor: backgroundColor,
      color: 'white',
      transition: 'background-color 0.3s ease',
    };
    const navigate = useNavigate();
    //console.log(name + " " + image + " " + price + " " + id);
    var Id = id;
    const btnClick = () => {
      const auth = getAuth();
      console.log(auth.currentUser.email, Id);
      navigate('/details', { state: { id: 1, name: Id } });
    }
    const handleMouseEnter = () => {
      // Change background color on hover
      setBackgroundColor('red');
    };
  
    const handleMouseLeave = () => {
      // Revert back to original background color on hover out
      setBackgroundColor('blue');
    };
  
    return (
      <>
        <div key={id} className='card' style={{ height: '15rem', width: '15rem', margin: '20px', justifyContent: 'center', justifyItems: 'center' }} >


<img className='card dashboard-card' onClick={btnClick} src={image} alt="image product" style={{ height: '15rem', width: '15rem', cursor: 'pointer' }} />

</div>
  
      </>
  
    );
  
  } 



export default ProductSearch;
