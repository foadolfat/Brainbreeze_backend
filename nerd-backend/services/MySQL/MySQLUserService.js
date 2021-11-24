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
     * @returns {Promise<Result<import("../UserService").User>>} 
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
        } catch(e) {
            console.log(e);
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }
}
module.exports = MySQLUserService;