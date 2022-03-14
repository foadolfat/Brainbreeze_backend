var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const UnitService = require("../services/UnitService");


//unit routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access unit route Time: ', Date.now());
        next();
    })

    /**
    * @swagger
    * /unit/create:
    *   post:
    *     tags:
    *       - Unit
    *     summary: Create a new unit
    *     description: Create a new unit by an instructor
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
    *               unit_name:
    *                 type: string
    *               unit_content:
    *                 type: string
    *               lesson_id:
    *                 type: integer
    *               instructor_id:
    *                 type: integer
    *     responses:
    *       201:
    *         description: Successfully created unit
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
    .post("/api/unit/create", [AuthService.verifyToken, AuthService.verifyUserType], async(req, res) => {
        /**
         * @type {UnitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.user_id = req.user_id;
        try{
            const { payload: message, error } = await unitService.createUnit(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in unitRoutes, post/unit");
            res.status(500).end();
        }
        
        
    })

    /**
    * @swagger
    * /unit/{id}:
    *   get:
    *     tags:
    *       - Unit
    *     summary: retrieve a unit
    *     description: retrieve aunit by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: unit id
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 unit_id:
    *                   type: integer
    *                 unit_name:
    *                   type: string
    *                 unit_content:
    *                   type: string
    *                 lesson_id:
    *                   type: integer
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
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/unit/:id", async(req, res) => {

        /**
         * @type {UnitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: unit, error } = await unitService.getUnit(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            unit_id:unit.unit_id,
                            unit_name:unit.unit_name,
                            unit_content:unit.unit_content,
                            lessson_id:unit.lesson_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in unitRoutes, get/unit");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /unit/update/{id}:
    *   put:
    *     tags:
    *       - Unit
    *     summary: update a unit
    *     description: update a unit by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: unit id
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
    *               unit_name:
    *                 type: string
    *               unit_content:
    *                 type: string
    *               lesson_id:
    *                 type: integer
    *               instructor_id:
    *                 type: integer
    *     responses:
    *       200:
    *         description: Successfully updated unit
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
    .put("/api/unit/update/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {unitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: message, error } = await unitService.updateUnit(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in unitRoutes, put/unit");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /unit/delete/{id}:
    *   delete:
    *     tags:
    *       - Unit
    *     summary: delete a unit
    *     description: delete a unit by id
    *     parameters:
    *       - in: path
    *         name: id
    *         description: unit id
    *         required: true
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Successfully deleted unit
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
    .delete("/api/unit/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {unitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: message, error } = await unitService.deleteUnit(req.body);

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
            console.log("an error occured in unitRoutes, delete/unit");
            res.status(500).end();
        }

    });

module.exports = router;