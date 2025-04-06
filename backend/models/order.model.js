import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },  
    quantity:{
        type: Number,
        required: true
    }
},{
    timestamps:true
});

const Order = mongoose.model("Order",orderSchema);

export default Order;