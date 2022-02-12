var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const ModuleService = require("../services/ModuleService");

//module routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access module route Time: ', Date.now());
        next();
    })

    .post("/api/module", async(req, res) => {
        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);

        try{
            const { payload: message, error } = await moduleService.createModule(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in moduleRoutes, post/module");
            res.status(500).end();
        }
        
        
    })

    .get("/api/module/:id", async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        req.body.module_id = req.params.id;
        try{
            
            const { payload: module, error } = await moduleService.getModule(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            module_id:module.module_id,
                            module_descrip:module.module_descrip,
                            module_name:module.module_name,
                            class_id:module.class_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in moduleRoutes, get/module");
            res.status(500).end();
        }

    })


    .put("/api/module/:id", async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        req.body.module_id = req.params.id;
        try{
            
            const { payload: message, error } = await moduleService.updateModule(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in moduleRoutes, put/module");
            res.status(500).end();
        }

    })


    .delete("/api/module/:id", async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        req.body.module_id = req.params.id;
        try{
            
            const { payload: message, error } = await moduleService.deleteModule(req.body);

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
            console.log("an error occured in moduleRoutes, delete/module");
            res.status(500).end();
        }

    });

module.exports = router;