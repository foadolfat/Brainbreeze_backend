const { Result, IError } = require("../utility/Result");
const UserService = require("../UserService");

class MySQLUserService extends UserService {
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
     * @param {import("../UserService").UserDTO} userDTO
     * @returns {Promise<Result<boolean>} 
     */
    async createUser(userDTO) {
        const createUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO user_table (user_name, user_email, user_password, user_type) VALUES(?,?,?,?);",
                values:[userDTO.user_name, userDTO.user_email, userDTO.user_password, userDTO.user_type]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createUserCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

        /**
     * @param {import("../UserService").UserDTO} userDTO
     * @returns {Promise<Result<import("../UserService").User>>} 
     */
    async getUserByEmail(userDTO){
        /**
         * @type {Promise<import("../UserService").User>}
         */
        console.log(userDTO);
        const getUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
			/* maybe change this later*/ 
                sql:"SELECT * FROM user_table WHERE user_email=?;",
                values: [userDTO.user_email]
            }, (err, results) => {
                console.log(results);
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
            const newUser = await getUserCMD;
            return new Result(newUser, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../UserService").UserDTO} userDTO
     * @returns {Promise<Result<import("../UserService").User>>} 
     */
    async getUserById(userDTO){
        /**
         * @type {Promise<import("../UserService").User>}
         */
        const getUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
			/* maybe change this later*/ 
                sql:"SELECT * FROM user_table WHERE user_id=?;",
                values: [userDTO.user_id]
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
            const newUser = await getUserCMD;
            return new Result(newUser, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../UserService").UserDTO} userDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updateUser(userDTO) {
        const updateUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE user_table SET user_name=?, user_type=? WHERE user_id=?;",
                values:[userDTO.user_name, userDTO.user_type, userDTO.user_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateUserCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

     /**
     * @param {import("../UserService").UserDTO} userDTO
     * @returns {Promise<Result<boolean>>}
     */
    async deleteUser(userDTO) {
        const deleteUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM user_table WHERE user_id=?;",
                values:[userDTO.user_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteUserCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLUserService;