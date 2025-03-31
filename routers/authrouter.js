const express = require("express")
const {protected,checkuser} = require("../middlewares/authorization")
const { registar,login ,forgetpasswords,verifyotps,resetpasswords,getallusers ,getaUser, updateUserRole} = require("../controllers/authcontroller")
const router = express.Router();


router.route('/registar').post(registar)
router.route("/login").post(login)
// router.route("/adminlogin").post(adminlogin)
router.route("/users").get(protected,getallusers)
router.route("/users/:id").get(protected,getaUser)
router.route("/users/:id").patch(protected,updateUserRole)
router.route("/forgetpasswords").post(forgetpasswords)
router.route("/verifyotps").post(verifyotps)
router.route("/resetpassword").post(resetpasswords)


module.exports = router