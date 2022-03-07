
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("./ServiceLocator");
const UserService = require("../UserService");
const saltRounds = 10;
const secret= "super-duper-secret";

async function authenticate(req, res, next){
    

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