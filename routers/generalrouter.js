const express = require("express");
const { getproduct, postproduct, addcart, getcart, deleteCartItem } = require("../controllers/generalcontroller");
const { checkout } = require("../controllers/checkoutcontroller");
const { protected } = require("../middlewares/authorization");
const router = express.Router();

router.get("/product", getproduct);
router.post("/product", protected, postproduct);
router.post("/cart/:productid", protected, addcart);
router.get("/cart", protected, getcart);
router.delete("/deletecart/:cartItemId", deleteCartItem);
router.post("/checkout", protected, checkout);

module.exports = router;
