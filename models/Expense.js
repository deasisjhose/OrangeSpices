const mongoose = require('./connection');

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  expenseName: { type: String, required: true, min: 5 },
  expenseType: { type: String, required: true },
  description: { type: String, required: true, min: 10 },
  expenseAmount: { type: Number, required: true }
});

const Expense = mongoose.model('expense', expenseSchema);

// Add expense
exports.add = function(obj, next) {
  const expenseDetail = new Expense(obj);
  expenseDetail.save(function(err, add) {
    next(err, add);
  });
};
  
// Get all expense
exports.getAll = (param, next) => {
  Expense.aggregate(
  [
    { '$group': 
      {
        _id: { 
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
          year: { $year: "$date" }
        }, 
        expenseDate: { "$first": "$date" }, 
        expenseName: { "$push": "$expenseName" },
        expenseType: { "$push": "$expenseType" },
        description: { "$push": "$description" },
        expenseAmount: { "$push": "$expenseAmount" }
      }
    },
    {
      $sort : { 'expenseDate' : -1 }
    },
    {
      '$project':
      {
        expenseDate: 1,
        expenseName: 1,
        expenseType: 1,
        description: 1,
        expenseAmount: 1
      }
    }
  ]).exec((err, expenses) => next(err, expenses));
};

// Get total expenses
exports.getTotalExpenses = (param, next) => {
  Expense.aggregate(
  [    
    { '$group': 
      {
        _id: null,
        totalExpenses: { 
          '$sum': 
          '$expenseAmount'
        }
      }
    },

    {
      '$project':
      {
        // _id: 1,
        totalExpenses: 1
      }
    }
  ]).exec((err, total) => next(err, total));
};