import "./Navbar.css"
import { FaHome, FaInfoCircle, FaEnvelope, FaCog } from 'react-icons/fa';
import { useNavigate } from "react-router";

const Navbar = () => {
    const navigate = useNavigate();
    const handleProduct = ()=>{
        navigate('/pchart');
    }
    const handleUser = ()=>{
        navigate("/user");
    }
    const handleProductManager = () =>{
        navigate('/manager');
    }
    const handleOrderManager = () =>{
        navigate('/order');
    }
    return (
        <nav>
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li><a onClick={handleProductManager} >Product</a></li>
                    <li><a onClick={handleOrderManager}  >Orders</a></li>
                    <li><a onClick={handleUser} >Customers</a></li>
                    <li><a onClick={handleOrderManager} >Settings</a></li>
                    <li><a onClick={handleProduct} >Analytics</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;