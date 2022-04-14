const { Result, IError } = require("../utility/Result");
const ProgressService = require("../ProgressService");

class MySQLProgressService extends ProgressService {
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
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>} 
     */
    async createProgress(progressDTO) {
        const createProgressCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO progress (user_id, unit_id, instructor_id, class_id, module_id, lesson_id, completed) VALUES(?,?,?,?,?,?,?);",
                values:[progressDTO.user_id, progressDTO.unit_id, progressDTO.instructor_id, progressDTO.class_id, progressDTO.module_id, progressDTO.lesson_id, progressDTO.completed]
            },
            (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const result = await createProgressCMD;
            if(result.affectedRows>0) return this.getLastInsert();
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

     /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     */
    async getProgressionCreationView(progressDTO) {
        const getProgressionCreationViewCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progression_creation where unit_id=?;",
                values:[progressDTO.unit_id]
            },
            (err, results) => {
                if(err) {
                    console.log("view failed to fetch...",err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const resulted = await getProgressionCreationViewCMD;
            if (resulted.length > 0) return new Result(resulted[0], null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }


    /**
     * @returns {Promise<Result<import("../ProgressService").Progress>>} 
     */
     async getLastInsert() {
        const getLastInsertCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE progress_id = (SELECT MAX(progress_id) FROM progress);"
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getLastInsertCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
        
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async updateProgress(progressDTO) {
        const updateProgressCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE progress SET completed = ? WHERE progress_id = ?;",
                values:[progressDTO.completed, progressDTO.progress_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const result = await updateProgressCMD;
            if(result.affectedRows>0) return this.getLastInsert();
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }   
    } 

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgress(progressDTO) {
        const getProgressCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE user_id = ? AND unit_id = ?",
                values:[progressDTO.user_id, progressDTO.unit_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUser(progressDTO) {
        const getProgressByUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE user_id = ?;",
                values:[progressDTO.user_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUserCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUnit(progressDTO) {
        const getProgressByUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE unit_id = ? and instructor_id=?;",
                values:[progressDTO.unit_id, progressDTO.instructor_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUnitCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }


    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressById(progressDTO) {
        const getProgressByIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE progress_id = ?",
                values:[progressDTO.id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByIdCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUserAndUnit(progressDTO) {
        const getProgressByUserAndUnitCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE user_id = ? AND unit_id = ?;",
                values:[progressDTO.user_id, progressDTO.unit_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUserAndUnitCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUserAndLesson(progressDTO) {
        const getProgressByUserAndLessonCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT unit_id, lesson_id, completed FROM progress WHERE user_id = ? AND lesson_id = ?;",
                values:[progressDTO.user_id, progressDTO.lesson_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUserAndLessonCMD;
            if(results.length>0) return new Result(results, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUserAndModule(progressDTO) {
        const getProgressByUserAndModuleCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT unit_id, module_id, completed FROM progress WHERE user_id = ? AND module_id = ?;",
                values:[progressDTO.user_id, progressDTO.module_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUserAndModuleCMD;
            if(results.length>0) return new Result(results, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByUserAndClass(progressDTO) {
        const getProgressByUserAndClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT unit_id, class_id, completed FROM progress WHERE user_id = ? AND class_id = ?;",
                values:[progressDTO.user_id, progressDTO.class_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByUserAndClassCMD;
            if(results.length>0) return new Result(results, null);
            else return new Result(false, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getInstructorId(progressDTO) {
        const getInstructorIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT instructor_id FROM progress WHERE progress_id = ?;",
                values:[progressDTO.id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getInstructorIdCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<import("../ProgressService").Progress>>}
    */
    async getProgressByInstructorId(progressDTO) {
        const getProgressByInstructorIdCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT * FROM progress WHERE instructor_id = ?;",
                values:[progressDTO.instructor_id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await getProgressByInstructorIdCMD;
            return new Result(results, null);
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }

    /**
     * @param {import("../ProgressService").ProgressDTO} progressDTO
     * @returns {Promise<Result<boolean>>}
    */
    async deleteProgress(progressDTO) {
        const deleteProgressCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM progress WHERE progress_id = ?;",
                values:[progressDTO.id]
            },
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await deleteProgressCMD;
            if(results.affectedRows > 0) {
                return new Result(true, null);
            } else {
                return new Result(false, new IError(404, "Progress not found"));
            }
        } catch(e) {
            return new Result(null, new IError(e.code, e.sqlMessage));
        }
    }
}
module.exports = MySQLProgressService;