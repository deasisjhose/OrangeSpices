const mongoose = require('./connection');

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: false, min:5}, //set to true afterwards!
});

const Unit = mongoose.model('unit', unitSchema);

// Add unit
exports.addUnit = function(obj, next) {
    const unit = new Unit(obj);
    //console.log(unit);
    unit.save(function(err, add) {
      next(err, add);
    });
};

// Get all units
exports.getAll = (param, next) => {
  Unit.find({}, (err, units) => {
    next(err, units);
  });
};