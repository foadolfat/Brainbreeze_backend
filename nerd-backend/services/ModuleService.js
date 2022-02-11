/**
 * @typedef {Object} module
 * @property {number} module_id
 * @property {string} module_name
 * @property {string} module_descrip
 * @property {number} class_id
 */

/**
 * @typedef {Object} moduleDTO
 * @property {number} module_id
 * @property {string} module_name
 * @property {string} module_descrip
 * @property {number} class_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class modulesService extends BaseService{
     
     /**
      * @param {modulesDTO} modulesDTO
      * @returns {Promise<Result<modules>>}
      */
     createmodules(modulesDTO) { }


     /**
      * @param {number} modules_id
      * @returns {Promise<Result<boolean>>} 
      */
     deletemodules(modules_id) { }


     /**
      * @param {modulesDTO} modulesDTO
      * @returns {Promise<Result<modules>>}
      */
     updatemodules(modulesDTO) { }
 

     /**
      * @param {modulesDTO} modulesDTO
      * @returns {Promise<Result<modules>>}
      */
     getmodules(modulesDTO){ }
 

 };
 
 module.exports = modulesService