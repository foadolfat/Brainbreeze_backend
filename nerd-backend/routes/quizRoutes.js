var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const QuizService = require("../services/QuizService");

//quiz routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access quiz route Time: ', Date.now());
        next();
    })

    .post("/api/quiz", async(req, res) => {
        /**
         * @type {QuizService}
         */
        const quizService = ServiceLocator.getService(QuizService.name);

        try{
            const { payload: message, error } = await quizService.createQuiz(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in quizRoutes, post/quiz");
            res.status(500).end();
        }
        
        
    })

    .get("/api/quiz/:id", async(req, res) => {

        /**
         * @type {QuizService}
         */
        const quizService = ServiceLocator.getService(QuizService.name);
        req.body.quiz_id = req.params.id;
        try{
            
            const { payload: quiz, error } = await quizService.getQuiz(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            quiz_id:quiz.quiz_id,
                            quiz_name:quiz.quiz_name,
							quiz_type:quiz.quiz_type,
                            quiz_content:quiz.quiz_content,
							quiz_answers:answer.quiz_answers,
                            unit_id:quiz.quiz_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in quizRoutes, get/quiz");
            res.status(500).end();
        }

    })


    .put("/api/quiz/:id", async(req, res) => {

        /**
         * @type {quizService}
         */
        const quizService = ServiceLocator.getService(QuizService.name);
        req.body.quiz_id = req.params.id;
        try{
            
            const { payload: message, error } = await quizService.updateQuiz(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in quizRoutes, put/quiz");
            res.status(500).end();
        }

    })


    .delete("/api/quiz/:id", async(req, res) => {

        /**
         * @type {quizService}
         */
        const quizService = ServiceLocator.getService(QuizService.name);
        req.body.quiz_id = req.params.id;
        try{
            
            const { payload: message, error } = await quizService.deleteQuiz(req.body);

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
            console.log("an error occured in quizRoutes, delete/quiz");
            res.status(500).end();
        }

    });

module.exports = router;