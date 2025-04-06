import { useEffect, useState } from "react";
import "./OrderManaging.css";

const OrderManaging = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
   
      if (data.success) {
        
        setOrders(data.data);
      } else {
        alert("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order-managing-container">
      <h2 className="order-managing-title">Admin: Manage Orders</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
                <tr key={order._id}>
  <td data-label="#"> {index + 1} </td>
  <td data-label="Product Name">{order.productName}</td>
  <td data-label="Image">
    <img
      src={order.imgUrl}
      alt="Product"
      className="order-image"
    />
  </td>
  <td data-label="Price">${order.price}</td>
  <td data-label="Quantity">{order.quantity}</td>
  <td data-label="Total">${order.price * order.quantity}</td>
</tr>

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManaging;
