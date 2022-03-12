
 /** 
 * @typedef {Object} Unit
 * @property {number} unit_id
 * @property {number} unit_index
 * @property {string} unit_name
 * @property {string} unit_content
 * @property {number} lesson_id
 */

 /** 
 * @typedef {Object} UnitDTO
 * @property {number} unit_id
 * @property {number} unit_index
 * @property {string} unit_name
 * @property {string} unit_content
 * @property {number} lesson_id
 */

 const BaseService = require("./utility/BaseService");
 const Result = require("./utility/Result").Result;
 
 class UnitService extends BaseService{


     /** 
      * @param {UnitDTO} UnitDTO
      * @returns {Promise<Result<Unit>>}
      */
     createUnit(UnitDTO) { }


     /** 
      * @param {number} Unit_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteUnit(Unit_id) { }



     /** 
      * @param {UnitDTO} UnitDTO
      * @returns {Promise<Result<Unit>>}
      */
     updateUnit(UnitDTO) { }
 

     /** 
      * @param {UnitDTO} UnitDTO
      * @returns {Promise<Result<Unit>>}
      */
     getUnit(UnitDTO){ }
 

 };
 
 module.exports = UnitService;