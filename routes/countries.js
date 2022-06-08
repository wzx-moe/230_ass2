var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
var router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async function (req, res, next) {
    if (JSON.stringify(req.query) !== "{}") {
        res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
        return;
    }
    await req.db.select('country').from('data')
        .then((rows) => {
            return rows.map((data) => {
                return data.country;
            })
        })
        .then((countries) => {
            res.status(200).json(Array.from(new Set(countries)).sort());
        })
        .catch((Error) => {
            console.log(Error);
            next(createError(500, Error));
        })
}));

module.exports = router;
