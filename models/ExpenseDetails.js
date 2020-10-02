const mongoose = require('./connection');

const expenseDetailSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true, min: 10 },
  expenseAmount: { type: Number, required: true },
  expenseID: { type: mongoose.Schema.Types.ObjectId, ref: 'expense', required: true},
});

const ExpenseDetail = mongoose.model('expenseDetail', expenseDetailSchema);

// Add expense detail
exports.add = function(obj, next) {
  const expenseDetail = new ExpenseDetail(obj);
  expenseDetail.save(function(err, add) {
    next(err, add);
  });
};
  
// Get all expense details
exports.getAll = (param, next) => {
  ExpenseDetail.find({}).populate('expenseID').exec((err, details) => next(err, details));
};

// Get total expenses
exports.getTotalExpenses = (param, next) => {
  ExpenseDetail.aggregate(
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