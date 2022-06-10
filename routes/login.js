var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require("http-errors");
const secretKey = "SUPER SECRET KEY DO NOT STEAL";

/* GET home page. */
router.post('/', asyncHandler(async function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            "error": true,
            "message": "Request body incomplete, both email and password are required"
        });
        return;
    }
    await req.db.select('password').from('users').where({email: req.body.email})
        .then((rows) => {
            if (!rows[0] || !bcrypt.compareSync(req.body.password, rows[0].password)) {
                res.status(401).json({
                    "error": true,
                    "message": "Incorrect email or password"
                });
                return;
            }
            const email = req.body.email
            const expires_in = 60 * 60 * 24;
            const exp = Date.now() + expires_in * 1000;
            const token = jwt.sign({email, exp}, secretKey);

            res.status(200).json({
                token,
                token_type: "Bearer",
                expires_in
            });
        })
        .catch((Error) => {
            console.debug(Error);
            next(createError(500, Error));
        })
}));


module.exports = router;
