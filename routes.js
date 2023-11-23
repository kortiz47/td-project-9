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
    //TODO
    
    //USER validations - all 400 errors
    /**
     * include validation to make sure the following required values are properly submitted
     * firstName
     * if(!user.firstName) - send a validation error - EXTRA: could also use regex in the User model under firstName to add more validation
     * if(!user.lastName) - same as firstName
     * if(!user.emailAddress) - same and in the model change STRING to isEmail
     * if(!user.password) - if there needs to be constraints on the password check for that
     */
}));

//==================================COURSE routes====================================
/** GET all courses and userId associated with it */
router.get('/courses', asyncHandler(async (req, res) => {
    const course = await Course.findAll();
    res.json(course);
}));

/** GET a specific course and userId associated with it */
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    res.json(course);
}))

/** POST a new course to /courses */
router.post('/courses', asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Course.create(req.body);
        console.log(course);
        //res.json(course);
        res.status(201).location(`/courses/${course.id}'`).end();
    } catch (error) {
        const errorMsgs = error.errors.map(error => error.message);
        res.status(500).json(errorMsgs);
    }
    //TO DO

    //COURSE validations
    /**
     * if(!course.title) - send error 400
     * if(!course.description) - send error 400
     */
}))

/** PUT (edit) an existing course */
router.put('/courses/:id', asyncHandler(async (req, res) => {
    let course;
    try {
        const id = req.params.id;
        course = await Course.findByPk(id);
    //COURSE validations
    /**
     * if(!course.title) - send error 400
     * if(!course.description) - send error 400
     * else you can send the correct status
     */
        if(course){
            course.update(req.body);
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        const errorMsgs = error.errors.map(error => error.message);
        res.status(500).json(errorMsgs);
    }
}));

/** DELETE an existing course */
router.delete('/courses/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    let course;
    try{
        course = await Course.findByPk(id);
        if(course){
            await course.destroy();
            res.status(204).end();
        }else{
            res.status(404).end();
        }
    }catch(error){

    }
}));
//==============================EXPORTS=======================================

module.exports = router;
