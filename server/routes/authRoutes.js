const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', authController.logout);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, authController.getMe);

module.exports = router;
