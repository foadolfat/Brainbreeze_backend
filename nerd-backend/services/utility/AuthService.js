
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("./ServiceLocator");
const UserService = require("../UserService");
const saltRounds = 10;
const secret= "super-duper-secret";

async function authenticate(req, res, next){
    /**
    * @type {UserService}
    */
    const userService = ServiceLocator.getService(UserService.name);

    try{
        const { payload: user, error } = await userService.getUser(req.body);

        if(error) {
            res.status(400).json(error);
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(err) {
                    res.status(500).send("Internal Error");
                    return;
                }
                req.auth = result;
                if(result){
                    req.token = jwt.sign({ id: user.id }, secret, {
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
    let token = req.headers["x-access-token"];
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
      req.id = decoded.id;
      next();
    });
};

module.exports = {
    authenticate : authenticate,
    encrypt : encrypt,
    verifyToken : verifyToken
}