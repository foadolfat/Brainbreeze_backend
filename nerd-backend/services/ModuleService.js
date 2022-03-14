/**
 * @typedef {Object} Module
 * @property {number} module_id
 * @property {string} module_name
 * @property {string} module_descrip
 * @property {number} class_id
 * @property {number} instructor_id
 */

/**
 * @typedef {Object} ModuleDTO
 * @property {number} module_id
 * @property {string} module_name
 * @property {string} module_descrip
 * @property {number} class_id
 * @property {number} instructor_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class ModuleService extends BaseService{
     
     /**
      * @param {ModuleDTO} moduleDTO
      * @returns {Promise<Result<Module>>}
      */
     createModule(moduleDTO) { }


     /**
      * @param {number} module_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteModule(module_id) { }


     /**
      * @param {ModuleDTO} moduleDTO
      * @returns {Promise<Result<Module>>}
      */
     updateModule(moduleDTO) { }
 

     /**
      * @param {ModuleDTO} moduleDTO
      * @returns {Promise<Result<Module>>}
      */
     getModule(moduleDTO){ }

    /**
     * @param {ModuleDTO} moduleDTO
     * @returns {Promise<Result<Module>>} 
     */
    async getModuleByClassId(moduleDTO){ }

    
 

 };
 
 module.exports = ModuleService