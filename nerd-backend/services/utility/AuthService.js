
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("./ServiceLocator");
const UserService = require("../UserService");
const ClassService = require("../ClassService");
const ModuleService = require("../ModuleService");
const LessonService = require("../LessonService");
const UnitService = require("../UnitService");
const saltRounds = 10;
const secret= "super-duper-secret";
var uuid = require('uuid');

async function verifyClassInstructor(req, res, next){
    /**
    * @type {ClassService}
    */
    const classService = ServiceLocator.getService(ClassService.name);
    try{
        const { payload: result, error } = await classService.getInstructorId(req.body);

        if(error) {
            res.status(400).json(error);
        } else {
            if(result.instructor_id == req.body.user_id) {
                next();
            } else {
                res.status(400).json({
                    error: "You are not authorized to access this class as an instructor."
                });
            }
            
        }
     }catch(e){
         console.log("an error occured");
         res.status(500).end();
     }
};
async function verifyClassExists(req, res, next){
    /**
    * @type {ModuleService}
    */
     const classService = ServiceLocator.getService(ClassService.name);
     try{
         const { payload: result, error } = await classService.getClassId(req.body);
 
         if(error) {
             res.status(400).json(error);
         } else {
            if(result == req.body.class_id) {
                next();
            } else {
                res.status(400).json({
                    error: "Something went wrong. Class does not exist."
                });
            }
         }
      }catch(e){
          console.log("an error occured");
          res.status(500).end();
      }
 };

 async function verifyModuleAccess(req, res, next){
    /**
    * @type {ModuleService}
    */
     const moduleService = ServiceLocator.getService(ModuleService.name);

     try{
         const { payload: result, error } = await moduleService.getModuleId(req.body);
 
         if(error) {
             res.status(400).json(error);
         } else {
            if(result.instructor_id == req.body.user_id) {
                next();
            } else {
                res.status(400).json({
                    error: "You are not authorized to access this module as an instructor."
                });
            }
         }
      }catch(e){
          console.log("an error occured");
          res.status(500).end();
      }
 };

 async function verifyLessonAccess(req, res, next){
    /**
    * @type {LessonService}
    */
    const lessonService = ServiceLocator.getService(LessonService.name);

     try{
         const { payload: result, error } = await lessonService.getLessonId(req.body);
 
         if(error) {
             res.status(400).json(error);
         } else {
            if(result.instructor_id == req.body.user_id) {
                next();
            } else {
                res.status(400).json({
                    error: "You are not authorized to access this lesson as an instructor."
                });
            }
         }
      }catch(e){
          console.log("an error occured");
          res.status(500).end();
      }
 };

 async function verifyUnitAccess(req, res, next){
    /**
    * @type {UnitService}
    */
    const unitService = ServiceLocator.getService(UnitService.name);

     try{
         const { payload: result, error } = await unitService.getUnitId(req.body);
 
         if(error) {
             res.status(400).json(error);
         } else {
            if(result.instructor_id == req.body.user_id) {
                next();
            } else {
                res.status(400).json({
                    error: "You are not authorized to access this unit as an instructor."
                });
            }
         }
      }catch(e){
          console.log("an error occured");
          res.status(500).end();
      }
 };

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
    try{
        const { payload: user, error } = await userService.getUserByEmail(req.body);
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
    createUUID : createUUID,
    verifyClassInstructor : verifyClassInstructor,
    verifyClassExists : verifyClassExists,
    verifyModuleAccess : verifyModuleAccess,
    verifyLessonAccess : verifyLessonAccess,
    verifyUnitAccess : verifyUnitAccess
}