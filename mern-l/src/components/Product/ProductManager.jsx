import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManager.css'; // Optional styling

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productName: '', imgUrl: '', price: '', description: '', category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          const processed = productData(res.data.data);
          console.log(processed);
          setProducts(processed);
   
        } else {
          console.error("API response is not an array:", res.data);
          setProducts([]);
        }
      })
      .catch(err => console.error("Fetch Error:", err));
  };

  const productData = (productArray) => {
    if (Array.isArray(productArray)) {
      return productArray.map(({ _id, productName, imgUrl, price, description, category }) => ({
        _id, productName, imgUrl, price, description, category
      }));
    } else {
      console.error("productData was not called with an array:", productArray);
      return [];
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { productName, imgUrl, price, category, description } = formData;

    try {
      if (editId) {
        // Update
        const response = await fetch(`http://localhost:5000/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName:productName, imgUrl, price, category, description }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Product updated successfully!");
          fetchProducts();
          resetForm();
        } else {
          alert(data.message || "Failed to update product.");
        }
      } else {
        // Add
        const response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: productName,  imgUrl, price, category, description }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Product added successfully!");
          fetchProducts();
          resetForm();
        } else {
          alert(data.message || "Failed to add product.");
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      imgUrl: product.imgUrl,
      price: product.price,
      description: product.description,
      category: product.category
    });
    setEditId(product._id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => fetchProducts())
      .catch(err => console.error("Delete Error:", err));
  };

  const resetForm = () => {
    setFormData({ productName: '', imgUrl: '' , price: '', description: '', category: '' });
    setEditId(null);
  };

  return (
    <div className="product-manager">
      <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />
        <input type='text' name='imgUrl' placeholder='Image Url' value={formData.imgUrl} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type='text' name='category' placeholder='Category' value={formData.category} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <h3>Product List</h3>
      <div className='table-wrapper' >
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td data-label="Image">
  <img
    src={p.imgUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")}
    alt="Product"
    style={{
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px'
    }}
  />
</td>


              <td>{p.productName}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ProductManager;
