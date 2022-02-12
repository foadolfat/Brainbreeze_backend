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

    .post("/api/lesson", async(req, res) => {
        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);

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

    .get("/api/lesson/:id", async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
        req.body.lesson_id = req.params.id;
        try{
            
            const { payload: lesson, error } = await lessonService.getLesson(req.body);

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
                            module_id:lesson.module_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in lessonRoutes, get/lesson");
            res.status(500).end();
        }

    })


    .put("/api/lesson/:id", async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
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


    .delete("/api/lesson/:id", async(req, res) => {

        /**
         * @type {LessonService}
         */
        const lessonService = ServiceLocator.getService(LessonService.name);
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