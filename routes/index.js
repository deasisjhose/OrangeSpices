const router = require('express').Router();
const userController = require('../controllers/userController');
const { loginValidation } = require('../validators.js');

router.get('/', (req, res) =>{
  res.redirect('/login');
});

// Get login page
router.get('/login', (req, res) => {
  console.log("Read login successful!");
  res.render('login');
});

// Get category page
router.get('/category/admin', (req, res) => {
  console.log("Read category (admin) successful!");
  res.render('categoryAdmin',{
    username: req.session.username
  });
});

// Get category page
router.get('/category/staff', (req, res) => {
  console.log("Read category (staff) successful!");
  //res.render('categoryAdmin',{
  //  username: req.session.username
  //});
});

// Logout
router.get('/logout', userController.logoutUser);

// POST methods for form submissions
router.post('/login', loginValidation, userController.loginUser);

module.exports = router;