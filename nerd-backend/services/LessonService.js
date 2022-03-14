/**
 * @typedef {Object} Lesson
 * @property {number} lesson_id
 * @property {string} lesson_name
 * @property {string} lesson_descrip
 * @property {number} module_id
 * @property {number} instructor_id
 */

/**
 * @typedef {Object} LessonDTO
 * @property {number} lesson_id
 * @property {string} lesson_name
 * @property {string} lesson_descrip
 * @property {number} module_id
 * @property {number} instructor_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class LessonService extends BaseService{
     
     /**
      * @param {LessonDTO} lessonDTO
      * @returns {Promise<Result<Lesson>>}
      */
     createLesson(lessonDTO) { }


     /**
      * @param {number} lesson_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteLesson(lesson_id) { }


     /**
      * @param {LessonDTO} lessonDTO
      * @returns {Promise<Result<Lesson>>}
      */
     updateLesson(lessonDTO) { }
 

     /**
      * @param {LessonDTO} lessonDTO
      * @returns {Promise<Result<Lesson>>}
      */
     getLesson(lessonDTO){ }

    /**
     * @param {lessonDTO} lessonDTO
     * @returns {Promise<Result<lesson>>} 
     */
    async getLessonById(lessonDTO){ }

    /**
     * @param {lessonDTO} lessonDTO
     * @returns {Promise<Result<lesson>>} 
     */
    async getLessonByModule(lessonDTO){ }
 

 };
 
 module.exports = LessonService