const mongoose = require('./connection');

const orderListSchema = new mongoose.Schema({
  orderDate: { type: Date, required: true},
  totalAmount: { type: Number, required: true} 
});

const OrderList = mongoose.model('orderList', orderListSchema);

// Add Order List
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

// Delete orderList
exports.remove = function(query, next) {
  OrderList.findByIdAndRemove(query, function(err, orderList){
    next(err, orderList);
  });
};