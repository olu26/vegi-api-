const accountmodel = require("../models/accountmodel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { mailsending, generateToken } = require("../middlewares/emailmiddleware")
const { changepassword, updateprofile } = require("../middlewares/validate")

const changepasswords = async (req, res) => {
    const user = req.user
    try {
        const { error } = changepassword(req.body)
        if (!error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { password, newpassword, confirmpassword } = req.body;
        const account = await accountmodel.findById(user._id);
        if (!account) {
            return res.status(400).json({ message: "Error Occured no user found " })
        }

        const ismatch = bcrypt.compare(password, account.password)
        if (!ismatch) {
            return res.status(400).json({ message: "Password Mismatch" })
        }
        if (newpassword !== confirmpassword) {
            return res.status(400).json({ message: "newpassword/confirmpassword mismatch" })
        }
        account.password = newpassword
        await account.save()
        const options = {
            to: user.email,
            from: "do-no-sendback@gmail.com",
            subject: "passored Changed",
            message: "your password has been changed enter your new password "
        }
        await mailsending(options)
        res.status(200).json({ message: "password changed successful" })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Error Occured !!" })
    }
}
const updateprofiles = async (req, res) => {
    const user = req.user
    try {
        const { error } = updateprofile(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { firstname, lastname } = req.body;
        const account = await accountmodel.findByIdAndUpdate(user._id, { firstname, lastname })
        if (!account) {
            return res.status(400).json({ message: "No User Found!!" })
        }
        res.status(200).json({ message: "profile date have been changed " })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Error Occured!!" })
    }
}
module.exports ={changepasswords,updateprofiles}