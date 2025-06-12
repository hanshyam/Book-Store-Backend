import userModel from "../models/userModel.js";
import { generateJwtToken } from "../utils/generateJwtToken.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const user = await userModel.create({
      fullName,
      email,
      password,
    });
    if (user) {
      return res.status(201).json({
        success: true,
        userData: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not created" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    const token = generateJwtToken(user._id);

    return res.status(200).json({
      success: true,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user
export const checkUser = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const userData = user.toObject();
      delete userData.password;
      return res.status(200).json({ success: true, message: "User is authentic", userData });
    } else {
      return res.status(400).json({ success: false, message: "User is not verified" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



