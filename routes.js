//PART OF EXPRESS SETUP
const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const { Op } = require('sequelize');

router.use(express.json());
// //body parser
// const bodyParser = require('body-parser');
// // parse application/x-www-form-urlencoded
// router.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
// router.use(bodyParser.json());

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
//come back and add try/catch if you need it
router.post('/users', asyncHandler(async (req, res) => {
    const errors = [];
    let user;
    try {
        user = await User.build(req.body);

        if (!user.firstName || '') {
            errors.push("Please provide a value for 'first name'");
        }
        if (!user.lastName || '') {
            errors.push("Please provide a value for 'last name'");
        }
        if (!user.emailAddress || '') {
            errors.push("Please provide a value for 'email address'");
        }
        if (!user.password || '') {
            errors.push("Please provide a value for 'password'");
        }

        if (errors.length > 0) {
            res.status(400).json({ errors }).end();
        } else {
            await user.save();
            res.status(201).location('/').end();
        }
    } catch (error) {
        const errors = error.errors.map(error => error.message);
        res.status(500).json(errors);
    }

}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (user) {
        await user.destroy();
        res.status(204).end();
    } else {
        res.status(404).end();
    }
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
    const errors = [];
    let course;
    try {
        course = await Course.build(req.body);

        if (!course.title || '') {
            errors.push("Please provide a value for 'title'");
        }
        if (!course.description || '') {
            errors.push("Please provide a value for 'description'");
        }

        if (errors.length > 0) {
            res.status(400).json({ errors }).end();
        } else {
            await course.save();
            res.status(201).location(`/courses/${course.id}'`).end();
        }
    } catch (error) {
        const errors = error.errors.map(error => error.message);
        res.status(500).json(errors);
    }

}))



/** PUT (edit) an existing course */
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const errors = [];
    const id = req.params.id;
    const course = await Course.findByPk(id);

    if (course) {
        await course.set({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            userId: req.body.userId
        })

        if (!course.title) {
            errors.push("Please provide a value for 'title'");
        }
        if (!course.description) {
            errors.push("Please provide a value for 'description'");
        }

        if (errors.length > 0) {
            res.status(400).json({ errors }).end();
        } else {
            await course.save();
            res.status(204).end();
        }

    } else {
        res.status(404).end();
    }


}));



/** DELETE an existing course */
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(404).end();
    }
}));


//==============================EXPORTS=======================================

module.exports = router;
