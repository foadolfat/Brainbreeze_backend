var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const ClassService = require("../services/ClassService");

const utcStr = new Date().toUTCString();
//class routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access class route Time: ', utcStr);
        next();
    })
    /**
    * @swagger
    * /class/create:
    *   post:
    *     tags:
    *       - Class
    *     summary: Create a new class
    *     description: Create a new class by an instructor
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
    *               class_name:
    *                 type: string
    *                 example: "class-1"
    *               class_descrip:
    *                 type: string
    *                 example: "this is a class"
    *     responses:
    *       201:
    *         description: Successfully created class
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *                   example: true
    *                 class_id:
    *                   type: string
    *                 class_name:
    *                   type: string
    *                 class_descrip:
    *                   type: string
    *                 instructor_id:
    *                   type: integer
    *       400:
    *         description: Bad Request
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 error:
    *                   type: string
    *       401:
    *         description: Unauthorized
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *       403:
    *         description: no token provided
    *       500:
    *         description: An internal error occured.
    */
    .post("/api/class/create", [AuthService.verifyToken, AuthService.verifyUserType, AuthService.createUUID], async(req, res) => {
        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.id;
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
        try{
            const { payload: message, error } = await classService.createClass(req.body);
            if(error) {
                res.status(400).json(error);
            } else if(message!==true){
                res.status(500).json(message);
            }else {
                res
                    .status(201)
                    .json({
                        message: message,
                        class_id: req.body.class_id,
                        class_name: req.body.class_name,
                        class_descrip: req.body.class_descrip,
                        instructor_id: req.body.user_id
                    });
            }
        }catch(e){
            console.log("An error occured in classRoutes, post/class");
            res.status(500).end();
        }
        
        
    })

    /**
    * @swagger
    * /class/signup/{id}:
    *   post:
    *     tags:
    *       - Class
    *     summary: Sign up for a class
    *     description: Sign up for a class by student
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: id
    *         description: class id
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully signed up for class
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
    .post("/api/class/signup/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {
        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        if(req.user_type != "student") {
                res
                    .status(201)
                    .json({message: "unauthorized user type"});
            }
        try{
            const { payload: newClass, error } = await classService.getClassById(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                req.body.class_name = newClass.class_name;
                req.body.class_descrip = newClass.class_descrip;
                try{
                    const { payload: message, error } = await classService.signUp(req.body);
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
            }
        }catch(e){
            console.log("An error occured in classRoutes, post/class");
            res.status(500).end();
        }
        
        
    })

    /**

    * @swagger
    * /class/modulesAndLessons/{id}:
    *   get:
    *     tags:
    *       - Class
    *     summary: Get modules and lessons for a class
    *     description: Get modules and lessons for a class
    *     parameters:
    *       - in: path
    *         name: id
    *         description: class id
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully got modules and lessons
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                type: object
    *                properties:
    *                  module_id:
    *                    type: integer
    *                  module_name:
    *                    type: string
    *                  module_descrip:
    *                    type: string
    *                  instructor_id:
    *                    type: integer
    *                  lessons:
    *                    type: array
    *                    items:
    *                      type: object
    *                      properties:
    *                        lesson_id:
    *                          type: integer
    *                        lesson_name:
    *                          type: string
    *                        lesson_descrip:
    *                          type: string
    *                        lesson_index:
    *                          type: integer
    *       400:
    *         description: Bad Request
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/class/modulesAndLessons/:id", async(req, res) => {
        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            const { payload: results, error } = await classService.getAllModulesAndLessonsByClassId(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                r = JSON.parse(JSON.stringify(results))
                end_result = []
                try{
                    r.forEach(function(item, index) {
                        var end_result_index = end_result.findIndex(e => e.module_id === item.module_id)
                        if(end_result_index!==-1) {
                            end_result[end_result_index].lessons.push({
                                lesson_id: item.lesson_id,
                                lesson_name: item.lesson_name,
                                lesson_descrip: item.lesson_descrip,
                                lesson_index: item.lesson_index
                            })
                        } else {
                            sub_obj = {
                                module_id: item.module_id,
                                module_name: item.module_name,
                                module_descrip: item.module_descrip,
                                instructor_id: item.instructor_id,
                                lessons: [
                                    {
                                        lesson_id: item.lesson_id,
                                        lesson_name: item.lesson_name,
                                        lesson_descrip: item.lesson_descrip,
                                        lesson_index: item.lesson_index
                                    }
                                ]
                            }
                            end_result.push(sub_obj)
                        }
                    })
                }catch(e){
                    console.log("An error occured in classRoutes, get/class/modulesAndLessons when parsing results");
                    res.status(500).end();
                }
                res
                    .status(200)
                    .json(
                        end_result
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes,/api/class/modulesAndLessons/:id ");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /class/findById/{id}:
    *   get:
    *     tags:
    *       - Class
    *     summary: Retrieve a single class.
    *     description: Retrieve a single class by class id.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: UUID of class
    *         type: integer
    *     responses:
    *       200:
    *         description: Retrieved a single class by class id.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *                 class_name:
    *                   type: string
    *                   example: "class-1"
    *                 class_descrip:
    *                   type: string
    *                   example: "this is a class"
    *       400:
    *         description: The class was not retrieved.
    *       401:
    *         description: The class was not retrieved because the user is not authorized
    *       403:
    *         description: The class was not retrieved because no token was provided in header
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/class/findById/:id", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: result, error } = await classService.getClassById(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            class_id:result.class_id,
                            class_name:result.class_name,
                            class_descrip:result.class_descrip
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /class/findByName/{name}:
    *   get:
    *     tags:
    *       - Class
    *     summary: Retrieve classes by name.
    *     description: Retrieve all classes by class name.
    *     parameters:
    *       - in: path
    *         name: name
    *         required: true
    *         description: name of class
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved all classes by class name.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *                 class_name:
    *                   type: string
    *                   example: "class-1"
    *                 class_descrip:
    *                   type: string
    *                   example: "this is a class"
    *       400:
    *         description: The class was not retrieved.
    *       401:
    *         description: The class was not retrieved because the user is not authorized
    *       403:
    *         description: The class was not retrieved because no token was provided in header
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/class/findByName/:name", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_name = req.params.name;
        try{
            
            const { payload: result, error } = await classService.getClassByName(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        result
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /class/findByUser/{id}:
    *   get:
    *     tags:
    *       - Class
    *     summary: Retrieve all classes for user
    *     description: Retrieve all classes by user id.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of user
    *         type: string 
    *       - in: header
    *         name: token
    *         required: true
    *         description: auth token
    *         type: string
    *     responses:
    *       200:
    *         description: Retrieved all classes by class name.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *                 class_name:
    *                   type: string
    *                   example: "class-1"
    *                 class_descrip:
    *                   type: string
    *                   example: "this is a class"
    *       400:
    *         description: The class was not retrieved.
    *       401:
    *         description: The class was not retrieved because the user is not authorized
    *       403:
    *         description: The class was not retrieved because no token was provided in header
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/class/findByUser/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.user_id = req.params.id;
        try{
            
            const { payload: result, error } = await classService.getAllClassesByUser(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        result
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })

        /**
    * @swagger
    * /class/findRoster/{id}:
    *   get:
    *     tags:
    *       - Class
    *     summary: Retrieve roster of class
    *     description: Retrieve roster of class using class id. No authentication required.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of class
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved all classes by class name.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 class_id:
    *                   type: string
    *                   example: "a2c77990-6baa-4fee-bc5a-0396dbd791d4"
    *                 class_name:
    *                   type: string
    *                   example: "class-1"
    *                 class_descrip:
    *                   type: string
    *                   example: "this is a class"
    *       400:
    *         description: The class was not retrieved.
    *       401:
    *         description: The class was not retrieved because the user is not authorized
    *       403:
    *         description: The class was not retrieved because no token was provided in header
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/class/findRoster/:id", async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        req.body.class_id = req.params.id;
        try{
            
            const { payload: result, error } = await classService.getRoster(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        result
                    );
            }
        }catch(e){
            console.log("an error occured in userRoutes, get/user");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /class/update/{id}:
    *   put:
    *     tags:
    *       - Class
    *     summary: Update a single class.
    *     description: Update a single class name and description by instructor id.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: UUID of the class to update.
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
    *               class_name:
    *                 type: string
    *                 example: "class-1"
    *               class_descrip:
    *                 type: string
    *                 example: "this is a class"
    *     responses:
    *       200:
    *         description: The class was updated.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The class was not updated
    *       401:
    *         description: The class was not updated because the user is not authorized
    *       403:
    *         description: The class was not updated because no token was provided in header
    *       500:
    *         description: An internal error occured
    */
    .put("/api/class/update/:id", AuthService.verifyToken, async(req, res) => {

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


    /**
    * @swagger
    * /class/delete/{id}:
    *   delete:
    *     tags:
    *       - Class
    *     summary: Delete a single class.
    *     description: Delete a single class by instructor, by sending the class id in url and auth token.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: UUID of the class to be deleted.
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: The class was deleted.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The class was not deleted from the database
    *       401:
    *         description: The class was not deleted because the user is not authorized
    *       403:
    *         description: The class was not deleted because no token was provided in header
    *       500:
    *         description: An internal error occured
    */
    .delete("/api/class/delete/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        if(req.user_type != "instructor") {
                res
                    .status(201)
                    .json({message: "unauthorized user type"});
            }
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

    })

    /**
    * @swagger
    * /class/drop/{id}:
    *   delete:
    *     tags:
    *       - Class
    *     summary: drop a single class.
    *     description: drop a single class by student, by sending the class id in url and auth token.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: UUID of the class to be dropped.
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: The class was dropped.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The class was not dropped from the database
    *       401:
    *         description: The class was not dropped because the user is not authorized
    *       403:
    *         description: The class was not dropped because no token was provided in header
    *       500:
    *         description: An internal error occured
    */
    .delete("/api/class/drop/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {

        /**
         * @type {ClassService}
         */
        const classService = ServiceLocator.getService(ClassService.name);
        if(req.user_type != "student") {
                res
                    .status(201)
                    .json({message: "unauthorized user type"});
            }
        req.body.class_id = req.params.id;
        try{
            
            const { payload: message, error } = await classService.dropClass(req.body);

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