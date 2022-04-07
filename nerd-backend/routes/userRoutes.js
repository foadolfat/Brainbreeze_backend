var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const UserService = require("../services/UserService");

const utcStr = new Date().toUTCString();
//user routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access user route Time: ', utcStr);
        next();
    })
    
    /**
    * @swagger
    * /user/create:
    *   post:
    *     tags:
    *       - User
    *     summary: Adds a new user to the database
    *     description: Creates a new user in the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               user_name:
    *                 type: string
    *               user_email:
    *                 type: string
    *               user_password:
    *                 type: string
    *               user_type:
    *                 type: string
    *     responses:
    *       201:
    *         description: The user was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The user was not added to the database
    *       500:
    *         description: An internal error occured
    */
    .post("/api/user/create", AuthService.encrypt, async(req, res) => {
        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);

        try{
            const { payload: message, error } = await userService.createUser(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in UserRoutes, post/user");
            res.status(500).end();
        }
        
        
    })

    /**
    * @swagger
    * /user/signin:
    *   post:
    *     tags:
    *       - User
    *     summary: Sign in with an existing user and recieve a token
    *     description: Signs in with an existing user and recieves a token
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               user_email:
    *                 type: string
    *               user_password:
    *                 type: string
    *     responses:
    *       201:
    *         description: The user was added to the database
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 auth:
    *                   type: boolean
    *                 token:
    *                   type: string
    *                 user_id:
    *                   type: string
    *                 user_name:
    *                   type: string
    *                 user_email:
    *                   type: string
    *                 user_type:
    *                   type: string
    *       400:
    *         description: The user was not added to the database
    *       500:
    *         description: An internal error occured
    */
    .post("/api/user/signin", AuthService.authenticate, async(req, res) => {

        if(!req.auth) {
            res.status(400).json(
                {
                    message: "Invalid credentials"
                }
            );
        } else {
            res
                .status(200)
                .json(
                    {
                        auth:req.auth,
                        token:req.token,
                        user_email:req.user_email,
                        user_name:req.user_name,
                        user_type:req.user_type,
                        user_id:req.user_id
                    }
                );
        }

    })
    /**
    * @swagger
    * /user/{id}:
    *   get:
    *     tags:
    *       - User
    *     summary: Retrieve a single user.
    *     description: Retrieve a single user. Only the user that created the user can retrieve it.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: Numeric ID of the user to retrieve.
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Retrieved a single user by id.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 user_id: 
    *                   type: integer
    *                   description: The user ID.
    *                   example: 0
    *                 user_name: 
    *                   type: string
    *                   description: The user's name.
    *                   example: Leanne Graham
    *                 user_email: 
    *                   type: string
    *                   description: The user's email.
    *                   example: john@email.com
    *                 user_type: 
    *                   type: string
    *                   description: The user's type.
    *                   example: admin
    *       400:
    *         description: The user was not retrieved.
    *       401:
    *         description: The user was not retrieved because the user is not authorized
    *       403:
    *         description: The user was not retrieved because no token was provided in header
    *       500:
    *         description: An internal error occured.
    */
    .get("/api/user/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.user_id = req.params.id;
        try{
            
            const { payload: user, error } = await userService.getUserById(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            user_id:user.user_id,
                            user_email:user.user_email,
                            user_name:user.user_name,
                            user_type:user.user_type
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
    * /user/update/{id}:
    *   put:
    *     tags:
    *       - User
    *     summary: Update a single user.
    *     description: Update a single user, by sending the user's id and the user's new information. The user's id is required to update the user.NOTE The user's password and email are not updated. Anyfield left blank will be erased.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: Numeric ID of the user to update.
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
    *               user_name:
    *                 type: string
    *               user_type:
    *                 type: string
    *     responses:
    *       200:
    *         description: The user was updated.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The user was not updated
    *       401:
    *         description: The user was not updated because the user is not authorized
    *       403:
    *         description: The user was not updated because no token was provided in header
    *       500:
    *         description: An internal error occured
    */
    .put("/api/user/update/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        req.body.user_id = req.user_id;
        try{
            
            const { payload: message, error } = await userService.updateUser(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in userRoutes, put/user");
            res.status(500).end();
        }

    })

    /**
    * @swagger
    * /user/delete/{id}:
    *   delete:
    *     tags:
    *       - User
    *     summary: Delete a single user.
    *     description: Delete a single user, by sending the user's id. The user's id is required to delete the user.
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: Numeric ID of the user to delete.
    *         type: integer
    *       - in: header
    *         name: token
    *         description: an authorization header
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: The user was deleted.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message: 
    *                   type: boolean
    *       400:
    *         description: The user was not deleted from the database
    *       401:
    *         description: The user was not deleted because the user is not authorized
    *       403:
    *         description: The user was not deleted because no token was provided in header
    *       500:
    *         description: An internal error occured
    */
    .delete("/api/user/delete/:id", AuthService.verifyToken, async(req, res) => {

        /**
         * @type {UserService}
         */
        const userService = ServiceLocator.getService(UserService.name);
        try{
            
            const { payload: message, error } = await userService.deleteUser(req.body);

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
            console.log("an error occured in userRoutes, delete/user");
            res.status(500).end();
        }

    });

module.exports = router;