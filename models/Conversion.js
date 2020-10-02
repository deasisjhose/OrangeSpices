const mongoose = require('./connection');
const { Double } = require('mongodb');

const conversionSchema = new mongoose.Schema({
    aUnitId: { type: mongoose.Schema.Types.ObjectId, ref: 'unit', required: true },
    bUnitId: { type: mongoose.Schema.Types.ObjectId, ref: 'unit', required: true },
    convertName: { type: String, required: true },
    ratio: { type: Number, required: true },

});

// Declaring productID and ingredientID as pk's
conversionSchema.index({
    aUnitId: 1,
    bUnitId: 1
}, { unique: true });

const Conversion = mongoose.model('conversion', conversionSchema);

// Get all order 
exports.getAll = (param, next) => {
    Conversion.find({}, (err, orders) => {
        next(err, orders);
    });
};

// Get order by ID
exports.getByID = function(id, next) {
    Conversion.findById(id, function(err, orders) {
        next(err, orders);
    });
};