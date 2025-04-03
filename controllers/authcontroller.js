const  { validateregistar,loginvalidate } = require('../middlewares/validate')
const accountmodel = require("../models/accountmodel")
const { mailsending, generateToken } = require("../middlewares/emailmiddleware")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {forgetpassword,resetpassword,otpverify} = require("../middlewares/validate")
const registar = async (req, res) => {
    try {
        const { error } = validateregistar(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { firstname, lastname, email, password,address, role} = req.body
        const checkEmail = await accountmodel.findOne({ email: email })
        if (checkEmail) {
            return res.status(201).json({ message: "Email Already In Use" })
        }
        const newregistar = new accountmodel({
            firstname,
            lastname,
            email,
            password,
            address,
        
        })
        await newregistar.save()
        await accountmodel.create({ firstname,lastname, email, password,address })
     
        res.status(201).json({ message: "Registration  successfully" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "An Error Occurred !!" })
    }
};
 
const login = async (req, res) => {
    try {
        const { error } = loginvalidate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body
        const checkEmail = await accountmodel.findOne({ email: email })
        if (!checkEmail) {
            return res.status(400).json({ message: "invalid email or password" })
        }
         const isMatchPassword = await bcrypt.compare(password, checkEmail.password);
         if (!isMatchPassword) {
             return res.status(400).json({ message: "invalid email or password" })
        }
    
        const token = jwt.sign({ userid: checkEmail._id },process.env.SECRETPIN, {expiresIn: "6h" });
    

        res.cookie("newapi", token, { httpOnly:true, expiresIn: 21490000 })
        const data = await accountmodel.findOne({email:email})
  
        const userData = data.toObject(); // Convert to plain object
        delete userData.password; // Exclude password
        res.status(201).json({ message: "user login successfully", token, user: userData })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error Occurred !!" })
    }
}

const forgetpasswords = async (req, res) => {
    try {
        const { error } = forgetpassword(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { email } = req.body
        const account = await accountmodel.findOne({ email:email })
        if (!account) {
            return res.status(400).json({ message: "Email Mismatch" })
        }
        const date = new Date()
        date.setMinutes(date.getMinutes() + 15);

        const token = await generateToken();

        const options = {
            from: process.env.EMAILADDRESS,
            to: req.body,
            subject: "password reset",
            message: "please an otp pin has been sent to you it will expires in 20 minutes",
        }

        
          await  mailsending(options)
        console.log(options)
        account.token = token,
            account.tokenExpiresIn = date
        await account.save();
        res.status(200).json({ message: "Email sent succesfully" })
        console.log(account)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error Occurred !!" })
    }
}



const verifyotps = async (req, res) => {

    try {
        const { error } = otpverify(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { otp } = req.body;
        const account = await accountmodel.findOne({ token: otp })
        if (!account) {
            return res.status(400).json({ message: "invalid otp" })
        }
        if (new Date() > account.tokenExpiresIn) {
                account.token = null,
                account.tokenExpiresIn = null
            return res.status(400).json({ message: "Bad request" })
        }
               account.otpverify = true,
            await account.save()
        res.status(200).json({ message: "Otp verified Successful" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error Occurred !!" })
    }

}
const resetpasswords = async (req, res) => {
    try {
        const { error } = resetpassword(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { newpassword, confirmpassword } = req.body;
        const account = await accountmodel.findOne({ token: otp })
        if (!account) {
            return res.status(400).json({ message: "invalid user" })
        }
        if (newpassword !== confirmpassword) {
            return res.status(400).json({ message: "password mismatch" })
        }
        if (new Date() > account.tokenExpiresIn) {
            account.token = null
            account.tokenExpiresIn = null
            return res.status(400).json({ message: "OTP has expired" })
        }
        if (account.otpverify !== true) {
            return res.status(400).json({ message: "otp has not been verified" })
        }
        account.password = newpassword;
        account.token = null;
        account.otpverify = false
        account.tokenExpiresIn = null;
        await account.save();

        const options = {
            email: account.email,
            from: "do-not-reply@gmail.com",
            message: "your password has been changed",
            subject: "password changed",

        }
        await mailsending(options)
        return res.status(200).json({ message: "password changed successfully" })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error Occurred !!" })
    }
}

// routers for managing users as an admin
const enableUser = async (req, res) => {
    const user = req.user;

    if(user.role !== "admin"){
        return res.status(400).json({message:"unauthorized login"})
    }
    try {
        const userId = req.params.id;
        const updatedUser = await accountmodel.findByIdAndUpdate(userId, { isActive: true }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User enabled successfully", data: updatedUser });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error occurred while enabling user" });
    }
}

const disableUser = async (req, res) => {
    const user = req.user;

    if(user.role !== "admin"){
        return res.status(400).json({message:"unauthorized login"})
    }
    try {
        const userId = req.params.id;
        const updatedUser = await accountmodel.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User disabled successfully", data: updatedUser });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error occurred while disabling user" });
    }
}

const getallusers = async (req, res) => {
    const user = req.user;

    if(user.role !== "admin"){
        return res.status(400).json({message:"unauhorize login"})
    }
    try {
       const alluserinformation = await accountmodel.find()
         res.json({
            message:"all users available",
            total :alluserinformation.length-1,
            data :alluserinformation
         })
    } catch (error) {
        res.send("an Error Occured while performing this operations")
        console.log(error.message)
        return res.status(500).json({ message: "Error Occurred !!" })
    }
 }
  const getaUser = async(req,res) =>{
    const user = req.user;

    if(user.role !== "admin"){
        return res.status(400).json({message:"unauthorize  login Amin Route"})
    }
    try {
         const aUser = await accountmodel.findById(req.params.id)
         if(!aUser){
            return res.status(404).json({message:"no user found"})
         }

         res.status(200).json({data:aUser})
    } catch ( error) {
         console.log(error.message)
         return res.status(500).json({message:"Error Occured !!"})
    }
  }

   const updateUserRole  = async (req, res) => {
    const user = req.user;

    if(user.role !== "admin"){
        return res.status(400).json({message:"unauhorize login"})
    }
    try {
      const { username, password, role } = req.body;
        const user = await accountmodel.findByIdAndUpdate(req.params.id, { username, password, role }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({user , message:"successfuly updated user role"});
    } catch (error) {
        return res.status(500).send('Error updating user');
    }
}


module.exports = {
    registar,
    login,
    forgetpasswords,
    verifyotps,
    resetpasswords,
    getallusers,
    getaUser,
    updateUserRole,
    enableUser,
    disableUser
}
