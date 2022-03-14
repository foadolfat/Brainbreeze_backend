var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const LessonService = require("../services/LessonService");

//lesson routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access lesson route Time: ', Date.now());
        next();
    })

    /**
    * @swagger
    * /lesson/create:
    *   post:
    *     tags:
    *       - Lesson
    *     summary: Adds a new lesson to the database
    *     description: Creates a new lesson by instructor
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
    *               module_id:
    *                 type: integer
    *               lesson_name:
    *                 type: string
    *               lesson_descrip:
    *                 type: string
    *               lesson_index:
    *                 type: integer
    *     responses:
    *       201:
    *         description: The lesson was added to the database
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
    *         description: The user is not authorized to add a lesson
    *       500:
    *         description: An internal error occured
    */
    .post("/api/lesson/create", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {
        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
        try{
            const { payload: message, error } = await lessonService.createLesson(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in lessonRoutes, post/lesson");
            res.status(500).end();
        }
        
        
    })

    /**
    * @swagger
    * /lesson/findById/{id}:
    *   get:
    *     tags:
    *       - Lesson
    *     summary: Retrieve a single lesson.
    *     description: Retrieve a single lesson by id
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the lesson to retrieve
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved lesson by id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 lesson_id:
    *                   type: integer
    *                 lesson_name:
    *                   type: string
    *                 lesson_descrip:
    *                   type: string
    *                 lesson_index:
    *                   type: integer
    *                 module_id:
    *                   type: integer
    *       400:
    *         description: The module was not retrieved.
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/lesson/findById/:id", async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        req.body.lesson_id = req.params.id;
        try{
            
            const { payload: lesson, error } = await lessonService.getLessonById(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            lesson_id:lesson.lesson_id,
                            lesson_name:lesson.lesson_name,
                            lesson_descrip:lesson.lesson_descrip,
                            lesson_index:lesson.lesson_index,
                            module_id:lesson.module_id,
                            instructor_id:lesson.instructor_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in lessonRoutes, get/lesson");
            res.status(500).end();
        }

    })

/**
    * @swagger
    * /lesson/findByModule/{id}:
    *   get:
    *     tags:
    *       - Lesson
    *     summary: Retrieve a list of lessons by module id.
    *     description: Retrieve a list of lessons by module id.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the lesson to retrieve
    *         type: string 
    *     responses:
    *       200:
    *         description: Retrieved all lessons by module id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 lesson_id:
    *                   type: integer
    *                 lesson_name:
    *                   type: string
    *                 lesson_descrip:
    *                   type: string
    *                 lesson_index:
    *                   type: integer
    *                 module_id:
    *                   type: integer
    *       400:
    *         description: The module was not retrieved.
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/lesson/findByModule/:id", async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        req.body.module_id = req.params.id;
        try{
            
            const { payload: lesson, error } = await lessonService.getLessonByModule(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        lesson
                    );
            }
        }catch(e){
            console.log("an error occured in lessonRoutes, get/lesson");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /lesson/update/{id}:
    *   put:
    *     tags:
    *       - Lesson
    *     summary: update a lesson
    *     description: update a lesson name, description, and index by id by instructor
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the lesson to update
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
    *               lesson_name:
    *                 type: string
    *               lesson_descrip:
    *                 type: string
    *               lesson_index:
    *                 type: integer
    *               module_id:
    *                 type: integer
    *     responses:
    *       200:
    *         description: Successfully updated a lesson
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
    .put("/api/lesson/update/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
        req.body.lesson_id = req.params.id;
        try{
            
            const { payload: message, error } = await lessonService.updateLesson(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in lessonRoutes, put/lesson");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /lesson/delete/{id}:
    *   delete:
    *     tags:
    *       - Lesson
    *     summary: Delete a lesson
    *     description: Delete a lesson by id and token
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: id
    *         required: true
    *         description: id of the lesson to delete
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully deleted a lesson
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
    .delete("/api/lesson/delete/:id", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        if(req.user_type != "instructor") {
                res
                    .status(401)
                    .json({message: "unauthorized user type"});
            }
        req.body.lesson_id = req.params.id;
        try{
            
            const { payload: message, error } = await lessonService.deleteLesson(req.body);

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
            console.log("an error occured in lessonRoutes, delete/lesson");
            res.status(500).end();
        }

    });

module.exports = router;