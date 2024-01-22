const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, password: hashedPassword });
    console.log(`new user created: ${newUser}`);
    res.locals.user = newUser;
    return next();
  } catch (err) {
    console.error('Error creating user:', error);
    return res.status(401).json({ error: err.message });
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ error: 'username not found' });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!correctPassword) {
      return res.status(400).json({ message: 'incorrect password' });
    }

    res.locals.existingUser = existingUser;
    return next();
  } catch (error) {
    console.log('Error verifying user:', error);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = userController;