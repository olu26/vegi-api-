

const Joi = require("joi");

const validateregistar = (data) => {
     const registarschema = Joi.object({
          firstname: Joi.string().required(),
          lastname: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(8),
          address:Joi.string().required()
     })
     return registarschema.validate(data)
}
const loginvalidate = (data) => {
     const loginschema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
     })
     return loginschema.validate(data)
}
const productvalidate = (data) => {
     const productschema = Joi.object({
          productname: Joi.string().required(),
          price: Joi.number().required(),
          category: Joi.string().required(),
          stock: Joi.number().required(),
          description: Joi.string().required(),
     })
     return productschema.validate(data)
}

const forgetpassword = (data) => {
     const forgetpasswordschema = Joi.object({
          email: Joi.string().email().required(),
     })
     return forgetpasswordschema.validate(data)
}
const otpverify = (data) => {
     const verifyschema = Joi.object({
          otp: Joi.string().required(),
     })
     return verifyschema.validate(data)
}
const resetpassword = (data) => {
     const resetschema = Joi.object({
          newpassword: Joi.string().required(),
          confirmpassword: Joi.string()
     })
     return resetschema.validate(data)
}
const changepassword = (data) => {
     const changepassword = Joi.object({
          password: Joi.string().required(),
          newpassword: Joi.string().required(),
          confirmpassword: Joi.string().required()
     })
     return changepassword.validate(data)
}

const updateprofile = (data) => {
     const updateprofile = Joi.object({
          firstname: Joi.string().required(),
          lastname: Joi.string().required(),
           phoneumber:Joi.string().required()
     })
     return updateprofile.validate(data)
}


module.exports = {validateregistar,loginvalidate,productvalidate,forgetpassword,otpverify,resetpassword,changepassword,updateprofile}