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
    /**
    * @swagger
    * /module/create:
    *   post:
    *     tags:
    *       - Module
    *     summary: Adds a new module to the database
    *     description: Creates a new module in the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               module_name:
    *                 type: string
    *               module_descrip:
    *                 type: string
    *               class_id:
    *                 type: integer
    *     responses:
    *       201:
    *         description: The module was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The module was not added to the database
    *       500:
    *         description: An internal error occured
    */
    .post("/api/module/create", async(req, res) => {
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


    .put("/api/module/update/:id", async(req, res) => {

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


    .delete("/api/module/delete/:id", async(req, res) => {

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