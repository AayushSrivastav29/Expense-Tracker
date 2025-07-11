const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/find' , userController.findUser);
router.post('/create' , userController.createUser);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/resetpassword/:id', userController.resetPassword);
router.patch('/updatepassword', userController.updateUser);
module.exports= router;