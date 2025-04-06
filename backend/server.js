import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";
import Cart from "./models/cart.model.js";
import Order from "./models/order.model.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

const app = express();
app.use(express.json());

const corsOptions = {
    origin:["http://localhost:3000" , "http://localhost:5173"]
};

app.use(cors(corsOptions));
connectDB();

//product.model.js queries  
app.post("/api/products",async (req,res)=>{
    const product = req.body;

    if(!product.productName || !product.imgUrl){
        return res.status(400).json({ success:false, message: "Please provide all fields"});
    }
    const newProduct = new Product(product)
    try{
        await newProduct.save();
        res.status(201).json({success:true, data:newProduct});
    }catch(error){
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error "});

    }
});

app.put("/api/products/:id",async(req,res)=>{
    const { id } = req.params;

    const product = req.body;

    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        res.status(200).json({success:true, data:updatedProduct});
    }catch(error){
        res.status(500).json({success:false, message:"Server Error"});
    }
});

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully", data: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.get("/api/products", async (req,res) =>{
    try{
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products});
    }
    catch(error){
        console.error("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
});



//user.model.queries

app.post("/api/signup",async (req,res)=>{
    const user = req.body;

    if(!user.email || !user.password){
        return res.status(400).json({ success:false, message: "Please provide all fields"});
    }

    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password,saltRounds);
        user.password = hashedPassword;
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({success:true, data:newUser});
    }catch(error){
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error "});

    }
});

app.post("/api/login", async(req,res)=>{
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Find user by email
        const existingUser = await User.findOne({ email: user.email }).populate("cart.productId");
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(user.password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: existingUser._id }, "2dcf16d72b83d44f1900e716d81da3249843b814ebee9413970add52bd19472e", { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "Login successful",token, cart:existingUser.cart , user: existingUser });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//cart

// Add product to cart
app.post("/api/cart", async (req, res) => {
    try {
      const {  productName, imgUrl, price, category, quantity } = req.body;
      
      const newCartItem = new Cart({
        productName,
        imgUrl,
        price,
        category,
        quantity,
      });
  
      await newCartItem.save();
      res.status(201).json({ message: "Product added to cart successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

app.get("/api/use", async(req,res) =>{
    try{
        const user = await User.find({});
        res.json(user);
    }
    catch(error){
        console.error("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
});
 
// Get all cart items
app.get("/api/cart", async (req, res) => {
    try {
      const cartItems = await Cart.find();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

app.delete("/api/cart/:id", async (req, res) => {
    try {
        const { id } = req.params;


        // Find and remove product from the cart collection in MongoDB
        const deletedCartItem = await Cart.findByIdAndDelete(id);

        if (!deletedCartItem) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        } 

        res.status(200).json({ success: true, message: "Product removed from cart", data: deletedCartItem });
    } catch (error) {
        console.error("Error deleting product from cart:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//order queries
app.post("/api/order",async (req, res) =>{
    const order = req.body;

    if(!order.productName || !order.imgUrl || !order.price || !order.quantity){
        return res.status(400).json({ success:false, message: "Please provide all fields"});
    }
    const newOrder = new Order(order)
    try{
        await newOrder.save();
        res.status(201).json({success:true, data:newOrder});
    }catch(error){
        console.error("Error in creating ordert:", error.message);
        res.status(500).json({ success: false, message: "Server Error "});

    }
    
});

app.get("/api/orders", async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

app.listen(5000, ()=>{
    console.log("Server started at http://localhost:5000")
})