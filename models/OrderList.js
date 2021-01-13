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

// Get all orderList
exports.getAllList = (next) => {
  OrderList.find({}, (err, orderList) => {
    next(err, orderList);
  });
};

// Get all orderList
exports.getOrderHistory = (param, next) => {
  OrderList.aggregate(
  [
    {'$lookup': 
      {
        'from': 'orders',
        'localField': '_id',
        'foreignField': 'orderListID',
        'as': 'orders'
      },
    }
  ]).exec((err, orders) => next(err, orders));
};

// Get sales 
exports.getSales = (param, next) => {
  OrderList.aggregate(
  [
    { '$lookup': {
      'from': 'orders',
      'localField': '_id',
      'foreignField': 'orderListID',
      'as': 'orders'
      }
    },
    { '$unwind': '$orders' },
    { '$group': 
      {
        _id: { 
          month: { $month: "$orderDate" },
          day: { $dayOfMonth: "$orderDate" },
          year: { $year: "$orderDate" }
        }, 
        productID: { '$push': '$orders.productID' },
        prodName: { '$push': '$orders.productName' },
        orderQuantity: { '$push': '$orders.orderQuantity' },
        prodPrice: { '$push': '$orders.productPrice' },
        subTotal: { '$push': '$orders.subTotal' },
        orderDate: { '$first': '$orderDate' }
      }
    },
    {
      '$project':
      {
        productID: 1,
        prodName: 1,
        orderQuantity: 1,
        prodPrice: 1,
        subTotal: 1,
        orderDate: 1
      }
    }
  ]).exec((err, sales) => next(err, sales));
};