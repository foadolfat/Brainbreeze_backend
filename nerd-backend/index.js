const express = require("express");
const ServiceLocator = require("./services/utility/ServiceLocator");

const MySQLUserService = require("./services/MySQL/MySQLUserService");
const MySQLClassService = require("./services/MySQL/MySQLClassService");
const MySQLModuleService = require("./services/MySQL/MySQLModuleService");
const MySQLLessonService = require("./services/MySQL/MySQLLessonService");
const MySQLUnitService = require("./services/MySQL/MySQLUnitService");
const MySQLQuizService = require("./services/MySQL/MySQLQuizService");

const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");
const LessonService = require("./services/LessonService");
const ModuleService = require("./services/ModuleService");
const UnitService = require("./services/UnitService");
const QuizService = require("./services/QuizService");

const app = express();
app.use(require('cors')());
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(require(`./routes/userRoutes`));
app.use(require(`./routes/classRoutes`));
app.use(require('./routes/lessonRoutes'));
app.use(require('./routes/moduleRoutes'));
app.use(require('./routes/unitRoutes'));
app.use(require('./routes/quizRoutes'));

const databaseSetup = async () => {
    
    try{
        const connection = require("mysql").createPool({
            connectionLimit : 100,
            host: "localhost",
            user:"root",
            password:"password",
            database:"nerdjs"
        });

        
        const userService = new MySQLUserService(connection);
        const classService = new MySQLClassService(connection);
        const lessonService = new MySQLLessonService(connection);
        const moduleService = new MySQLModuleService(connection);
        const unitService = new MySQLUnitService(connection);
        const quizService = new MySQLQuizService(connection);

        await userService.init();
        await classService.init();
        await moduleService.init();
        await lessonService.init();
        await unitService.init();
        await quizService.init();

        ServiceLocator.setService(UserService.name, userService);
        ServiceLocator.setService(ClassService.name, classService);
        ServiceLocator.setService(ModuleService.name, moduleService);
        ServiceLocator.setService(LessonService.name, lessonService);
        ServiceLocator.setService(UnitService.name, unitService);
        ServiceLocator.setService(QuizService.name, quizService);

        console.log("UserService initialized");
        console.log("ClassService initialized");
        console.log("ModuleService initialized");
        console.log("LessonService initialized");
        console.log("UnitService initialized");
        console.log("QuizService initialized");
        console.log("Database set up complete");
    } catch(e){
        console.log(e);
        throw new Error("Failed to setup database.");
    }
    
    
};



const main = () => {

    app.listen(PORT, () => {
        console.log(`listening on *:${PORT}`);
    });
};

(
    async () => {
        try{
            await databaseSetup();
            main();
        }catch(e){
            console.log(e);
            process.exit(-1);
        }
    }
    
)();