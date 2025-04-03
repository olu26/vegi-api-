const express = require("express");
const { getproduct, postproduct, addcart, getcart, getAproduct } = require("../controllers/generalcontroller");
const { protected } = require("../middlewares/authorization");
const { updateOrderStatus, createOrder } = require("../controllers/ordercontroller");
const { enableUser, disableUser } = require("../controllers/authcontroller");
const { checkoutOrder } = require("../controllers/checkoutcontroller"); 

const { upload } = require("../middlewares/pictureaupload")
const router = express.Router()

router.route("/").post(upload, postproduct).get(getproduct)
router.route("/product/:id").get(getAproduct)
router.route('/cart/:productid').post(protected, addcart)
router.route('/cart').get(protected, getcart);

router.route('/users/enable/:id').post(protected, enableUser);
router.route('/users/disable/:id').post(protected, disableUser);

router.route('/orders/:id/status').put(protected, updateOrderStatus);
router.route('/orders').post(protected, createOrder); 
router.route('/checkout/:id').post(protected, checkoutOrder); 

module.exports = router;
