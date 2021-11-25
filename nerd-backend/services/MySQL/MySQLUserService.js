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
                sql: "INSERT INTO users (name, email, password) VALUES(?,?,?);",
                values:[userDTO.name, userDTO.email, userDTO.password]
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
    async getUser(userDTO){
        /**
         * @type {Promise<import("../UserService").User>}
         */
        const getUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT *, CAST(password as CHAR) as password FROM users WHERE id=? OR email=?;",
                values: [userDTO.id, userDTO.email]
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
                sql: "UPDATE users SET name=? WHERE id=?;",
                values:[userDTO.name, userDTO.id]
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
                sql: "DELETE FROM users WHERE id=?;",
                values:[userDTO.id]
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