var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (JSON.stringify(req.query) !== "{}") {
        res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
        return;
    }

    res.status(200).json({
        "name": "Zixuan Wang",
        "student_number": "n11152176"
    });
});


module.exports = router;
