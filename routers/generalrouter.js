const express = require("express");
const { getproduct, postproduct, addcart, getcart, getAproduct } = require("../controllers/generalcontroller");
const { protected } = require("../middlewares/authorization");
const { enableUser, disableUser } = require("../controllers/authcontroller");

const { upload } = require("../middlewares/pictureaupload")
const router = express.Router()

router.route("/").post(upload, postproduct).get(getproduct)
router.route("/product/:id").get(getAproduct)
router.route('/cart/:productid').get(protected,addcart)
router.route('/cart').get(protected, getcart);


router.route('/users/enable/:id').post(protected, enableUser);
router.route('/users/disable/:id').post(protected, disableUser);

module.exports = router;
