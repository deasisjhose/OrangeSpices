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

// Get product by id
exports.getByID = function(index, next) {
  Product.findById(index, function(err, product) {
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