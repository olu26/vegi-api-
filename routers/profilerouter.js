const express = require("express");
const { protected } = require("../middlewares/authorization")
const {changepasswords, updateprofiles} = require('../controllers/profilecontroller')
const router = express.Router()

router.route('/changepassword').post(protected, changepasswords)
router.route("/updateprofile").post(protected, updateprofiles)

module.exports = router