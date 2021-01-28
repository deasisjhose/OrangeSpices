const mongoose = require('./connection');

const productSchema = new mongoose.Schema({
  prodName: { type: String, required: true, min:5},
  prodPrice: { type: Number, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model('product', productSchema);

// Add Product
exports.add = function(obj, next) {
  const product = new Product(obj);

  product.save(function(err, prod) {
    next(err, prod);
  });
};

// Edit product
exports.edit = function(id, update, next) {
  Product.findOneAndUpdate({_id: id}, update, { new: true }, function(err, product) {
    next(err, product);
  })
};

// Get all products
exports.getAll = (param, next) => {
  Product.find({}, (err, prod) => {
    next(err, prod);
  });
};

// Find product
exports.getOne = function(query, next) {
  Product.findOne(query, function(err, prod) {
    next(err, prod);
  });
};

// Search product
exports.search = function(product, next) {
  Product.find(product, function(err, product) {
    next(err, product);
  });
};

// Get product by id
exports.getByID = function(id, next) {
  Product.findById(id, function(err, product) {
    next(err, product);
  });
};

// Get ala carte products
exports.getAC = function(req, next) {
  Product.find({category: "Ala Carte"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get beef rice meals products
exports.getBRM = function(req, next) {
  Product.find({category: "Beef Rice Meals"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get pork rice meals products
exports.getPRM = function(req, next) {
  Product.find({category: "Pork Rice Meals"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get chicken rice meals products
exports.getCRM = function(req, next) {
  Product.find({category: "Chicken Rice Meals"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get all day breakfast products
exports.getADB = function(req, next) {
  Product.find({category: "All Day Breakfast"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get baked spaghetti products
exports.getBSPAG = function(req, next) {
  Product.find({category: "Baked Spaghetti"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Get baked sushi products
exports.getBSUSH = function(req, next) {
  Product.find({category: "Baked Sushi"}, {prodName: 1, category: 1, prodPrice: 1, _id: 1}, function(err, product) { 
    next(err, product); 
  });
};

// Delete product
exports.remove = function(query, next) {
  Product.findByIdAndRemove(query, function(err, product){
    next(err, product);
  });
};

// Get all orderList
exports.getAllProducts = (req, next) => {
  Product.aggregate(
  [
    { '$lookup': {
      'from': 'orders',
      'localField': '_id',
      'foreignField': 'productID',
      'as': 'orders'
      }
    },
    { '$unwind': '$orders' },
    { '$group': 
      {
        _id: '$orders.productID',
        prodName: { "$first": "$orders.productName"},
        totalQuantity: { '$sum': '$orders.orderQuantity'},
        prodPrice: { "$first": "$orders.productPrice"},
        orderListID: { "$first": "$orders.orderListID"}
      }
    },
    {
      '$project':
      {
        prodName: 1,
        totalQuantity: 1,
        prodPrice: 1,
        subTotal: 
        {
          '$multiply':
          [ '$prodPrice', '$totalQuantity' ]
        },
        totalAmount: { '$sum': "$subTotal" },
        orderListID: 1,
        orderDate: 1
      }
    }
  ]).exec((err, orders) => next(err, orders));
};

// Get total sales
exports.getTotalSales = (param, next) => {
  Product.aggregate(
  [
    {'$lookup': {
        'from': 'orders',
        'localField': '_id',
        'foreignField': 'productID',
        'as': 'orders'
      }
    },
    { '$unwind':'$orders'},
    { '$group': 
      {
        _id: '$orders.productID',
        totalQuantity:
          { '$sum': 
            '$orders.orderQuantity'
          },
        prodPrice: { "$first": "$orders.productPrice"},
      }
    },

    { '$group': 
      {
        _id: null,
        totalSales: { 
          $sum: { 
            $multiply: 
              ["$prodPrice", "$totalQuantity"]
          }
        }
      }
    },

    {
      '$project':
      {
        // _id: 1,
        totalSales: 1
      }
    }
  ]).exec((err, total) => next(err, total));
};