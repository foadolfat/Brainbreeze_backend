
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("./ServiceLocator");
const UserService = require("../UserService");
const saltRounds = 10;
const secret= "super-duper-secret";


function encrypt(req, res, next){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err) {
            res.status(500).send("Internal Error");
            throw err;
        }
        req.body.password = hash;
        next();
    });
};


module.exports = {
    encrypt : encrypt
}