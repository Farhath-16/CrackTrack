const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { db, admin } = require("../config/firebase");


// =================================================
// SIGNUP
// =================================================

const signup = async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Check if user already exists

        const existingUser = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        if (!existingUser.empty) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user object

        const userData = {

            email,
            password: hashedPassword,
            createdAt: new Date(),
            fcmToken: ""

        };

        // Store in Firestore

        const response = await db
            .collection("users")
            .add(userData);

        res.status(201).json({

            message: "User created successfully",

            userId: response.id

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// =================================================
// LOGIN
// =================================================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user from Firestore

        const snapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        if (snapshot.empty) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        // Get first matching document

        const userDoc = snapshot.docs[0];

        const user = userDoc.data();

        // Compare password

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        // Generate JWT token

        const token = jwt.sign(

            {

                id: userDoc.id,
                email: user.email

            },

            process.env.JWT_SECRET_KEY,

            {

                expiresIn: "1h"

            }

        );

        res.status(200).json({

            message: "Login successful",

            token,
            email: user.email

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


const changePassword = async (req, res) => {
    console.log("changePassword hit");

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({
                message:
                    "Current password and new password are required"
            });

        }

        const userId =
            req.user.id;

        const userDoc =
            await db
                .collection("users")
                .doc(userId)
                .get();

        if (!userDoc.exists) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const user =
            userDoc.data();

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message:
                    "Current password is incorrect"
            });

        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await db
            .collection("users")
            .doc(userId)
            .update({
                password:
                    hashedPassword
            });

        res.status(200).json({
            message:
                "Password updated successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


module.exports = {

    signup,
    login,
    changePassword

};