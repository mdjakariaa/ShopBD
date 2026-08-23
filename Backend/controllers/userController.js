import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


// Route for user login
const loginUser = async (req, res) => {
  try {
    // getting email and password from request body
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    // checking if user exists or not
    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exists",
      });
    }

    // checking if the password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id); //creating a token for the user using their ID

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred while logging in user",
    });
  }
};


// Route for user register
const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // checking user already exists or not
      const exists = await userModel.findOne({ email });

      if (exists) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      // validating email format & strong password
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter a valid email",
        });
      }

      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Please enter a strong password",
        });
      }

      // hashing user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      // creating new user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
      });

      const user = await newUser.save();

      const token = createToken(user._id); //user._id means the user's ID

      res.json({
        success: true,
        token,
      });


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occurred while registering user",
        });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
      });
      
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { loginUser, registerUser, adminLogin };
