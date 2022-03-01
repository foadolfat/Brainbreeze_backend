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

    .post("/api/user", AuthService.encrypt, async(req, res) => {
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
            console.log("An error occured in UserRoutes, post/user");
            res.status(500).end();
        }
        
        
    })

    .post("/api/user/signin", AuthService.authenticate, async(req, res) => {

        if(!req.auth) {
            res.status(400).json(
                {
                    message: "Invalid credentials"
                }
            );
        } else {
            res
                .status(200)
                .json(
                    {
                        auth:req.auth,
                        token:req.token,
                        user_email:req.user_email,
                        user_name:req.user_name,
                        user_type:req.user_type,
                        user_id:req.user_id
                    }
                );
        }

    })

    .get("/api/user/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.user_id = req.params.id;
        try{
            
            const { payload: user, error } = await userService.getUserById(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            user_id:user.user_id,
                            user_email:user.user_email,
                            user_name:user.user_name,
                            user_type:user.user_type
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })

    .put("/api/user/update", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.user_id = req.user_id;
        try{
            
            const { payload: message, error } = await userService.updateUser(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in userRoutes, put/user");
            res.status(500).end();
        }

    })

    .delete("/api/user/remove/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.user_id = req.user_id;
        try{
            
            const { payload: message, error } = await userService.deleteUser(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: message
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, delete/user");
            res.status(500).end();
        }

    });

module.exports = router;