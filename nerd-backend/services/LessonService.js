/**
 * @typedef {Object} lesson
 * @property {number} lesson_id
 * @property {string} lesson_name
 * @property {string} lessonsdescrip
 * @property {number} module_id
 */

/**
 * @typedef {Object} lessonDTO
 * @property {number} lesson_id
 * @property {string} lesson_name
 * @property {string} lesson_descrip
 * @property {number} module_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class lessonsService extends BaseService{
     
     /**
      * @param {lessonsDTO} lessonsDTO
      * @returns {Promise<Result<lessons>>}
      */
     createlessons(lessonsDTO) { }


     /**
      * @param {number} lessons_id
      * @returns {Promise<Result<boolean>>} 
      */
     deletelessons(lessons_id) { }


     /**
      * @param {lessonsDTO} lessonsDTO
      * @returns {Promise<Result<lessons>>}
      */
     updatelessons(lessonsDTO) { }
 

     /**
      * @param {lessonsDTO} lessonsDTO
      * @returns {Promise<Result<lessons>>}
      */
     getlessons(lessonsDTO){ }
 

 };
 
 module.exports = lessonsService