/**
 * @typedef {Object} Lesson
 * @property {number} lessons_id
 * @property {string} lesson_name
 * @property {string} lessonsdescrip
 * @property {number} module_id
 */

/**
 * @typedef {Object} LessonDTO
 * @property {number} lessons_id
 * @property {string} lesson_name
 * @property {string} lesson_descrip
 * @property {number} module_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class LessonsService extends BaseService{
     
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
 

 };
 
 module.exports = LessonsService