const { Result, IError } = require("../utility/Result");
const QuizService = require("../QuizService");

class MySQLQuizService extends QuizService {
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
     * @param {import("../QuizService").quizDTO} quizDTO
     * @returns {Promise<Result<boolean>} 
     */
    async createQuiz(quizDTO) {
        const createQuizCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO quizzes (quiz_index, quiz_name, quiz_type, quiz_content, quiz_answers, unit_id) VALUES(?,?,?,?,?,?);",
                values:[quizDTO.quiz_index, quizDTO.quiz_name, quizDTO.quiz_type, quizDTO.quiz_content, quizDTO.quiz_answers, quizDTO.unit_id]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createQuizCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

    /**
     * @param {import("../QuizService").quizDTO} quizDTO
     * @returns {Promise<Result<boolean>} 
     */
    async getquiz(quizDTO){
        /**
         * @type {Promise<import("../QuizService").quiz>}
         */
        const getQuizCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM Quizs WHERE quiz_id=?;",
                values: [quizDTO.quiz_id]
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
            const newQuiz = await getQuizCMD;
            return new Result(newquiz, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }
/*   "Update may require different parameters to update properly"
    /**
     * @param {import("../QuizService").quizDTO} quizDTO
     * @returns {Promise<Result<boolean>} 
     *//*
    async updateQuiz(quizDTO) {
        const updateQuizCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE Quizs SET quiz_name=? WHERE quiz_id=?;",
                values:[quizDTO.quiz_name, quizDTO.quiz_id]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateQuizCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }
*/
    /**
     * @param {import("../QuizService").quizDTO} quizDTO
     * @returns {Promise<Result<boolean>} 
     */
    async deleteQuiz(quizDTO) {
        const deleteQuizCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM Quizs WHERE quiz_id=?;",
                values:[quizDTO.quiz_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteQuizCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLQuizService;