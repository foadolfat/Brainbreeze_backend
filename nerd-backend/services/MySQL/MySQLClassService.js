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
                values:[userDTO.class_id, userDTO.class_name, userDTO.class_descrip, userDTO.user_class]
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
     * @returns {Promise<Result<import("../ClassService").User>>} 
     */
    async getClass(classDTO){
        /**
         * @type {Promise<import("../ClassService").User>}
         */
        const getClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
			/* maybe change this later*/ 
                sql:"SELECT *, CAST(class_name as CHAR) as class_name FROM classes WHERE class_name=? ",
                values: [userDTO.class_name]
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
            const newClass = await getClassCMD;
            return new Result(newUser, null);

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
                sql: "UPDATE classes SET class_name=? WHERE class_id=?;",
                values:[userDTO.class_name, userDTO.class_id]
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
                sql: "DELETE FROM classes WHERE class_id=?;",
                values:[userDTO.class_id]
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