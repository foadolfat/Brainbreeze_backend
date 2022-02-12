var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const ClassService = require("../services/ClassService");

//class routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access class route Time: ', Date.now());
        next();
    })

    .post("/api/class", async(req, res) => {
        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);

        try{
            const { payload: message, error } = await classService.createClass(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in classRoutes, post/class");
            res.status(500).end();
        }
        
        
    })

    .get("/api/class/:id", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: result, error } = await classService.getClass(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            class_id:result.class_id,
                            class_name:result.class_name,
                            class_descrip:result.class_descrip,
                            user_class:result.user_class
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })


    .put("/api/class/:id", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: message, error } = await classService.updateClass(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in classRoutes, put/class");
            res.status(500).end();
        }

    })


    .delete("/api/class/:id", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: message, error } = await classService.deleteClass(req.body);

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
            console.log("an error occured in classRoutes, delete/class");
            res.status(500).end();
        }

    });

module.exports = router;