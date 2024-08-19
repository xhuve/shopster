import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

export const protectRoutes = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt
    console.log("🚀 ~ protectRoutes ~ token:", token)

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            console.log(error)
            throw new Error('Unauthorized, Token failed')
        }
    } else {
        res.status(401)
        throw new Error('Unauthorized')
    }
})

export const adminRoutes = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Unauthorized, Admin only')
    }
})

