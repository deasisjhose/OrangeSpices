const userModel = require('../models/Users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Login
exports.loginUser = (req, res) => {
  const errors = validationResult(req);
  if (!req.session.user) {
    if (errors.isEmpty()) {
      const { username, password } = req.body;
      userModel.getOne({ username: username }, (err, user) => {
        if (err) {
          req.flash('error_msg', 'Something happened! Please try again.');
          res.redirect('/login');
        } else {
          if (user) { // if user is found!
            bcrypt.compare(password, user.password, (err, result) => {
              if (result) { // passwords match (result == true)
                // Update session object once matched!
                req.session.user = user._id;
                req.session.username = user.username;
                res.redirect('/POS'); 
              } else {  // If passwords don't match
                req.flash('error_msg', 'Password does not match.');
                res.redirect('/login');
              }
            });
          } else {  // No user found
            req.flash('error_msg', 'No user with that username.');
            res.redirect('/login');
          }
        }
      });
    } else {
      const messages = errors.array().map((item) => item.msg);
  		req.flash('error_msg', messages.join(' '));
      res.redirect('/login');
    }
  }
};
  
// Logout
exports.logoutUser = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};

// Get user by ID
exports.getID = (req, res) => {
  var id = req;

  userModel.getById(id, (err, result) => {
    if (err) {
      console.log("Could not find user.");
      throw err;
    } else {
      res(result);
    }
  });
};