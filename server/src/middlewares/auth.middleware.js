import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return next(errorHandler(401,  "You are not authenticated, Please log out to continue."))
        
    }
  
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
            res.clearCookie("jwt");
            return next(errorHandler(401, "Token is invalid"));
        }
  
        req.userId = payload.userId;
        next();
    });
  };