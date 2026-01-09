const authService = require("../services/auth.service.js");
const { authValidator } = require("../validator/index.js")
const { CommonFun , PasswordFun} = require('../utils/index.js')

module.exports = {
    register : async(req,res,next) => {
        try {
            let body = req.body;
            body = await CommonFun.removeNullValFromObj(body)
            const { value, error } =  await authValidator.user(body)

            if (error) {
            return res.status(400).json({
                result: {
                    status: false,
                    message: error.details ? error.details[0].message : error.message || "Validation error"
                }
            });
}
            body.password = await PasswordFun.hashPassword(body.password);
            delete body.confirmPassword;

            let result = await authService.register(body);
            if(!result.status) {
                return res.status(400).json({result})
            }
            return res.status(200).json({result})

        }catch(err) {
            next(err);
        }
    },

    login : async(req,res,next) => {
        try{
            let body = req.body;
            body = await CommonFun.removeNullValFromObj(body)
            const { value, error } =  await authValidator.login(body);
            if (error) {
                return res.status(400).json({
                result: {
                    status: false,
                    message: error.details ? error.details[0].message : error.message || "Validation error"
                }
            })};

            let result = await authService.login(body);
            if(!result.status) {
                return res.status(400).json({result})
            }
            return res.status(200).json({result})


        }catch(err){
            next(err)
        }
    }
}