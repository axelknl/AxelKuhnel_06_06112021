const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(8).required().trim()
})

exports.checkUser = (req, res, next) => {
    if (userSchema.validate(req.body).error) {
        res.status(422).json({error : 'Email ou mot de passe non valide'})
    }
    else {
        next();
    }
};

const sauceSchema = Joi.object({
    userId : Joi.string().length(24).required(),
    name : Joi.string().min(1).required().trim(),
    manufacturer : Joi.string().min(1).trim().required(),
    description : Joi.string().min(1).trim().required(),
    mainPepper : Joi.string().min(1).trim().required(),
    heat : Joi.number().integer().min(1).max(10).required()
})

exports.checkSauce = (req, res, next) => {
    let sauce = null;
    if (typeof req.body.sauce === 'undefined') {
        sauce = req.body;
    } else {
        sauce = JSON.parse(req.body.sauce);
    }
    if (sauceSchema.validate(sauce).error) {
        res.status(422).json({error : 'Un des champs fournis est non valide'})
    }
    else {
        next();
    }
};