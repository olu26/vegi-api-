const accountmodel = require("../models/accountmodel")
const jwt = require("jsonwebtoken");



const protected = async (req, res, next) => {
    try {
        const token = req.cookies?.newapi
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decode = jwt.verify(token, process.env.SECRETPIN)
        if (!decode) {
            res.clearCookie("newapi")
            return res.status(401).json({ message: "Session expired - Please login again" })
        }
        const currentuser = await accountmodel.findById(decode.userid).select("-password");
        if (!currentuser) {
            res.clearCookie("newapi")
            return res.status(400).json({ message: "Account not found - Please login again" })
        }
        req.user = currentuser
        next();
    } catch (error) {
        console.log(error.message)
        const token = req.cookies?.newapi
        if (token) {
          res.clearCookie("newapi")
        }
        return res.status(400).json({ message: "Authentication error - Please try again" })
    }
}
const checkuser = async (req, res, next) => {
    try {
        const token = req.cookies?.newapi
        if (!token) {
            return next()
        };
        const decode = jwt.verify(token, process.env.SECRETPIN)
        if (!decode) {
       
             res.clearCookie("newapi")
            return next()
        }
        const currentuser = await accountmodel.findById(decode.userid)
        if (!currentuser) {
           res.clearCookie("newapi")
            return next()
        }
        req.user = currentuser
        next()
    } catch (error) {
        console.log(error.message)
        const token = req.cookies?.newapi
        if (token) {
           res.clearCookie("newapi")
        }
        return next()
    }
};

module.exports = { protected, checkuser }