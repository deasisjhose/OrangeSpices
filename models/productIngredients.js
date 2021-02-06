const mongoose = require('./connection');

const productIngredientSchema = new mongoose.Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  ingredientID: { type: mongoose.Schema.Types.ObjectId, ref: 'ingredient', required: true },
  quantityNeeded: { type: Number, required: true },
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

// Delete product ingredients
exports.remove = function(query, next) {
  ProductIngredient.deleteMany({productID: query}, function(err, prodIng){
    next(err, prodIng);
  });
};

// Get all product ingredients
exports.getAll = (next) => {
  ProductIngredient.find({}, (err, prodIng) => {
    next(err, prodIng);
  });
};

// Get product ingredient
exports.getIngredients = function(id, next) {
  ProductIngredient.find({productID: id}, function (err, prodIng){
    next(err, prodIng);
  });
};

// Get product ingredient (for productController edit and inventory report)
exports.getIngredientsList = (id, next) => {
  ProductIngredient.find({productID: id}).populate({path: 'ingredientID', populate: {path: 'unitID'}}).exec((err, ingredients) => next(err, ingredients));
};