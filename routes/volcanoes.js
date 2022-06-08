var express = require('express');
const {json} = require("express");
var router = express.Router();
const asyncHandler = require('express-async-handler')

/* GET home page. */
router.get('', asyncHandler(async function (req, res, next) {
    if (!req.query.country) {
        res.status(400).json({"error": true, "message": "Country is a required query parameter."});
        return;
    }
    for (var key in req.query) {
        if (key !== "country" && key !== "populatedWithin") {
            res.status(400).json({
                "error": true,
                "message": "Invalid query parameters. Only country and populatedWithin are permitted."
            });
            return;
        }
    }
    if ((req.query.populatedWithin) && (req.query.populatedWithin !== "5km") && (req.query.populatedWithin !== "10km") && (req.query.populatedWithin !== "30km") && (req.query.populatedWithin !== "100km")) {
        res.status(400).json({
            "error": true,
            "message": "Invalid value for populatedWithin. Only: 5km,10km,30km,100km are permitted."
        });
        return;
    }
    if (!req.query.populatedWithin) {
        await req.db.select("id", "name", "country", "region", "subregion").from('data').where("country", req.query.country)
            .then((rows) => {
                res.status(200).json(rows);
            })
            .catch((Error) => {
                console.log(Error);
            })
    } else {
        await req.db.select("id", "name", "country", "region", "subregion", "population_" + req.query.populatedWithin).from('data').where("country", req.query.country)
            .then((rows) => {
                const populatedWithin = "population_" + req.query.populatedWithin
                return rows.map((row) => {
                    if (row[populatedWithin] > 0) {
                        delete row[populatedWithin];
                        return row;
                    }
                }).filter(d => d)
            })
            .then((rows) => {
                res.status(200).json(rows);
            })
            .catch((Error) => {
                console.log(Error);
            })
    }

}));

module.exports = router;
