const { Result, IError } = require("../utility/Result");
const ModuleService = require("../ModuleService");

class MySQLModuleService extends ModuleService {
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
     * @param {import("../ModuleService").ModuleDTO} moduleDTO
     * @returns {Promise<Result<boolean>} 
     */
    async createModule(moduleDTO) {
        const createModuleCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO modules ( module_name, module_descrip, class_id) VALUES(?,?,?);",
                values:[ moduleDTO.module_name, moduleDTO.module_descrip, moduleDTO.class_id]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createModuleCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

    /**
     * @param {import("../ModuleService").ModuleDTO} moduleDTO
     * @returns {Promise<Result<import("../ModuleService").Module>>} 
     */
    async getModule(moduleDTO){
        /**
         * @type {Promise<import("../ModuleService").Module>}
         */
        const getModuleCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM modules WHERE module_id = ?;",
                values: [moduleDTO.module_id]
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
            const newModule = await getModuleCMD;
            return new Result(newModule, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../ModuleService").ModuleDTO} moduleDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updateModule(moduleDTO) {
        const updateModuleCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE modules SET module_name=? WHERE module_id=?;",
                values:[moduleDTO.module_name, moduleDTO.module_id]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateModuleCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

    /**
     * @param {import("../ModuleService").ModuleDTO} moduleDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async deleteModule(moduleDTO) {
        const deleteModuleCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM modules WHERE module_id=?;",
                values:[moduleDTO.module_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteModuleCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLModuleService;