const productmodel = require("../models/productmodel")
const cartmodel = require("../models/cartmodel")
const { generateSku } = require("../middlewares/emailmiddleware")

const postproduct = async (req, res) => {
    const images = req.imagefiles
    const user = req.user
 
    try {
        const { productname, price, category, description, stock, } = req.body
    
        await productmodel.create({
            productname: productname,
            price: price,
            category: category,
            description: description,
            stock: stock,
            images: images,
            displayimage: images[0],
      
        })
        res.status(201).json({ message: "product created successful" })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Error Occured !!" })
    }
}
const getproduct = async (req, res) => {
    try {
        const allproduct = await productmodel.find().sort({ createdAt: -1 })
        res.status(200).json({ message: "Successful", allproduct })
    } catch (error) {
        console.log(error.message)
        return res.staus(400).json({ message: "Error Occured!!" })
    }
}

const getAproduct = async( req,res) =>{
    try {
        const productid = req.params.id
        const aproduct = await productmodel.findById(productid)
        if(!aproduct){
          return res.status(400).json({message:"no product found"})
        }
        res.status(200).json({
          data:aproduct
        })
    } catch (error) {
         console.log(error.message)
         return res.status(400).json({message:"Error Occured !"})
    }
}
const addcart = async (req, res) => {
    const user = req.user
    try {
        const productid = req.params?.productid
        if (!productid) {
            return res.status(400), json({ message: "Bad Request" })
        };
        const product = await productmodel.findOne({ _id: productid })
        if (!product) {
            return res.status(400).json({ message: "No Product Found!!" })
        };
        let price = product.price;
        if (req.query?.quantity) {
            price = product.price * req.query?.quantity
        };
        await cartmodel.create({
            product: product._id,
            price: price,
            quantity: req.query?.quantity,
            addedBy: user._id
        })
        res.status(200).json({ message: "Product have been saved to cart" })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Error Occured !!" })
    }
}
const getcart = async (req, res) => {
    const user = req.user
    try {
        const allcart = await cartmodel.find({ addedBy:user._id,  active: true, checkout: false })
        res.status(200).json({ message: "successful", allcart })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Error Occured here !!", })
    }
};
module.exports ={getproduct,postproduct,addcart,getcart,getAproduct}