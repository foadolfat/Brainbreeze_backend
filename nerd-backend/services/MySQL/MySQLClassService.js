const { Result, IError } = require("../utility/Result");
const ClassService = require("../ClassService");

class MySQLClassService extends ClassService {
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
     * @param {import("../ClassService").ClassDTO} classDTO
     * @returns {Promise<Result<boolean>} 
     */
    async createClass(classDTO) {
        const createClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO classes (class_id, class_name, class_descrip, user_class) VALUES(?,?,?,?);",
                values:[classDTO.class_id, classDTO.class_name, classDTO.class_descrip, classDTO.user_class]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createClassCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

    /**
     * @param {import("../ClassService").ClassDTO} classDTO
     * @returns {Promise<Result<import("../ClassService").Class>>} 
     */
    async getClass(classDTO){
        /**
         * @type {Promise<import("../ClassService").Class>}
         */
        const getClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
			/* maybe change this later*/ 
                sql:"SELECT * FROM classes WHERE class_id=? and user_class=?;",
                values: [classDTO.class_id, classDTO.user_class]
            }, (err, results) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    var err = new Error("Class does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newClass = await getClassCMD;
            return new Result(newClass, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../ClassService").ClassDTO} classDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updateClass(classDTO) {
        const updateClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                // currently only updating class name
                sql: "UPDATE classes SET class_name=? WHERE class_id=? and user_class=?;",
                values:[classDTO.class_name, classDTO.class_id, classDTO.user_class]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateClassCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

     /**
     * @param {import("../ClassService").ClassDTO} classDTO
     * @returns {Promise<Result<boolean>>}
     */
    async deleteClass(classDTO) {
        const deleteClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM classes WHERE class_id=? and user_class=?;",
                values:[classDTO.class_id, classDTO.user_class]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteClassCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLClassService;