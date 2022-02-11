/**
 * @typedef {Object} Class
 * @property {number} class_id
 * @property {string} class_name
 * @property {string} class_descrip
 * @property {number} user_class
 */

/**
 * @typedef {Object} ClassDTO
 * @property {number} class_id
 * @property {string} class_name
 * @property {string} class_descrip
 * @property {number} user_class
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class classesService extends BaseService{
     
     /**
      * @param {classesDTO} classesDTO
      * @returns {Promise<Result<classes>>}
      */
     createclasses(classesDTO) { }


     /**
      * @param {number} classes_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteclasses(classes_id) { }


     /**
      * @param {classesDTO} classesDTO
      * @returns {Promise<Result<classes>>}
      */
     updateclasses(classesDTO) { }
 

     /**
      * @param {classesDTO} classesDTO
      * @returns {Promise<Result<classes>>}
      */
     getclasses(classesDTO){ }
 

 };
 
 module.exports = classesService