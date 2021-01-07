const expenseModel = require('../models/Expense');
const { validationResult } = require('express-validator');

// Getting all expense
exports.getAllExpense = (param, callback) => {
    expenseModel.getAll(param, (err, expense) => {
      if (err) throw err;
        
      const expensesObjects = [];
        
      expense.forEach(function(doc) {
        expensesObjects.push(doc.toObject());
      });
        
      callback(expensesObjects);
    });
};

// Add expense
exports.addExpense = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty())
    {
      const { expenseName, expenseType } = req.body;
      expenseModel.getOne({ expenseName: {$regex: expenseName, $options:'i'}}, (err, result) => {
        if (result) {
            req.flash('error_msg', 'Already have that expense. Try again.');
            res.redirect('/expense/add');
        } else {
          var expense = {
            expenseName: expenseName,
            expenseType: expenseType
          }
           
          expenseModel.add(expense, function(err, result){
            if(err){
              req.flash('error_msg', 'Could not add expense. Please try again.');
              res.redirect('/expense/add');
            }
            else {
              console.log("Expense added!");
              req.flash('success_msg', 'Expense added!');
              res.redirect('/expense');
            }
          })
        }
      });
    } else {
      const messages = errors.array().map((item) => item.msg);
      req.flash('error_msg', messages.join(' ')); 
      res.redirect('/expense/add');
    }
}; 

// Get expense name
exports.getExpenseName = (param, callback) => {
    expenseModel.getName({expenseName: true}, (err, expense) => {
      if (err) throw err;
        
      const expenseObjects = [];
        
      expense.forEach(function(doc) {
        expenseObjects.push(doc.toObject());
      });
        
      callback(expenseObjects);
    });
};