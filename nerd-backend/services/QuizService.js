/**
 * @typedef {Object} Quiz
 * @property {number} quiz_id
 * @property {number} quiz_index
 * @property {string} quiz_name
 * @property {string} quiz_type
 * @property {string} quiz_content
 * @property {string} quiz_answers
 * @property {number} unit_id
 */

/**
 * @typedef {Object} QuizDTO
 * @property {number} quiz_id
 * @property {number} quiz_index
 * @property {string} quiz_name
 * @property {string} quiz_type
 * @property {string} quiz_content
 * @property {string} quiz_answers
 * @property {number} unit_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class QuizService extends BaseService{
     
     /**
      * @param {QuizDTO} quizDTO
      * @returns {Promise<Result<quiz>>}
      */
     createQuiz(quizDTO) { }


     /**
      * @param {number} quiz_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteQuiz(quiz_id) { }


     /**
      * @param {QuizDTO} quizDTO
      * @returns {Promise<Result<quiz>>}
      */
     updateQuiz(quizDTO) { }
 

     /**
      * @param {QuizDTO} quizDTO
      * @returns {Promise<Result<quiz>>}
      */
     getQuiz(quizDTO){ }
 

 };
 
 module.exports = QuizService