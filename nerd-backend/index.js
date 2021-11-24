const express = require("express");
const ServiceLocator = require("./services/utility/ServiceLocator");

const MySQLUserService = require("./services/MySQL/MySQLUserService");

const UserService = require("./services/UserService");

const app = express();
app.use(require('cors')());
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(require(`./routes/UserRoutes`));

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

        await userService.init();

        ServiceLocator.setService(UserService.name, userService);

        console.log("UserService initialized");
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