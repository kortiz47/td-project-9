//PART OF EXPRESS SETUP
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const { Op } = require("sequelize");
//body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

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
    console.log(req.body);
    let user;
    try {
        user = await User.create(req.body);
        res.status(201).location('/').end();
    } catch (error) {
        const errorMsgs = error.errors.map(error => error.message);
        res.status(500).json(errorMsgs);
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

/** POST a new course to /courses */
router.post('/courses', asyncHandler(async(req, res)=>{
    let course;
    try{
        course = await Course.create(req.body);
        console.log(course);
        //res.json(course);
        res.status(201).location(`/courses/${course.id}'`).end();
    }catch(error){
        const errorMsgs = error.errors.map(error => error.message);
        res.status(500).json(errorMsgs);
    }
}))
//==============================EXPORTS=======================================

module.exports = router;
