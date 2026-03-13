const { Router } = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require("config")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")

const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Min password length is 6 symbols").isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect login or password during registration"
                })
            }
            
            const { email, password } = req.body

            const currUser = await User.findOne({ where: { email } })
            if (currUser) {
                return res.status(400).json({ message: "This user already exists" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            
            const user = await User.create({
                email,
                password: hashedPassword
            })

            res.status(201).json({ 
                message: "User created successfully",
                userId: user.id 
            })
            
        } catch (e) {
            res.status(500).json({ message: "Registration error", error: e.message })
        }
    }
)




// /api/auth/login


router.post(

)