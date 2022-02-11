const { Result, IError } = require("../utility/Result");
const Lessonservice = require("../LessonService");

class MySQLLessonservice extends LessonService {
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
                sql: "INSERT INTO Lessons (lesson_id, lesson_name, lesson_descrip, module_id) VALUES(?,?,?,?);",
                values:[lessonDTO.lesson_id, lessonDTO.lesson_name, lessonDTO.lesson_descrip, lessonDTO.module_id]
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
                sql:"SELECT *, CAST(lesson_name as CHAR) as lesson_name FROM Lessons WHERE id=?;",
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
            const newlesson = await getlessonCMD;
            return new Result(newlesson, null);

        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

        /**
     * @param {import("../Lessonservice").lessonDTO} lessonDTO
     * @returns {Promise<Result<boolean>>} 
     */
    async updatelesson(lessonDTO) {
        const updateUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE Lessons SET name=? WHERE id=?;",
                values:[lessonDTO.name, lessonDTO.id]
            },
            (err, results) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updatelessonCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
           
    }

     /**
     * @param {lessonDTO
     * @returns {Promise<Result<boimport("../Lessonservice").lessonDTO} olean>>}
     */
    async deleteLesson(lessonDTO) {
        const deleteLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM lessons WHERE id=?;",
                values:[LessonsDTO.lesson_id]
            },
            (err, results) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deletelessonCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {
			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

}
lesson.exports = MySQLLessonservice;