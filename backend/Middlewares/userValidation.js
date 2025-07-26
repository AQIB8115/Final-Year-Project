const Joi = require('joi');

const signupValidation = (req, res, next ) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(25).required(),
        department: Joi.string().min(4).max(50).required(),
        password: Joi.string().min(4).max(12).required(),
        phone: Joi.string().min(11).max(11).required(),
        studentID: Joi.string().min(4).max(4).required(),
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({mesasge: "Bad request", error})
    }
    next();
}
const loginValidation = (req, res, next ) => {
    const schema = Joi.object({
        password: Joi.string().min(4).max(12).required(),
        studentID: Joi.string().min(4).max(4).required(),
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({mesasge: "Bad request", error})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}