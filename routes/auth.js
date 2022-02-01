const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchuser = require('../Midware/fetchuser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//Route 1: Creat a new user by POST : '/api/auth/creatuser' no login require;

router.post('/creatuser', [body('email', 'Enter a valid email').isEmail(),
body('name', 'Name must be atleast 3 characters').isLength({ min: 3 }),
body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  try {
    // if user enters any invalid field then errors occours and shows into res;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    // check whether the user with the same eamil exist;
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      success = false;
      return res.status(400).json({ success, error: "Please enter a unique email id" })
    }
    // use of bcryptjs for secure password;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    // creat user and save into mongo;
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    // use of JWT to give the jsontoken to the user;
    let JWT_MSG = "My Privet Massage"
    let data = {
      user: {
        id: user.id
      }
    }
    let jwtToken = jwt.sign(data, JWT_MSG);
    success = true;
    res.json({ success, jwtToken })
    // If any error Ouccer shows in res;
  } catch (error) {
    console.error(error.massage);
    return res.status(500).send("Some Server error Occured")
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route 2: Login user by POST : '/api/auth/login' no Login require;

router.post('/login', [body('email', 'Enter a valid email').isEmail(),
body('password', 'Please enter a valid credential of your account').exists()
], async (req, res) => {
  let success = false;
  try {
    // if user enters any invalid field then errors occours and shows into res;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: errors.array() });
    }
    // check whether the user with eamil exist or not;
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) {
      success = false
      return res.status(400).json({ success, error: "Please enter a valid credential of your account" })
    }
    // use of bcryptjs for check the entered password with valid one;
    const valid = await bcrypt.compare(password, user.password);
    // if password is valid then use of JWT to give the jsontoken to the user;
    if (valid) {
      let JWT_MSG = "My Privet Massage"
      const data = {
        user: {
          id: user.id
        }
      }
      const jwtToken = jwt.sign(data, JWT_MSG);
      success = true;
      res.json({ success, jwtToken })
    }
    // if password is not valid then send error;
    else {
      success = false
      return res.status(400).json({ success, error: "Please enter a valid credential of your account" })
    }
    // If any internal error Ouccer shows in res;
  } catch (error) {
    success = false
    console.error(error.massage);
    return res.status(500).send("Some Server error Occured")
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route 3: Get logged in user details by Post : '/api/auth/getuser' Login require;

router.get('/getuser', fetchuser, async (req, res) => {
  try {
    // if user enters any invalid field then errors occours and shows into res;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const myuser = await User.findById(userId).select("-password")
    res.send(myuser)
  } catch (error) {
    console.error(error.massage);
    return res.status(500).send("Some Server error Occured")
  }
})

module.exports = router;