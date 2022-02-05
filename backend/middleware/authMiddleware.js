import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"

const protect = asyncHandler(async (request, response, next) => {
    let token
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        try {
            token = request.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
            request.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            console.error(error)
            response.status(401)
            throw new Error("Not authorized, token failed")
        }
    }
    if (!token) {
        response.status(401)
        throw new Error("Not authorized, no token")
    }
})

const admin = (request, response, next) => {
    if (request.user && request.user.isAdmin) {
        next()
    }
    else {
        response.status(401)
        throw new Error("Not authorized as an admin")
    }
}

export {protect, admin}