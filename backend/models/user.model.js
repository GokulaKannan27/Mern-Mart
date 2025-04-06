import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            qty: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;