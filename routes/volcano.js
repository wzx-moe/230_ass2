var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
const authorize = require("../authorize");
var router = express.Router();

/* GET home page. */
router.get('/:id', authorize, asyncHandler(async function (req, res, next) {
    if (JSON.stringify(req.query) !== "{}") {
        res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
        return;
    }
    await req.db.select().from('data').where("id", req.params.id)
        .then((rows) => {
            return rows.map((data) => {
                if (!req.auth) {
                    delete data.population_5km;
                    delete data.population_10km;
                    delete data.population_30km;
                    delete data.population_100km;
                }
                return data;
            })
        })
        .then((countries) => {
            if (!countries[0]) {
                res.status(404).json({"error": true, "message": "Volcano with ID: " + req.params.id + " not found."});
                return;
            }
            res.status(200).json(countries[0]);
        })
        .catch((Error) => {
            console.log(Error);
        })
}));

module.exports = router;
