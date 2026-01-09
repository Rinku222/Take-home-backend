const Joi = require("joi");

module.exports = {
    user: (data) => {
        return Joi.object({
            email: Joi.string().email()
                .when('isEdit', { is: true, then: Joi.optional(), otherwise: Joi.required() })
                .error(new Error('Invalid Email')).required(),
            password: Joi.string().min(4).max(40)
                .when('isEdit', { is: true, then: Joi.optional(), otherwise: Joi.required() }),
            confirmPassword: Joi.string().min(4).max(40)
                .when('isEdit', { is: true, then: Joi.optional(), otherwise: Joi.required().valid(Joi.ref('password')) }),
            name: Joi.string()
                .when('isEdit', { is: true, then: Joi.optional(), otherwise: Joi.required() })
        }).validate(data);
    },
    login: (data) => {
        return Joi.object({
            email: Joi.string().email().required()
                .error(new Error('Invalid Email')),
            password: Joi.string().min(4).max(40).required(),
        }).validate(data)
    }
};
