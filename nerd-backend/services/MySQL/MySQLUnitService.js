const { Result, IError } = require("../utility/Result");
const UnitService = require("../UnitService");

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
     * @returns {Promise<Result<boolean>} 
     */
    async createUnit(unitDTO) {
        const createUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO units ( unit_name, unit_content, lesson_id) VALUES(?,?,?);",
                values:[unitDTO.unit_name, unitDTO.unit_content, unitDTO.lesson_id]
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
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
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
                    var err = new Error("User does not exist!");
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
                sql: "DELETE FROM Units WHERE unit_id=?;",
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