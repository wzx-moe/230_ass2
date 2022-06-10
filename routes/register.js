var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.post('/', asyncHandler(async function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            "error": true,
            "message": "Request body incomplete, both email and password are required"
        });
        return;
    }
    await req.db("users").insert({"email": req.body.email, "password": bcrypt.hashSync(req.body.password, saltRounds)})
        .then((rows) => {
            res.status(201).json({"message": "User created"});
        })
        .catch((Error) => {
            console.debug(Error);
            res.status(409).json({
                "error": true,
                "message": "User already exists"
            });
        })
}));

module.exports = router;
