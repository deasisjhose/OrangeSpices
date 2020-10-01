const expenseDetailsModel = require('../models/ExpenseDetails');
const { validationResult } = require('express-validator');

//Getting all expense
exports.getAllDetails = (param, callback) => {
  expenseDetailsModel.getAll(param, (err, expense) => {
    if (err) throw err;

    const expensesObjects = [];
        
    expense.forEach(function(doc) {
      expensesObjects.push(doc.toObject());
    });
        
    callback(expensesObjects);
  });
};

//Add expense
exports.addExpenseDetails = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()){
      const expenseDate = req.body.expenseDate;
      const expenseName = req.body.expenseName;
      const expenseDesc = req.body.expenseDesc;
      const expenseAmt = req.body.expenseAmt;

      if (expenseName == "Select expense name...") {
        req.flash('error_msg', 'Please select expense name.');
        res.redirect('/expenseDetails/add');
      } else {
        var expenseDetails = {
           date: expenseDate,
           expenseID: expenseName,
           description: expenseDesc,
           expenseAmount: expenseAmt
        }
            
        expenseDetailsModel.add(expenseDetails, function(err, result){
           if(err){
              console.log(err);
              req.flash('error_msg', 'Could not add expense details.');
              res.redirect('/expenseDetails/add');
            } else {
              console.log("Expense details added!");
              res.status(200).send();
            }
        })
    }
    } else {
      const messages = errors.array().map((item) => item.msg);
      req.flash('error_msg', messages.join(' '));
      res.redirect('/expenseDetails/add');
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