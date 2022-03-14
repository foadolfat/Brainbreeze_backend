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
    *     description: Creates a new module by instructor
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
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
    *                 type: string
    *               instructor_id:
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
    *       401:
    *         description: The user is not authorized to add a module
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *       500:
    *         description: An internal error occured
    */
    .post("/api/module/create", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {
        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
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

    /**
    * @swagger
    * /module/findById/{id}:
    *   get:
    *     tags:
    *       - Module
    *     summary: Retrieve a single module.
    *     description: Retrieve a single module by id
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the module to retrieve
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved all classes by class name.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 module_id:
    *                   type: integer
    *                   example: 1
    *                 module_name:
    *                   type: string
    *                   example: "Module 1"
    *                 module_descrip:
    *                   type: string
    *                   example: "This is the first module"
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *       400:
    *         description: The module was not retrieved.
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/module/findById/:id", async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        req.body.module_id = req.params.id;
        try{
            
            const { payload: modules, error } = await moduleService.getModule(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            module_id:modules.module_id,
                            module_descrip:modules.module_descrip,
                            module_name:modules.module_name,
                            class_id:modules.class_id,
                            instructor_id:modules.instructor_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in moduleRoutes, get/module");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /module/findByClass/{id}:
    *   get:
    *     tags:
    *       - Module
    *     summary: Retrieve all modules in a class.
    *     description: Retrieve all modules in a class by class id
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the class to retrieve modules from
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved all classes by class name.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 module_id:
    *                   type: integer
    *                   example: 1
    *                 module_name:
    *                   type: string
    *                   example: "Module 1"
    *                 module_descrip:
    *                   type: string
    *                   example: "This is the first module"
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *       400:
    *         description: The module was not retrieved.
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/module/findByClass/:id", async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: modules, error } = await moduleService.getModuleByClassId(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        modules
                    );
            }
        }catch(e){
            console.log("an error occured in moduleRoutes, get/module");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /module/update/{id}:
    *   put:
    *     tags:
    *       - Module
    *     summary: update a module
    *     description: update a module name and description by id. Make sure to pass all values even if not changed.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the module to update
    *         type: string 
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
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
    *                 type: string
    *     responses:
    *       200:
    *         description: Successfully updated a module
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: Bad Request
    *       401:
    *         description: Unauthorized
    *       403:
    *         description: no token provided
    *       500:
    *         description: An internal error occured.
    */
    .put("/api/module/update/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {

        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
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


    /**
    * @swagger
    * /module/delete/{id}:
    *   delete:
    *     tags:
    *       - Module
    *     summary: Delete a module
    *     description: Delete a module by id and token
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the module to delete
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully deleted a module
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: Bad Request
    *       401:
    *         description: Unauthorized
    *       403:
    *         description: no token provided
    *       500:
    *         description: An internal error occured.
    */
    .delete("/api/module/delete/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {
        /**
         * @type {ModuleService}
         */
        const moduleService = ServiceLocator.getService(ModuleService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
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