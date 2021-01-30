const supplyModel = require('../models/Supplies');
const { validationResult } = require('express-validator');

// Getting all supplies
exports.getAllSupplies = (param, callback) => {
  supplyModel.getAll(param, (err, supplies) => {
    if (err) throw err;
      
    const suppliessObjects = [];
      
    supplies.forEach(function(doc) {
      suppliessObjects.push(doc.toObject());
    });
      
    callback(suppliessObjects);
  });
};

// Add supplies
exports.addSupply = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    const supplyBrand =req.body.supplyBrand;
    const ingredientName = req.body.ingredientName;
    const unitQty = req.body.unitQty;
    supplyModel.getOne({ brandName: {$regex: supplyBrand, $options:'i'}}, (err, result) => {
      if (result) {
				req.flash('error_msg', 'Already have that supply. Try again.');
				res.redirect('/supplies/add');
      } else if(ingredientName == "Select ingredient name..."){
        req.flash('error_msg', 'Please select ingredient name.');
        res.redirect('/supplies/add');
      } else {
        var supply = {
          brandName: supplyBrand,
          ingredientID: ingredientName,
          unitQuantity: unitQty
        }
         
        supplyModel.add(supply, function(err, result){
          if(err){
            console.log(err);
            res.status(400).send();
          }
          else {
            console.log("Supply added!");
            res.status(200).send();
          }
        })
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/supplies/add');
  }
}; 

// Getting supply name
exports.getSupplyName = (param, callback) => {
  supplyModel.getName({brandName: true}, (err, supplies) => {
    if (err) throw err;
      
    const supplyObjects = [];
      
    supplies.forEach(function(doc) {
      supplyObjects.push(doc.toObject());
    });
      
    callback(supplyObjects);
  });
};

// Get supply by ID
exports.getSupplyID = (req, res) => {
  var id = req.params.id;

  supplyModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var supplyObject = result.toObject();
      res(supplyObject);
    }
  });
};