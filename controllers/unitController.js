const unitModel = require('../models/Unit');
const ingredientModel = require('../models/Ingredients');

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

// Get unit by ID
exports.getUnitID = (req, res) => {
  console.log("req sa getUnitId");
  console.log(req.body.id);
  var id = req.body.id;

  ingredientModel.getByID(id, (err, ingredient) => {
    if (err) {
      throw err;
    } else {
      unitModel.getByID(ingredient.unitID, (err, result) => {
        if (err) {
          throw err;
        } else {
          console.log("unit name");
          console.log(result);
          var unit = result.toObject();
          res.send(unit);
        }
      });
    }
  });
};