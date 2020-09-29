const mongoose = require('./connection');

const orderListSchema = new mongoose.Schema({
  orderDate: { type: Date, required: true},
  totalAmount: { type: Number, required: true} 
});

const OrderList = mongoose.model('orderList', orderListSchema);

// Add orderList
exports.add = function(obj, next) {
  const orderList = new OrderList(obj);
  orderList.save(function(err, add) {
      next(err, add);
  });
};

// Get orderList by ID
exports.getByID = function(id, next) {
  OrderList.findById(id, function(err, orderList) {
    next(err, orderList);
  });
};

// Getall orderList
exports.getAllList = (param, next) => {
  OrderList.find({}, (err, orderList) => {
    next(err, orderList);
  });
};

// Get all orderList
exports.getAll = (param, next) => {
  OrderList.aggregate(
    [{'$lookup': 
      {
        'from': 'orders',
        'localField': '_id',
        'foreignField': 'orderListID',
        'as': 'orders'
      }
    }
  ]).exec((err, orders) => next(err, orders));
};