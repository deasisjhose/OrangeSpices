const expenseModel = require('../models/Expense');
const { validationResult } = require('express-validator');

// Getting all expense details
exports.getAllExpense = (req, res) => {
  expenseModel.getAll(req, (err, expense) => {
    if(err){
      console.log("Getting all expenses erorr");
      console.log(err);
    } else {
      var i, j, temp = [], tempMonth = [], expenseArray = [];
      console.log("EXPENSE");
      console.log(expense);
      for(i = 0; i < expense.length; i++){
        for(j = 0; j < expense[i].expenseName.length; j++){
          temp.push({
            expenseDate: expense[i].expenseDate[j],
            expenseName: expense[i].expenseName[j],
            expenseType: expense[i].expenseType[j],
            description: expense[i].description[j],
            expenseAmount: expense[i].expenseAmount[j]
          })
          tempMonth[i] = expense[i].expenseDate[j];
        }
        
        expenseArray.push({
          _id: expense[i]._id,
          expenseMonth: tempMonth[i],
          expenseDetails: temp
        })
        temp = [];
      }
      console.log(expenseArray);
      res(expenseArray);
    }
  });
};

// Add expense details
exports.addExpense = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()){
      const expenseDate = req.body.expenseDate;
      const expenseName = req.body.expenseList;
      const expenseType = req.body.expenseType;
      const expenseDesc = req.body.expenseDesc;
      const expenseAmt = req.body.expenseAmt;
      var i;

      for(i = 0; i < expenseName.length; i++)
      {
        var expense = {
           date: expenseDate,
           expenseName: expenseName[i],
           expenseType: expenseType[i],
           description: expenseDesc[i],
           expenseAmount: expenseAmt[i]
        }
            
        expenseModel.add(expense, function(err, result){
          if(err){
            console.log(err);
            req.flash('error_msg', 'Could not add expense details.');
            res.redirect('/expense/add');
          } else {
            console.log("Expenses added!");
            console.log(result);
            req.flash('success_msg', 'Expense added!');
            res.status(200).send();
          }
        })
      }
    } else {
      const messages = errors.array().map((item) => item.msg);
      req.flash('error_msg', messages.join(' '));
      res.redirect('/expense/add');
    }
}; 

// Get expense name
// exports.getExpenseName = (param, callback) => {
//   expenseModel.getName({expenseName: true}, (err, expense) => {
//     if (err) throw err;
        
//     const expenseObjects = [];
        
//     expense.forEach(function(doc) {
//       expenseObjects.push(doc.toObject());
//     });
        
//     callback(expenseObjects);
//   });
// };