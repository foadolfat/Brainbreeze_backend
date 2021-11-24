var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const UserService = require("../services/UserService");

//user routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access user route Time: ', Date.now());
        next();
    })

    .post("/user", AuthService.encrypt, async(req, res) => {
        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);

        try{
            const { payload: message, error } = await userService.createUser(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in UserRoutes, post/user");
            res.status(500).end();
        }
        
        
    });


module.exports = router;