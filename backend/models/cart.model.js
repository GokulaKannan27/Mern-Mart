import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productId:String,
    productName: String,
    imgUrl: String,
    price: Number,
    category: String,
    quantity:{
        type:Number,
        default:1
    }
},
{
    timestamps:true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;