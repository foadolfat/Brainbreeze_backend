/**
 * @typedef {Object} User
 * @property {number} user_id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserDTO
 * @property {number} user_id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class UserService extends BaseService{
     
     /**
      * @param {UserDTO} userDTO
      * @returns {Promise<Result<User>>}
      */
     createUser(userDTO) { }


     /**
      * @param {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteUser(user_id) { }


     /**
      * @param {UserDTO} userDTO
      * @returns {Promise<Result<User>>}
      */
     updateUser(userDTO) { }
 

     /**
      * @param {UserDTO} userDTO
      * @returns {Promise<Result<User>>}
      */
     getUser(userDTO){ }
 

 };
 
 module.exports = UserService