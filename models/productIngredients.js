const mongoose = require('./connection');

const productIngredientSchema = new mongoose.Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  ingredientID: { type: mongoose.Schema.Types.ObjectId, ref: 'ingredient', required: true },
  quantityNeeded: { type: Number, required: true },
  unitID: { type: mongoose.Schema.Types.ObjectId, ref: 'unit', required: true }
});

// Declaring productID and ingredientID as pk's
productIngredientSchema.index({
  productID: 1,
  ingredientID: 1
}, { unique: true });

const ProductIngredient = mongoose.model('productIng', productIngredientSchema);

// Add Ingredient
exports.add = function(obj, next) {
  const ingredient = new ProductIngredient(obj);
  ingredient.save(function(err, prod) {
    next(err, prod);
  });
};

// Get all product ingredients
exports.getAll = (next) => {
  ProductIngredient.find({}, (err, prodIng) => {
    next(err, prodIng);
  });
};

// Get product ingredietns by id
exports.getIngredients = function(id, next) {
  ProductIngredient.findById({ productID: id }, function(err, prodIng) {
    next(err, prodIng);
  });
};

exports.getIngredients = function(id, next) {
  ProductIngredient.find({productID: id}, function (err, prodIng) {
    next(err, prodIng);
  });
};