const orderModel = require("../models/orderModel");

// Checkout function
const checkoutOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order status to checked out
        order.checkout = true;
        await order.save();

        res.status(200).json({ message: "Order checked out successfully", data: order });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Error occurred during checkout" });
    }
};

module.exports = {
    checkoutOrder,
};
