var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const QuizService = require("../services/QuizService");

const utcStr = new Date().toUTCString();
//quiz routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access quiz route Time: ', utcStr);
        next();
    })
    /**
    * @swagger
    * /quiz/create:
    *   post:
    *     tags:
    *       - Quiz
    *     summary: Create a new quiz
    *     description: Create a new quiz by an instructor
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
    *               quiz_name:
    *                 type: string
    *               quiz_index:
    *                 type: integer
    *               quiz_type:
    *                 type: string
    *               quiz_content:
    *                 type: object
    *               quiz_answers:
    *                 type: object
    *               unit_id:
    *                 type: integer
    *               instructor_id:
    *                 type: integer
    *     responses:
    *       201:
    *         description: Successfully created quiz
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 result:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       quiz_name:
    *                         type: string
    *                       quiz_index:
    *                         type: integer
    *                       quiz_type:
    *                         type: string
    *                       quiz_content:
    *                         type: object
    *                       quiz_answers:
    *                         type: object
    *                       unit_id:
    *                         type: integer
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
    .post("/api/quiz/create", [AuthService.verifyToken, AuthService.verifyUserType, AuthService.verifyUnitAccess], async(req, res) => {
        /**
         * @type {QuizService}
         */
        const quizService = ServiceLocator.getService(QuizService.name);

        try{
            const { payload: result, error } = await quizService.createQuiz(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({
                        result
                    });
            }
        }catch(e){
            console.log("An error occured in quizRoutes, post/quiz");
            res.status(500).end();
        }
        
        
    })

    /**
    * @swagger
    * /quiz/{id}:
    *   get:
    *     tags:
    *       - Quiz
    *     summary: Get a quiz by id
    *     description: Get a quiz by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: the id of the quiz
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: Successfully retrieved quiz
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 quiz:
    *                   type: object
    *                   properties:
    *                     quiz_id:
    *                       type: integer
    *                     quiz_name:
    *                       type: string
    *                     quiz_index:
    *                       type: integer
    *                     quiz_type:
    *                       type: string
    *                     quiz_content:
    *                       type: string
    *                     quiz_answers:
    *                       type: string
    *                     unit_id:
    *                       type: integer
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

    /**
    * @swagger
    * /quiz/update/{id}:
    *   put:
    *     tags:
    *       - Quiz
    *     summary: Update a quiz by id
    *     description: Update a quiz by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: the id of the quiz
    *         required: true
    *         type: integer
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
    *               quiz_name:
    *                 type: string
    *               quiz_index:
    *                 type: integer
    *               quiz_type:
    *                 type: string
    *               quiz_content:
    *                 type: string
    *               quiz_answers:
    *                 type: string
    *               unit_id:
    *                 type: integer
    *     responses:
    *       200:
    *         description: Successfully updated quiz
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: boolean
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
    .put("/api/quiz/update/:id", AuthService.verifyToken, async(req, res) => {

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

    /**
    * @swagger
    * /quiz/delete/{id}:
    *   delete:
    *     tags:
    *       - Quiz
    *     summary: Delete a quiz by id
    *     description: Delete a quiz by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: the id of the quiz
    *         required: true
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully deleted quiz
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: boolean
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
    .delete("/api/quiz/:id", AuthService.verifyToken, async(req, res) => {

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