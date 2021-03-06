const mongoose = require('./connection');

const orderSchema = new mongoose.Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  orderListID: { type: mongoose.Schema.Types.ObjectId, ref: 'orderList', required: true },
  productName: { type: String, required: true },
  orderQuantity: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  subTotal: { type: Number, required: true }
});

const Order = mongoose.model('order', orderSchema);

// Declaring productID and ingredientID as pk's
orderSchema.index({
  productID: 1,
  orderListID: 1
}, { unique: true });

// Add Order
exports.add = function(obj, next) {
  const order = new Order(obj);
  order.save(function(err, add) {
      next(err, add);
  });
};

// Get all order 
exports.getAll = (param, next) => {
  Order.find({}, (err, orders) => {
    next(err, orders);
  });
};

// Get all orders (inventory report)
exports.getAllOrders = (ingredients, next) => {
  Order.find().populate('orderListID').exec((err, orders) => next(err, orders));
  //Order.find(ingredients).populate({path: 'productID', populate: {path: 'orderListID'}}).exec((err, orders) => next(err, orders));
};

// Get order by ID
exports.getByID = function(id, next) {
  Order.findById(id, function(err, orders) {
    next(err, orders);
  });
};