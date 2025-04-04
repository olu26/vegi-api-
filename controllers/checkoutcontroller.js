const orderModel = require("../models/orderModel");
const cartmodel = require("../models/cartmodel");

const checkout = async (req, res) => {
    const user = req.user;
    
    try {
        // Get user's active cart items
        const cartItems = await cartmodel.find({ 
            addedBy: user._id, 
            active: true, 
            checkout: false 
        }).populate('product', 'productname price -_id');

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "No items in cart to checkout" });
        }

        // Create order from cart items
        const products = cartItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price
        }));

        const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

        const newOrder = new orderModel({
            userId: user._id,
            products,
            totalAmount,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();

        // Mark cart items as checked out
        await cartmodel.updateMany(
            { addedBy: user._id, active: true, checkout: false },
            { checkout: true, active: false }
        );

        res.status(201).json({ 
            message: "Checkout successful - Your order has been created",
            order: savedOrder 
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Error occurred during checkout" });
    }
};

module.exports = { checkout };
