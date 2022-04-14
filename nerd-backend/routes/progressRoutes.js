var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const ProgressService = require("../services/ProgressService");
const LessonService = require("../services/LessonService");
const UnitService = require("../services/UnitService");

const utcStr = new Date().toUTCString();
//progress routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access progress route Time: ', utcStr);
        next();
    })

    /**
    * @swagger
    * /progress/create:
    *   post:
    *     tags:
    *       - Progress
    *     summary: Add new progress tracker
    *     description: Create new progress tracker tied to user, class, module, lesson and unit. Any entry means the user has completed the lesson.
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
    *               unit_id:
    *                 type: integer
    *               instructor_id:
    *                 type: integer
    *     responses:
    *       201:
    *         description: The Progress was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 result:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       user_id:
    *                         type: integer
    *                       class_id:
    *                         type: string
    *                       module_id:
    *                         type: integer
    *                       lesson_id:
    *                         type: integer
    *                       instructor_id:
    *                         type: integer
    *                       unit_id:
    *                         type: integer
    *                       progress_id:
    *                         type: integer
    *                       date_completed:
    *                         type: string
    *                       completed:
    *                         type: boolean
    *       400:
    *         description: The Progress was not added to the database
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
    .post("/api/progress/create", [AuthService.verifyToken], async(req, res) => {
        /**
         * @type {ProgressService}
         */
        const progressService = ServiceLocator.getService(ProgressService.name);
        try{
            const { payload: viewResult, error } = await progressService.getProgressionCreationView(req.body);
            if(error) {
                res.status(400).json("progress view broke...."+error.message);
            }
            else {
                if(!viewResult) {
                    res.status(400).json("progress view failed to find a view with that unit id");
                }
                req.body.class_id=viewResult.class_id;
                req.body.module_id=viewResult.module_id;
                req.body.lesson_id=viewResult.lesson_id;
                try{
                    const { payload: result, error } = await progressService.createProgress(req.body);
                    if(error) {
                        res.status(400).json("create progress broke..."+error.message);
                    } else {
                        res
                            .status(201)
                            .json({
                                result
                            });
                    }
                } catch(e) {
                    console.log("an error occured in createProgress");
                    res.status(500).end();
                }

            }
        }catch(e){
            console.log("An error occured in progressRoutes, post/api/progress/create", e);
            res.status(500).end();
        }
        
        
    })
        /**
    * @swagger
    * /progress/findByUnit/{unit_id}/{user_id}:
    *   get:
    *     tags:
    *       - Progress
    *     summary: get progress for unit by user and unit id
    *     description: get unit progress by providing unit id and user id
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: unit_id
    *         required: true
    *         description: id of the unit to get the progress for
    *         type: integer
    *       - in: path
    *         name: user_id
    *         required: true
    *         description: id of the user to get the progress for
    *         type: integer
    *     responses:
    *       201:
    *         description: The Progress was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 AllUnits:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       user_id:
    *                         type: integer
    *                       unit_id:
    *                         type: integer
    *                       completed:
    *                         type: boolean
    *       400:
    *         description: The Progress was not found in the database
    *       401:
    *         description: The user is not authorized to view progress
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
    .get("/api/progress/findByUnit/:unit_id/:user_id", [AuthService.verifyToken], async(req, res) => {
        /**
         * @type {ProgressService}
        */
        const progressService = ServiceLocator.getService(ProgressService.name);
        try{
            const { payload: result, error } = await progressService.getProgress(req.params);
            if(error) {
                res.status(400).json("get progress broke..."+error.message);
            } else {
                res
                    .status(201)
                    .json({
                        result
                    });
            }
        }
        catch(e) {
            console.log("an error occured in progressRoutes, get/api/progress/findByUnit/:unit_id/:user_id", e);
            res.status(500).end();
        }
    })
    /**
    * @swagger
    * /progress/findByLessonAndUser/{lesson_id}/{user_id}:
    *   get:
    *     tags:
    *       - Progress
    *     summary: get list of completed units for a lesson and user
    *     description: retrieve a list of completed units for a user and lesson, the list also includes the units not completed
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: lesson_id
    *         required: true
    *         description: id of the lesson to get the progress for
    *         type: integer
    *       - in: path
    *         name: user_id
    *         required: true
    *         description: id of the user to get the progress for
    *         type: integer
    *     responses:
    *       201:
    *         description: The Progress was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 AllUnits:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       lesson_id:
    *                         type: integer
    *                       unit_id:
    *                         type: integer
    *                       completed:
    *                         type: boolean
    *       400:
    *         description: The Progress was not added to the database
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
    .get("/api/progress/findByLessonAndUser/:lesson_id/:user_id", [AuthService.verifyToken], async(req, res) => {
        /**
         * @type {ProgressService}
         * @type {UnitService}
        */
        const progressService = ServiceLocator.getService(ProgressService.name);
        const unitService = ServiceLocator.getService(UnitService.name);
        req.params.user_id = req.body.user_id;
        try{
            const { payload:AllUnits, error } = await unitService.getUnitsByLessonIdForProgress(req.params);
            if(error) {
                res.status(400).json("lesson id "+error.message);
            } else {
                try{
                    const { payload:UserProgress, error } = await progressService.getProgressByUserAndLesson(req.params);
                    if(error) {
                        res.status(400).json("unit or user id "+error.message);
                    } else {
                        AllUnits.map(unit => {
                            unit.completed=false;
                        })
                        UserProgress.map(progress => {
                            AllUnits.map(unit => {
                                if(unit.unit_id===progress.unit_id) {
                                    unit.completed=true;
                                }
                            })
                        })

                        res
                            .status(201)
                            .json({
                                AllUnits
                            });
                    }
                } catch(e){
                    console.log("An error occured in progressRoutes, get/api/progress/findByLessonAndUser/:lesson_id/:user_id", e);
                    res.status(500).end();
                }
            }
        }catch(e){
            console.log("An error occured in progressRoutes, get/api/progress/findByLessonAndUser", e);
            res.status(500).end();
        }
    })
    /**
    * @swagger
    * /progress/findByModuleAndUser/{module_id}/{user_id}:
    *   get:
    *     tags:
    *       - Progress
    *     summary: get list of completed units for a modules and user
    *     description: retrieve a list of completed units for a user and module, the list also includes the units not completed
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: module_id
    *         required: true
    *         description: id of the module to get the progress for
    *         type: integer
    *       - in: path
    *         name: user_id
    *         required: true
    *         description: id of the user to get the progress for
    *         type: integer
    *     responses:
    *       201:
    *         description: The Progress was found in the database
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 AllUnits:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       module_id:
    *                         type: integer
    *                       unit_id:
    *                         type: integer
    *                       completed:
    *                         type: boolean
    *       400:
    *         description: The Progress was not found in the database
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
     .get("/api/progress/findByModuleAndUser/:module_id/:user_id", [AuthService.verifyToken], async(req, res) => {
        /**
         * @type {ProgressService}
         * @type {UnitService}
        */
        const progressService = ServiceLocator.getService(ProgressService.name);
        const unitService = ServiceLocator.getService(UnitService.name);
        req.params.user_id = req.body.user_id;
        try{
            const { payload:AllUnits, error } = await unitService.getUnitsByModuleIdForProgress(req.params);
            if(error) {
                res.status(400).json("module id "+error.message);
            } else {
                try{
                    const { payload:UserProgress, error } = await progressService.getProgressByUserAndModule(req.params);
                    if(error) {
                        res.status(400).json("unit or user id "+error.message);
                    } else {
                        AllUnits.map(unit => {
                            unit.completed=false;
                        })
                        UserProgress.map(progress => {
                            AllUnits.map(unit => {
                                if(unit.unit_id===progress.unit_id) {
                                    unit.completed=true;
                                }
                            })
                        })

                        res
                            .status(201)
                            .json({
                                AllUnits
                            });
                    }
                } catch(e){
                    console.log("An error occured in progressRoutes, get/api/progress/findByModuleAndUser/:module_id/:user_id", e);
                    res.status(500).end();
                }
            }
        }catch(e){
            console.log("An error occured in progressRoutes, get/api/progress/findByModuleAndUser", e);
            res.status(500).end();
        }
    })

    /**
    * @swagger
    * /progress/findByClassAndUser/{class_id}/{user_id}:
    *   get:
    *     tags:
    *       - Progress
    *     summary: get list of completed units for a classes and user
    *     description: retrieve a list of completed units for a user and classes, the list also includes the units not completed
    *     parameters:
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *       - in: path
    *         name: class_id
    *         required: true
    *         description: id of the module to get the progress for
    *         type: string
    *       - in: path
    *         name: user_id
    *         required: true
    *         description: id of the user to get the progress for
    *         type: integer
    *     responses:
    *       201:
    *         description: The Progress was found in database
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 AllUnits:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       class_id:
    *                         type: integer
    *                       unit_id:
    *                         type: integer
    *                       completed:
    *                         type: boolean
    *       400:
    *         description: The Progress was not found in the database
    *       401:
    *         description: The user is not authorized to view this progress
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
     .get("/api/progress/findByClassAndUser/:class_id/:user_id", [AuthService.verifyToken], async(req, res) => {
        /**
         * @type {ProgressService}
         * @type {UnitService}
        */
        const progressService = ServiceLocator.getService(ProgressService.name);
        const unitService = ServiceLocator.getService(UnitService.name);
        req.params.user_id = req.body.user_id;
        try{
            const { payload:AllUnits, error } = await unitService.getUnitsByClassIdForProgress(req.params);
            if(error) {
                res.status(400).json("class id "+error.message);
            } else {
                try{
                    const { payload:UserProgress, error } = await progressService.getProgressByUserAndClass(req.params);
                    if(error) {
                        res.status(400).json("unit or user id "+error.message);
                    } else {
                        AllUnits.map(unit => {
                            unit.completed=false;
                        })
                        UserProgress.map(progress => {
                            AllUnits.map(unit => {
                                if(unit.unit_id===progress.unit_id) {
                                    unit.completed=true;
                                }
                            })
                        })

                        res
                            .status(201)
                            .json({
                                AllUnits
                            });
                    }
                } catch(e){
                    console.log("An error occured in progressRoutes, get/api/progress/findByClassAndUser/:class_id/:user_id", e);
                    res.status(500).end();
                }
            }
        }catch(e){
            console.log("An error occured in progressRoutes, get/api/progress/findByClassAndUser", e);
            res.status(500).end();
        }
    })
module.exports = router;