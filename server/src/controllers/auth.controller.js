import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
import { validate } from "../validations/validation.js";
import { signInValidate, signUpValidate, updateProvileValidate } from "../validations/authValidation.js";
import { compare } from "bcrypt";
import { errorHandler } from "../utils/error.js";
import cloudinary from 'cloudinary';
import { resizeImage } from "../utils/resizeImage.js";
import fs from 'fs';

dotenv.config();

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const maxAge = 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    const secret = process.env.JWT_KEY;
    if (!secret) {
        throw new Error("JWT_KEY is not defined");
    }
    const jwtExpiration = 24 * 60 * 60;
    return jwt.sign({ email, userId }, secret, { expiresIn: jwtExpiration });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validate(signUpValidate, req.body);

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return next(errorHandler(400, "Email has been taken"));
        }

        const newUser = new User({ email, password });

        const user = await newUser.save();
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
            message: "Successfully created account",
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validate(signInValidate, req.body);

        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, "Invalid password"));
        }

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
  
        // res.cookie("jwt", createToken(email, user._id), {
        //     maxAge: maxAge,
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        // });
  
        const {
            _id,
            email: emails,
            profileSetup,
            firstName,
            lastName,
            image,
            color,
        } = user._doc;
        
        
        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                _id,
                email: emails,
                profileSetup,
                firstName,
                lastName,
                image,
                color,
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserData = async (req, res, next) => {
    try {
        const userId = req.userId;
    
        const user = await User.findById(userId).select("-password");
  
        if (!user) {
            return next(errorHandler(404, "User not found."));
        }
        
        user.id = userId;
        const { password, ...rest } = user._doc;
        return res.status(200).json({
            success: true,
            message: "success get data",
            user: rest,
        });
    } catch (error) {
        next(error);
    }
};

export const addProfileImage = async (req, res, next) => {
    if (!req.file) {
        return next(errorHandler(400, "File is required."));
    }

    const file = req.file;
    const filePath = file.path;

    try {
        // Resize the image
        console.log('Original file path:', filePath); // Debug log
        const resizedFilePath = await resizeImage(filePath);
        console.log('Resized file path:', resizedFilePath); // Debug log


        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(resizedFilePath, {
            folder: 'profiles',
            public_id: `profile_${Date.now()}`,
            resource_type: 'image',
        });

        const userUpdate = await User.findByIdAndUpdate(
            req.userId,
            { image: result.secure_url },
            { new: true, runValidators: true }
        );

        // Clean up local files
        fs.unlinkSync(filePath);
        fs.unlinkSync(resizedFilePath);

        return res.status(200).json({
            success: true,
            message: "Successfully uploaded profile image",
            image: userUpdate.image,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return next(error);
    }
};


export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
    
        validate(updateProvileValidate, req.body);
    
        const user = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
            { new: true, runValidators: true }
        );
        const { password, ...rest } = user._doc;
    
        res
            .status(200)
            .json({ success: true, message: "Successfuly save changes", user:rest });
    } catch (error) {
        next(error);
    }
};


export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        if (!user) {
            return  next(errorHandler(404, "User is not found"));
        }
  
        user.image = null;
  
        await user.save();
  
        res
            .status(200)
            .json({ success: true, message: "Successfully remove image" });
    } catch (error) {
        next(error);
    }
};



export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 1,
            secure: true,
            sameSite: "None",
        });
  
        res.status(200).json({ success: true, message: "Succsesfully logout." });
    } catch (error) {
        next(error);
    }
  };
  