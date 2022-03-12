var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/utility/ServiceLocator");
const AuthService = require("../services/utility/AuthService");

const UnitService = require("../services/UnitService");

//unit routes
router
    .use(function timeLog(req, res, next) {
        console.log('Access unit route Time: ', Date.now());
        next();
    })

    .post("/api/unit", async(req, res) => {
        /**
         * @type {UnitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);

        try{
            const { payload: message, error } = await unitService.createUnit(req.body);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json({message: message});
            }
        }catch(e){
            console.log("An error occured in unitRoutes, post/unit");
            res.status(500).end();
        }
        
        
    })

    .get("/api/unit/:id", async(req, res) => {

        /**
         * @type {UnitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: unit, error } = await unitService.getUnit(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            unit_id:unit.unit_id,
                            unit_name:unit.unit_name,
                            unit_content:unit.unit_content,
                            lessson_id:unit.lesson_id
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in unitRoutes, get/unit");
            res.status(500).end();
        }

    })


    .put("/api/unit/:id", async(req, res) => {

        /**
         * @type {unitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: message, error } = await unitService.updateUnit(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json({message: message});
            }
        }catch(e){
            console.log("an error occured in unitRoutes, put/unit");
            res.status(500).end();
        }

    })


    .delete("/api/unit/:id", async(req, res) => {

        /**
         * @type {unitService}
         */
        const unitService = ServiceLocator.getService(UnitService.name);
        req.body.unit_id = req.params.id;
        try{
            
            const { payload: message, error } = await unitService.deleteUnit(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: message
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in unitRoutes, delete/unit");
            res.status(500).end();
        }

    });

module.exports = router;