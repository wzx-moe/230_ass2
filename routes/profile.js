var express = require('express');
const {json} = require("express");
const asyncHandler = require("express-async-handler");
const authorize = require("../authorize");
const createError = require("http-errors");
var router = express.Router();
const dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/;

/* GET home page. */
router.get('/:email/profile', authorize, asyncHandler(async function (req, res, next) {
    if (JSON.stringify(req.query) !== "{}") {
        res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
        return;
    }
    await req.db.select().from('users').where("email", req.params.email)
        .then((rows) => {
            return rows.map((data) => {
                return {
                    email: data.email,
                    firstName: data.firstname,
                    lastName: data.lastname,
                    dob: data.dob,
                    address: data.address
                }
            })
        })
        .then((rows) => {
            return rows.map((data) => {
                if (!req.auth || req.email !== req.params.email) {
                    delete data.dob;
                    delete data.address;
                }
                return data;
            })
        })
        .then((users) => {
            if (!users[0]) {
                res.status(404).json({
                    "error": true,
                    "message": "User not found"
                });
            }
            res.status(200).json(users[0]);
        })
        .catch((Error) => {
            console.log(Error);
            next(createError(500 , Error));
        })
}));

router.put('/:email/profile', authorize, asyncHandler(async function (req, res, next) {
    if (!req.auth) {
        res.status(401).json({
            error: true,
            message: "Authorization header ('Bearer token') not found"
        });
        return;
    }
    if (req.email !== req.params.email) {
        res.status(403).json({
            error: true,
            message: "Forbidden"
        });
        return;
    }
    if (JSON.stringify(req.query) !== "{}") {
        res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
        return;
    }
    if (!req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.address) {
        res.status(400).json({
            "error": true,
            "message": "Request body incomplete: firstName, lastName, dob and address are required."
        });
        return;
    }
    for (var key in req.body) {
        if (key !== "firstName" && key !== "lastName" && key !== "dob" && key !== "address") {
            res.status(400).json({
                "error": true,
                "message": "Request body incomplete: firstName, lastName, dob and address are required."
            });
            return;
        }
    }
    if (!(typeof (req.body.firstName) === 'string') || !(typeof (req.body.lastName) === 'string') || !(typeof (req.body.address) === 'string')) {
        res.status(400).json({
            "error": true,
            "message": "Request body invalid: firstName, lastName and address must be strings only."
        });
        return;
    }
    if (!dateFormat.test(req.body.dob) || (("0" + (new Date(req.body.dob).getDate().toString())).slice(-2) !== req.body.dob.substring(req.body.dob.length - 2))) {
        res.status(400).json({
            "error": true,
            "message": "Invalid input: dob must be a real date in format YYYY-MM-DD."
        });
        return;
    }
    if (Date.parse(req.body.dob) > Date.now()) {
        res.status(400).json({
            "error": true,
            "message": "Invalid input: dob must be a date in the past."
        });
        return;
    }
    await req.db("users").where({email: req.params.email}).update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        address: req.body.address
    })
        .then((rows) => {
            req.db.select().from('users').where("email", req.params.email)
                .then((rows) => {
                    return rows.map((data) => {
                        delete data.password;
                        return data;
                    })
                })
                .then((rows) => {
                    return rows.map((data) => {
                        return {
                            email: data.email,
                            firstName: data.firstname,
                            lastName: data.lastname,
                            dob: data.dob,
                            address: data.address
                        }
                    })
                })
                .then((users) => {
                    res.status(200).json(users[0]);
                })
        })
        .catch((Error) => {
            console.log(Error);
            next(createError(500 , Error));
        })
}));

module.exports = router;
