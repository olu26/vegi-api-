const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sku: {
        type: String,

    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true

    },
    images: [{
        type: String,
        required: true
    }],
    displayimage: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model("Products", productschema)