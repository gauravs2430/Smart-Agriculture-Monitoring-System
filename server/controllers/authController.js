const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to set cookie
const sendToken = (user, statusCode, res) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret_agro_token',
        { expiresIn: 360000 }, // 100 hours approx
        (err, token) => {
            if (err) throw err;

            // Cookie options
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                httpOnly: true,
                // secure: true, // Only for HTTPS (enable in production)
                // sameSite: 'None' // If cross-site
            };

            res.status(statusCode)
                .cookie('token', token, options)
                .json({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
        }
    );
};

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        sendToken(user, 201, res);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Server Error: ' + err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
        }

        sendToken(user, 200, res);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Server Error: ' + err.message });
    }
};

// Logout User
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
};

// Get Current User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
