const express = require("express");
const ServiceLocator = require("./services/utility/ServiceLocator");

const MySQLUserService = require("./services/MySQL/MySQLUserService");
const MySQLClassService = require("./services/MySQL/MySQLClassService");
// const MySQLUserService = require("./services/MySQL/MySQLUserService");
// const MySQLUserService = require("./services/MySQL/MySQLUserService");

const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");

const app = express();
app.use(require('cors')());
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(require(`./routes/userRoutes`));
app.use(require(`./routes/classRoutes`));


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

        await userService.init();
        await classService.init();

        ServiceLocator.setService(UserService.name, userService);
        ServiceLocator.setService(ClassService.name, classService);

        console.log("UserService initialized");
        console.log("ClassService initialized");
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