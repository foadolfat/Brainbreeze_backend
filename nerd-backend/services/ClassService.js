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
 
 class ClassService extends BaseService{
     
     /**
      * @param {ClassDTO} classDTO
      * @returns {Promise<Result<Class>>}
      */
     createClass(classDTO) { }


     /**
      * @param {number} class_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteClass(class_id) { }


     /**
      * @param {ClassDTO} classDTO
      * @returns {Promise<Result<Class>>}
      */
     updateClass(classDTO) { }
 

     /**
      * @param {ClassDTO} classDTO
      * @returns {Promise<Result<Class>>}
      */
     getClass(classDTO){ }

         /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<Class>>} 
     */
    async getClassById(classDTO){ }

        /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<Class>>} 
     */
    async getClassByName(classDTO){ }

    /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<Class>>} 
     */
    async getAllClassesByUser(classDTO){ }

    /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<Class>>} 
     */
    async getRoster(classDTO){ }

    /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<Class>>} 
     */
    async getClassByUserId(classDTO){ }

    /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<boolean>>}
     */
    async dropClass(classDTO) { }

    /**
     * @param {ClassDTO} classDTO
     * @returns {Promise<Result<boolean>} 
     */
    async signUp(classDTO) { }
 

 };
 
 module.exports = ClassService