const { UserService } = require('../services') 

module.exports = {
    getUser : async (req,res, next) => {
        try{
            const user_id = req.user.id;
            const result = await UserService.getUser(user_id);
            return res.status(200).json({result})
        }catch(err){
            next(err)
        }
    }
}