const mongoose = require('./connection');

const ingredientSchema = new mongoose.Schema({
    ingredientName: { type: String, required: true, min: 5 },
    totalQuantity: { type: Number, required: false, default: 0 },
    minStock: { type: Number, required: true },
    unitID: { type: mongoose.Schema.Types.ObjectId, ref: 'unit', required: true }
});

const Ingredient = mongoose.model('ingredient', ingredientSchema);

// Add Ingredient
exports.add = function(obj, next) {
    const ingredient = new Ingredient(obj);
    ingredient.save(function(err, add) {
        next(err, add);
    });
};

// Search ingredient
exports.search = function(ingredient, next) {
    Ingredient.find(ingredient).populate('unitID').exec((err, ingredients) => next(err, ingredients));
};

// Get all ingredients (for ingredients display)
exports.getAll = (param, next) => {
    Ingredient.find({}).populate('unitID').exec((err, ingredients) => next(err, ingredients));
};

// Find ingredient
exports.getOne = function(query, next) {
    Ingredient.findOne(query, function(err, ingredient) {
        next(err, ingredient);
    });
};

// Get Ingredient by ID
exports.getByID = function(id, next) {
    Ingredient.findById(id, function(err, ingredient) {
        next(err, ingredient);
    });
    //Ingredient.findById(id).populate('unitID').exec((err, ingredients) => next(err, ingredients));
};

// Update total ingredients
exports.updateStock = function(id, update, next) {
    Ingredient.findOneAndUpdate({ _id: id }, update, { new: true }, function(err, ingredient) {
        next(err, ingredient);
    })
};