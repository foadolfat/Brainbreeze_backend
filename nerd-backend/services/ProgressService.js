/**
 * @typedef {Object} Progress
 * @property {number} user_id
 * @property {number} unit_id
 * @property {number} instructor_id
 * @property {boolean} completed
 * @property {number} progress_id
 * @property {string} date_completed
 */

/**
 * @typedef {Object} ProgressDTO
 * @property {number} user_id
 * @property {number} unit_id
 * @property {number} instructor_id
 * @property {boolean} completed
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class ProgressService extends BaseService{
     
    /**
      * @param {ProgressDTO} ProgressDTO
      * @returns {Promise<Result<Progress>>}
      */
    createProgress(classDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
     */
    getProgressByUser(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
    */
    getProgressByUnit(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
     */
     getProgressByUserAndUnit(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
     */
     getInstructorId(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
     */
     getProgressByInstructorId(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<Progress>>}
    */
    updateProgress(progressDTO) { }

    /**
     * @param {ProgressDTO} ProgressDTO
     * @returns {Promise<Result<boolean>>}
     */
    deleteProgress(progressDTO) { }


 };
 
 module.exports = ProgressService