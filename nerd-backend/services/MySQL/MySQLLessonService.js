const { Result, IError } = require("../utility/Result");
const LessonService = require("../LessonService");

class MySQLLessonService extends LessonService {
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
     * @param {import("../LessonService").lessonDTO} lessonDTO
     * @returns {Promise<Result<boolean>} 
     */
    async createLesson(lessonDTO) {
        const createLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO lessons ( lesson_name, lesson_descrip, module_id) VALUES(?,?,?);",
                values:[ lessonDTO.lesson_name, lessonDTO.lesson_descrip, lessonDTO.module_id]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await createLessonCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

    /**
     * @param {import("../LessonService").lessonDTO} lessonDTO
     * @returns {Promise<Result<import("../LessonService").lesson>>} 
     */
    async getLesson(lessonDTO){
        /**
         * @type {Promise<import("../LessonService").lesson>}
         */
        const getLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM Lessons WHERE lesson_id=?;",
                values: [lessonDTO.lesson_id]
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
            const newlesson = await getLessonCMD;
            return new Result(newlesson, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../Lessonservice").lessonDTO} lessonDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updateLesson(lessonDTO) {
        const updateLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE Lessons SET lesson_name=? WHERE lesson_id=?;",
                values:[lessonDTO.lesson_name, lessonDTO.lesson_id]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateLessonCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

    /**
     * @param {import("../Lessonservice").lessonDTO} lessonDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async deleteLesson(lessonDTO) {
        const deleteLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM lessons WHERE lesson_id=?;",
                values:[lessonDTO.lesson_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteLessonCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
module.exports = MySQLLessonService;