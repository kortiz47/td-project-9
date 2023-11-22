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
//==================================USER routes=====================================

/** GET all properties and values for the currently authenticated User */
router.get('/users', asyncHandler(async (req, res) => {
    const user = await User.findAll();
    res.json(user);
}));

/** POST route to create new user and location header to / */
router.post('/users', asyncHandler(async (req, res) => {
    let user;
    try {
        user = await User.build(req.body);
        res.redirect(201, '/');
    } catch (error) {
        const errorMsgs = error.errors.map(error => error.message);
        res.send(errorMsgs);
    }
}));

//==================================COURSE routes====================================
/** GET all courses and userId associated with it */
router.get('/courses', asyncHandler(async (req, res) => {
    const course = await Course.findAll();
    res.json(course);
}));

/** GET a specific course and userId associated with it */
router.get('/courses/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const course = await Course.findByPk(id);
    res.json(course);
}))


//==============================EXPORTS=======================================

module.exports = router;
