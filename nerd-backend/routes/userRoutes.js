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

    .get("/api/user/:id", async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.id = req.params.id;
        try{
            
            const { payload: user, error } = await userService.getUser(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            id:user.id,
                            email:user.email,
                            name:user.name,
                            created_at:user.created_at
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })


    .put("/api/user/:id", async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.id = req.params.id;
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


    .delete("/api/user/:id", async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.id = req.params.id;
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