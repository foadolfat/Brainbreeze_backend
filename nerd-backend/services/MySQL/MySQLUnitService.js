const { Result, IError } = require("../utility/Result");
const UnitService = require("../UnitService");

//TODO: implement proper authenitcation within db
class MySQLUnitService extends UnitService {
    /**
     * @param {import("mysql").Pool} connection
     */
    constructor(connection) {
        super();
        /**
         * @private
         * @type {import("mysql").Pool}
         */
        this.connection = connection;
    }


    /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../Unitervice").unit>>} 
     */
    async createUnit(unitDTO) {
        const createUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO units ( unit_name, unit_content, lesson_id, instructor_id) VALUES(?,?,?,?);",
                values:[unitDTO.unit_name, unitDTO.unit_content, unitDTO.lesson_id, unitDTO.instructor_id]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createUnitCMD;
            if(results.affectedRows>0) return this.getLastInsert();
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }
    /**
     * @returns {Promise<Result<../UnitService>Unit} 
     */
    async getLastInsert() {
        const getLastInsertCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM units WHERE unit_id = (SELECT MAX(unit_id) FROM units);"
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getLastInsertCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }
    /**
     * @param {import("../Unitervice").UnitDTO} unitDTO
     * @returns {Promise<Result<import("../Unitervice").unit>>} 
     */
    async getUnitId(unitDTO){
        /**
         * @type {Promise<import("../LessonService").lesson>}
         */
        const getUnitIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM units WHERE unit_id=? and instructor_id=?;",
                values: [unitDTO.unit_id, unitDTO.instructor_id]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("Unit does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const unit = await getUnitIdCMD;
            return new Result(unit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }
    /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../UnitService").unit>>} 
     */
    async getUnit(unitDTO){
        /**
         * @type {Promise<import("../UnitService").unit>}
         */
        const getUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM Units WHERE unit_id=?;",
                values: [unitDTO.unit_id]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("Unit does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newunit = await getUnitCMD;
            return new Result(newunit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../UnitService").unit>>} 
     */
     async getUnitsByLessonIdForProgress(unitDTO){
        /**
         * @type {Promise<import("../UnitService").unit>}
         */
        const getUnitsByLessonIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT unit_id, lesson_id FROM units WHERE lesson_id=?;",
                values: [unitDTO.lesson_id]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("lesson does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newunit = await getUnitsByLessonIdCMD;
            return new Result(newunit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../UnitService").unit>>} 
     */
     async getUnitsByModuleIdForProgress(unitDTO){
        /**
         * @type {Promise<import("../UnitService").unit>}
         */
        const getUnitsByModuleIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT unit_id, module_id FROM module_units WHERE module_id=?;",
                values: [unitDTO.module_id]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("module does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newunit = await getUnitsByModuleIdCMD;
            return new Result(newunit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../UnitService").unit>>} 
     */
     async getUnitsByClassIdForProgress(unitDTO){
        /**
         * @type {Promise<import("../UnitService").unit>}
         */
        const getUnitsByClassIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT unit_id, class_id FROM class_units WHERE class_id=?;",
                values: [unitDTO.class_id]
            }, (err, results) => {
                
                if(err){
                    console.log(err);
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("class does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newunit = await getUnitsByClassIdCMD;
            return new Result(newunit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../UnitService").unitDTO} unitDTO
     * @returns {Promise<Result<import("../UnitService").unit>>} 
     */
     async getUnitsByLessonId(unitDTO){
        /**
         * @type {Promise<import("../UnitService").unit>}
         */
        const getUnitsByLessonIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM units WHERE lesson_id=?;",
                values: [unitDTO.lesson_id]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("lesson does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newunit = await getUnitsByLessonIdCMD;
            return new Result(newunit, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../Unitservice").unitDTO} unitDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updateUnit(unitDTO) {
        const updateUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE units SET unit_name=? WHERE unit_id=?;",
                values:[unitDTO.unit_name, unitDTO.unit_id]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateUnitCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

    /**
     * @param {import("../Unitservice").unitDTO} unitDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async deleteUnit(unitDTO) {
        const deleteUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM units WHERE unit_id=?;",
                values:[unitDTO.unit_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteUnitCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLUnitService;