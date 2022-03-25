
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("./ServiceLocator");
const UserService = require("../UserService");
const saltRounds = 10;
const secret= "super-duper-secret";
var uuid = require('uuid');

async function verifyUserType(req, res, next){
    /**
    * @type {UserService}
    */
    const userService = ServiceLocator.getService(UserService.name);

    try{
        const { payload: user, error } = await userService.getUserById(req.body);

        if(error) {
            res.status(400).json(error);
        } else {
            req.user_type=user.user_type;
            next();
        }
     }catch(e){
         console.log("an error occured");
         res.status(500).end();
     }
};

async function authenticate(req, res, next){
    /**
    * @type {UserService}
    */
    const userService = ServiceLocator.getService(UserService.name);
    console.log(req);
    try{
        const { payload: user, error } = await userService.getUserByEmail(req.body);
        console.log(user);
        if(error) {
            res.status(400).json(error);
        } else {
            bcrypt.compare(req.body.user_password, user.user_password, function(err, result) {
                if(err) {
                    res.status(500).send("Internal Error");
                    return;
                }
                req.auth = result;
                if(result){
                    req.user_email=user.user_email;
                    req.user_name=user.user_name;
                    req.user_type=user.user_type;
                    req.user_id=user.user_id;
                    req.token = jwt.sign({ id: user.user_id }, secret, {
                        expiresIn: 86400 // 24 hours
                    }); 
                }
                next();
            });
        }
     }catch(e){
         console.log("an error occured");
         res.status(500).end();
     }
};


function encrypt(req, res, next){
    bcrypt.hash(req.body.user_password, saltRounds, function(err, hash) {
        if(err) {
            res.status(500).send("Internal Error");
            throw err;
        }
        req.body.user_password = hash;
        next();
    });
};

function verifyToken(req, res, next) {
    let token = req.headers["token"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.body.user_id = decoded.id;
      next();
    });
};

function createUUID(req, res, next){
    req.id = uuid.v4();
    next();
};


module.exports = {
    authenticate : authenticate,
    encrypt : encrypt,
    verifyToken : verifyToken,
    verifyUserType : verifyUserType,
    createUUID : createUUID
}