//PART OF EXPRESS SETUP
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const { Op } = require("sequelize");

//=============================TRY/CATCH HANDLER=============================
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error);
        }
    }
}
//==================================ROUTES=====================================

router.get('/users', asyncHandler(async (req, res) => {
    //res.send('route works')
    let user = await User.findAll();
    console.log(user);
    res.send(user);
}));

module.exports = router;