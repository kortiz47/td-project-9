'use strict';

const express = require('express');
const router = express.Router();

const User = require('./models').User;
const Course = require('./models').Course;

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

router.use(express.json());

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

//============================AUTHENTICATION MIDDLEWARE=======================
const authenticateUser = async (req, res, next) => {
    let message;
    let user;
    const credentials = auth(req);
    if (credentials) {
        user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${user.emailAddress}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
}

//==================================USER routes=====================================

/** GET all properties and values for the currently authenticated User */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll({
        where: {
            emailAddress: req.currentUser.emailAddress,
        },
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
        },
    });
    res.json(users);
}));



/** POST route to create new user and location header to / */
router.post('/users', asyncHandler(async (req, res) => {
    const errors = [];
    let user;
    try {
        user = await User.build(req.body);

        if (!user.firstName) {
            errors.push("Please provide a value for 'first name'");
        }
        if (!user.lastName) {
            errors.push("Please provide a value for 'last name'");
        }
        if (!user.emailAddress) {
            errors.push("Please provide a value for 'email address'");
        }
        if (!user.password) {
            errors.push("Please provide a value for 'password'");
        }

        if (errors.length > 0) {
            res.status(400).json({ errors }).end();
        } else {
            await user.save();
            res.status(201).location('/').end();
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json(errors);
        } else {
            throw error;
        }
    }
}));

//==================================COURSE routes====================================
/** GET all courses and userId associated with it */
router.get('/courses', asyncHandler(async (req, res) => {
    const course = await Course.findAll({
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'],
            }
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.json(course);
}));



/** GET a specific course and userId associated with it */
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id, {
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'],
            }
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.json(course);
}))



/** POST a new course to /courses */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
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
            res.status(201).location(`/courses/${course.id}`).end();
        }
    } catch (error) {
        const errors = error.errors.map(error => error.message);
        res.status(500).json(errors);
    }

}))



/** PUT (edit) an existing course */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const errors = [];
    const user = req.currentUser.id;
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (course) {
        if (course.userId == user) {
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
            res.status(403).end();
        }
    } else {
        res.status(404).end();
    }


}));



/** DELETE an existing course */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    const user = req.currentUser.id;
    if (course) {
        if (course.userId == user) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(404).end();
    }
}));


//==============================EXPORTS=======================================

module.exports = router;
