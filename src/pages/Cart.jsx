import React from 'react'
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDocs, collection, getFirestore, deleteField, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { async } from '@firebase/util';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard';
import CustomNavbar from './CustomNavbar'
import Footer from './Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
var totalAmount;
totalAmount = 0;
const auth = getAuth();


const Cart = () => {
    const firestore = getFirestore();
    const [info, setInfo] = useState([]);
    const [amount, setAmount] = useState(totalAmount);
    const [address, setAddress] = useState('');
    const [isPlaced, setIsPlaced] = useState(false);
    const [invoiceLink, setInvoiceLink] = useState('');
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
    const [mobile, setMobile] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [payment, setPayment] = useState('');
    const nevigate = useNavigate();
    let check;
    useEffect(() => {
        totalAmount = 0;
        Fetchdata();
        return () => { };
    }, [])
    const Fetchdata = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user.email;
        console.log(email);
        await getDocs(collection(firestore, "add-to-cart", email, "products"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setInfo(newData);
                info.map((p, i) => (totalAmount = totalAmount + Number(p.price)));
                if (info.length == 0)
                    setAmount(0);
                else
                    setAmount(totalAmount)
                console.log(info, newData);
            })
    }
    console.log(info.length);
    console.log(totalAmount);
    const handlePlaceOrder = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user.email;
        Fetchdata();
        console.log(selectedDivision, selectedDistrict, mobile, payment);

        // Create an order object with address and cart items
        const order = {
            division: selectedDivision,
            district: selectedDistrict,
            mobile: mobile,
            payment: payment,
            items: info, // Assuming you have info array containing cart items
        };

        // Save the order to the database
        try {
            const orderRef = await addDoc(collection(firestore, 'orders'), order);
            console.log('Order placed with ID:', orderRef.id);

            // Generate the invoice as a PDF
            generateInvoicePDF(order);

            // Clear the cart or perform any other necessary actions

            // Set the flag to indicate that the order is placed
            setIsPlaced(true);
        } catch (error) {
            console.error('Error placing the order:', error);
        }
    };



    const handleDivisionChange = (e) => {
        const selectedDivision = e.target.value;
        setSelectedDivision(selectedDivision);

        const selectedDistricts = divisions.find((division) => division.name === selectedDivision)?.districts || [];
        setDistricts(selectedDistricts);
        console.log(selectedDivision, districts);
    };
    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setSelectedDistrict(selectedDistrict);
    };
    const handlePaymentChange = (e) => {
        const selectedPayment = e.target.value;
        setPayment(selectedPayment);
    };

    const generateInvoicePDF = (order) => {
        const userEmail = auth.currentUser.email;
        const doc = new jsPDF();

        // Set the title for the invoice
        doc.setFontSize(20);
        doc.text('Furniture Collection', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

        const companyName = 'Furniture Collection Limited';
        const companyAddress = 'Jobra, Hathazari, University of Chittagong, Chittagong';
        const companyMobile = '01631790814';
        const companyEmail = 'furniturecollection@gmail.com';

        const leftMargin = 10; // Adjust the left margin as needed

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor('#333333');

        doc.text(companyName, leftMargin, 15);
        doc.setFontSize(10);
        doc.text(companyAddress, leftMargin, 20);
        doc.setFontSize(12);
        doc.text(`Mobile: ${companyMobile}`, leftMargin, 25);
        doc.text(`Email: ${companyEmail}`, leftMargin, 30);

        const date = new Date().toLocaleDateString(); // Get the current date
        const rightMargin = doc.internal.pageSize.getWidth() - 10; // Adjust the right margin as needed
        doc.text('Billing And Shiping Information:', 50, 55);
        doc.setFontSize(14);
        doc.text(date, rightMargin, 20, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        doc.text(`Customer Email: ${userEmail}`, 10, 70);
        doc.text(`Division: ${order.division}`, 10, 80);
        doc.text(`District: ${order.district}`, 10, 90);
        doc.text(`Mobile Number: ${order.mobile}`, 10, 100);
        doc.text(`Payment Type: ${order.payment}`, 10, 110);

        // Set table headers
        const tableHeaders = ['Name', 'Quantity', 'Price', 'Sub Total Price'];
        const tableData = [tableHeaders];

        // Add items to table
        order.items.forEach((item) => {
            const rowData = [item.name, item.quantity, item.price, item.totalPrice];
            tableData.push(rowData);
        });

        // Set table properties
        const tableSettings = {
            startY: 130,
            margin: { top: 10 },
        };

        // Add table to the document
        doc.autoTable({
            head: tableData.slice(0, 1),
            body: tableData.slice(1),
            ...tableSettings,
        });

        // Add total amount at the end of the table
        const totalAmount = calculateTotalAmount(order.items);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: ${totalAmount}`, doc.internal.pageSize.getWidth() - 10, doc.autoTable.previous.finalY + 10, { align: 'right' });

        // Save the PDF document as a file
        doc.save('invoice.pdf');
    };



    const calculateTotalAmount = (items) => {
        return items.reduce((total, item) => total + parseInt(item.totalPrice), 0);
    };

    if (isPlaced) {
        // Render success message with invoice download link
        return (
            <div>
                <CustomNavbar />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card mt-5">
                                <div className="card-body text-center">
                                    <h1 className="mb-4">Order Placed Successfully!</h1>
                                    <p>
                                        <a href={invoiceLink} download>
                                            Download Invoice
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (info.length == 0)
        return (<div className='card'>
            <CustomNavbar />
            <h1>Your Cart is empty!</h1>
            <Footer />
        </div>);
        
    return (
        <> 
            <div>
            <CustomNavbar />
            <div style={{ display: 'grid', margin: '10px' }}>
                <div className='card' style={{ width: '100%', maqrgin: '10px' }}>
                    <table className='table'>
                        <thead>
                            <tr>

                                <th style={{ width: '20%' }}>Image</th>
                                <th style={{ width: '10%' }}>Name</th>
                                <th style={{ width: '10%' }}>Price</th>
                                <th style={{ width: '10%' }}>Quantity</th>
                                <th style={{ width: '10%' }}>Subtotal</th>
                                <th style={{ width: '10%' }}>Delete</th>

                            </tr>
                        </thead>
                    </table>


                    {
                        info.map((element, i) => (
                            <Frame
                                key={i}
                                name={element.name}
                                price={element.price}
                                image={element.image}
                                id={element.id}


                            />
                        ))
                    }
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
                            <select id="district" className="form-select" onChange={handleDistrictChange}>
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
                        <label htmlFor="mobileNumber" className="form-label">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="mobileNumber"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="paymentType" className="form-label">
                            Payment Type
                        </label>
                        <select
                            className="form-select"
                            id="paymentType"
                            value={payment}
                            onChange={handlePaymentChange}
                        >
                            <option value="">Select Payment Type</option>
                            <option value="bksh">Bkash</option>
                            <option value="roket">Roket</option>
                            <option value="nogod">Nogod</option>
                        </select>
                    </div>

                    {/* Place Order button */}
                    <div className="text-center">
                        <button
                            className="btn btn-primary"
                            onClick={handlePlaceOrder}
                        >
                            Place Order
                        </button>
                    </div>


                </div>

            </div>
            <Footer />
            </div>

        </>
    );

}

const Frame = ({ name, price, image, id }) => {
    console.log(name + " " + image + " " + price + " " + id);
    var Id = id;

    const [qntty, setQntty] = useState(1);
    const [tprice, setTprice] = useState(price);
    // const [product, setProduct] = useState([name, price, quantity, totalPrice, image]);

    const nevigate = useNavigate();
    const firestore = getFirestore();

    const updateQuantity = async (pId, newQuantity) => {
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user.email;

        const productRef = doc(firestore, 'add-to-cart', email, 'products', pId);

        try {
            await updateDoc(productRef, {
                quantity: newQuantity,
                totalPrice: price * newQuantity,
            });
            console.log('Quantity updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    //console.log(qntty,tprice);
    const plus = () => {
        setQntty(qntty + 1);
        setTprice((qntty + 1) * price);
        totalAmount = totalAmount + Number(tprice);
        console.log(qntty, tprice, price);
        updateQuantity(Id, qntty);
    }
    const minus = () => {
        setQntty(qntty - 1);
        setTprice((qntty - 1) * price);
        totalAmount = totalAmount + Number(tprice);
        console.log(qntty, tprice, price);
        updateQuantity(Id, qntty);
    }
    const deleteDocument = () => {

        const auth = getAuth();
        const firestore = getFirestore();
        const user = auth.currentUser;
        const email = user.email;


        const docRef = doc(collection(firestore, 'add-to-cart', email, 'products'), Id);
        deleteDoc(docRef)
            .then(() => {
                console.log('Document successfully deleted!');

            })
            .catch((error) => {
                console.error('Error removing document: ', error);
            });
        document.getElementById(Id).remove()
    }

    return (
        <>
            <div key={Id} id={Id} className="card" style={{ width: '100%' }}>
                <table className="table">
                    <tbody>
                        <tr>
                            <td style={{ width: '20%' }}>
                                <img src={image} height='20%' width='20%' alt="Product Image" />
                            </td>
                            <td style={{ width: '10%' }}>{name}</td>
                            <td style={{ width: '10%' }}>{price}</td>
                            <td style={{ width: '10%' }}>
                                <button className="btn btn-outline-primary" onClick={plus}>
                                    +
                                </button>
                                <p style={{marginLeft:'8px', fontSize:'20px', fontWeight:'bold'}}>{qntty}</p>
                                <button className="btn btn-outline-primary" onClick={minus}>
                                    -
                                </button>
                            </td>
                            <td style={{ width: '10%' }}>{tprice}</td>
                            <td style={{ width: '10%' }}>
                                <button
                                    type="submit"
                                    className="btn btn-outline-danger"
                                    id="delete"
                                    onClick={deleteDocument}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>


    );

}


export default Cart;