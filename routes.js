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
/** GET all properties and values for the currently authenticated User */
router.get('/users', asyncHandler(async (req, res) => {
    let user = await User.findAll();
    res.json(user);
}));

router.post('/users', asyncHandler(async(req, res)=>{
    let user;
    try{
        user =  await User.build(req.body);
        res.redirect(201, '/');
    }catch(error){
        const errorMsgs = error.errors.map(error => error.message);
        res.send(errorMsgs);
    }
}));
// router.post('/users', asyncHandler(async(req, res)=>{
//     console.log(req.body);
//     try{
//         let user;
//         user = await User.create(req.body);
//         res.status(201).end();
//     }catch(error){
//         res.send(error);
//     }
    
    
// }));

//==============================EXPORTS=======================================

module.exports = router;
