const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
  
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    token: {
        type: String,
        
       
    },
    tokenExpiresIn: {
        type: Date
    },
    otpverify: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

 userschema.pre("save", async function (next) {
      if (this.isModified("password")) {
          const salt = await bcrypt.genSalt(10)
          this.password = await bcrypt.hash(this.password, salt)
     }
     next()
});

module.exports = mongoose.model("User", userschema)