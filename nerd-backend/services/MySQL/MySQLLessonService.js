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
                sql: "INSERT INTO lessons ( lesson_name, lesson_index, lesson_descrip, module_id, instructor_id) VALUES(?,?,?,?);",
                values:[ lessonDTO.lesson_name, lessonDTO.lesson_index, lessonDTO.lesson_descrip, lessonDTO.module_id, lessonDTO.user_id]
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
    async getLessonById(lessonDTO){
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
     * @param {import("../LessonService").lessonDTO} lessonDTO
     * @returns {Promise<Result<import("../LessonService").lesson>>} 
     */
    async getLessonByModule(lessonDTO){
        /**
         * @type {Promise<import("../LessonService").lesson>}
         */
        const getLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM Lessons WHERE module_id=?;",
                values: [lessonDTO.module_id]
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
            const newlessons = await getLessonCMD;
            return new Result(newlessons, null);

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
                sql:"update lessons set lesson_name=?, lesson_index=?, lesson_descrip=?, module_id=? where lesson_id=? and instructor_id=?;",
                values:[lessonDTO.lesson_name, lessonDTO.lesson_index, lessonDTO.lesson_descrip,  lessonDTO.module_id, lessonDTO.lesson_id, lessonDTO.user_id]
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
                sql:"delete from lessons where lesson_id=? and instructor_id=?;",
                values:[lessonDTO.lesson_id, lessonDTO.user_id]
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