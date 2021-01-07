const unitModel = require('../models/Unit');

// Getting all units
exports.getAllUnits = (param, callback) =>{
    unitModel.getAll(param, (err, units) => {
    if (err) throw err;
      
    const unitsObjects = [];
      
    units.forEach(function(doc) {
        unitsObjects.push(doc.toObject());
    });
      
    callback(unitsObjects);
  });
};