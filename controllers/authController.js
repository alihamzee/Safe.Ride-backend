const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
    try {
        const {userID,email,password,phone} = req.body;
        if (!userID || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingEmail = await User.findOne({
            email
        });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }
        const existingUserID = await User.findOne({
            userID
        });

        if (existingUserID) {
            return res.status(400).json({
                success: false,
                message: "User ID already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = await User.create({userID,email,password: hashedPassword,phone,role: "parent"});
        res.status(201).json({
            success: true,
            message: "Parent registered successfully!",
            data: {
                id: newUser._id,
                userID: newUser.userID,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            data: {
                id: user._id,
                userID: user.userID,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isActive: user.isActive
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled."
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile accessed successfully!",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {register,login,getProfile};