exports.loggedIn = (req, res, next) => {
  // Must be authenticated to go to the next function
  if (req.session.user) {
    return next()
  } else {
    res.redirect('/login');
  }
};
