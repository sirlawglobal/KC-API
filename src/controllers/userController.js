const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {createUserVallidation, loginVallidation, emailVallidation,passwordResetVallidation, updateUserValidation} = require('../vallidation/userVallidation');
const nodemailer = require('nodemailer');
require('dotenv').config();



exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginVallidation.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map((err) => err.message) });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// exports.registerUser = async (req, res) => {
//   const { 
//     name, email, password,username, role, phone, address, dateOfBirth, 
//     department, position, hireDate, skills, certifications, emergencyContact 
//   } = req.body; 

//   const { error } = createUserVallidation.validate(req.body, { abortEarly: false });
//   if (error) {
//     return res.status(400).json({ error: error.details.map((err) => err.message) });
//   }

//   try {

//     const emailExists = await User.findOne({ email });
//     if (emailExists) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // Check if username already exists
//     const usernameExists = await User.findOne({ username });
//     if (usernameExists) {
//       return res.status(400).json({ error: 'Username already in use' });
//     }


//     // Create a new user, including the certifications array
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       role,
//       username,
//       phone,
//       address,
//       dateOfBirth,
//       department,
//       position,
//       hireDate,
//       skills,
//       certifications, // This will handle the array of certifications
//       emergencyContact 
//     });

    
//     const verificationToken = crypto.randomBytes(20).toString("hex");
//     const tokenExpiration = Date.now() + 3600000;

//     await User.updateVerificationToken(email, verificationToken, tokenExpiration);

//     const verificationLink = `http://datingfrontend.dgn128.pro/verify-email?email=${email}&token=${verificationToken}`;
//     const message = {
//       from: "akanjilawrence9999@gmail.com",
//       to: email,
//       subject: "Account Verification",
//       html: `
//         <p>Hello ${username},</p>
//         <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
//         <p><a href="${verificationLink}">Verify your email</a></p>
//         <p>If you did not sign up for an account, please ignore this email.</p>
//         <p>Best regards,</p>
//         <p>Your App Team</p>
//       `,
//     };

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "akanjilawrence9999@gmail.com",
//         pass: "wgjg ifns xnvq ponr",
//       },
//     });

//     await transporter.sendMail(message);

//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error creating user' });
//   }
// };


exports.registerUser = async (req, res) => {
  const { 
    name, email, password, username, role, phone, address, dateOfBirth, 
    department, position, hireDate, skills, certifications, emergencyContact 
  } = req.body; 

  const { error } = createUserVallidation.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map((err) => err.message) });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      username,
      phone,
      address,
      dateOfBirth,
      department,
      position,
      hireDate,
      skills,
      certifications,
      emergencyContact,
    });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const tokenExpiration = Date.now() + 3600000;

    // Update the user with verification token and expiration
    await User.updateOne(
      { email },
      { $set: { verificationToken, tokenExpiration } }
    );

    const verificationLink = `http://datingfrontend.dgn128.pro/verify-email?email=${email}&token=${verificationToken}`;
    const message = {
      from: "akanjilawrence9999@gmail.com",
      to: email,
      subject: "Account Verification",
      html: `
        <p>Hello ${username},</p>
        <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">Verify your email</a></p>
        <p>If you did not sign up for an account, please ignore this email.</p>
        <p>Best regards,</p>
        <p>Your App Team</p>
      `,
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "akanjilawrence9999@gmail.com",
        pass: "wgjg ifns xnvq ponr",
      },
    });

    await transporter.sendMail(message);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

exports.verifyEmail = (req, res) => {
  const { token } = req.query;

  // Check if token exists
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  User.findUserByVerificationToken(token)
  .then((user) => {
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    if (Date.now() > user.verification_token_expiry) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    return User.updateEmailVerificationStatus(user.id);
  })
  .then(() => {
    return res.status(200).json({ message: 'redirecting....' });
    // return res.redirect('/verify-recaptcha');
  })
  .catch((err) => {
    if (!res.headersSent) {
      return res.status(500).json({ message: err.message || 'An error occurred during verification' });
    }
  });

};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.updateUser = async (req, res) => {

  const { 
    name, email, password, username, role, phone, address, dateOfBirth, 
    department, position, hireDate, skills, certifications, emergencyContact 
  } = req.body;

  const  userId  = req.params.id ; // Assume userId is passed as a route parameter

 

    const { error } = createUserVallidation.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ error: error.details.map((err) => err.message) });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for email or username conflicts if they are being updated
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    // Update user fields dynamically
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(password && { password }), // Ensure to hash the password if updating
          ...(username && { username }),
          ...(role && { role }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(department && { department }),
          ...(position && { position }),
          ...(hireDate && { hireDate }),
          ...(skills && { skills }),
          ...(certifications && { certifications }),
          ...(emergencyContact && { emergencyContact }),
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ error: 'Error updating user' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating user' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
