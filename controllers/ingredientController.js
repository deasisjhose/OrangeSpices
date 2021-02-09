const ingredientModel = require('../models/Ingredients');
const discrepancyModel = require('../models/Discrepancy');
const { validationResult } = require('express-validator');

// Getting all ingredients
exports.getAllIngredients = (param, callback) =>{
  ingredientModel.getAll(param, (err, ingredients) => {
    if (err) throw err;
      
    var ingredientsObjects = [];
      
    ingredients.forEach(function(doc) {
      ingredientsObjects.push(doc.toObject());
    });
      
    callback(ingredientsObjects);
  });
};

// Search ingredient
exports.searchIngredient = (req, res) => {
  var query = req.query.searchProd;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    ingredientModel.search({ ingredientName: { $regex: query, $options:'i' }}, (err, result) => {
      if (err) {
        console.log("There's an error!")
        console.log(err);
      } else {
        console.log("Ingredients results");
        console.log(result);
        if (result) { 
          const ingredientsObjects = [];
          result.forEach(function(doc) {
            ingredientsObjects.push(doc.toObject());
          });
          res(ingredientsObjects);
        } 
        else { 
          console.log("No ingreditnes found!");
          res.status(400).send("No ingredients found!");
        }
      }
    });
  } else {
    console.log("Error searching ingredient!");
    res.status(400).send("Error searching ingredient!");
  }
};

// Adding ingredient
exports.addIngredient = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    var ingredientName = req.body.ingredientName;
    var unitID = req.body.unitID;
    var minStock = req.body.minStock;

    console.log('minStock in ingredient controller');
    console.log(minStock);
 
    ingredientModel.getOne({ ingredientName: {$regex: ingredientName, $options:'i'}}, (err, result) => {
      if (result) {
        console.log("error");
        console.log(err);
				req.flash('error_msg', 'Already have that ingredient. Try again.');
        res.status(422).send();
      } else {
        var ingredient = {
          ingredientName: ingredientName,
          unitID: unitID,
          minStock: minStock
        }
        console.log("abot ba here");

        ingredientModel.add(ingredient, function(err, result){
          if(err){
            console.log(err);
            req.flash('error_msg', 'Could not add ingredient. Please try again.');
            res.redirect('/ingredients/add');
          }
          else {
            console.log("Ingredient added!");
            req.flash('success_msg', 'Ingredient added!');
            res.status(200).send();
          }
        })
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/ingredients/add');
  }
}; 

// Getting ingredient name
exports.getIngredientName = (param, callback) => {
  ingredientModel.getAll(param, (err, ingredients) => {
    if (err) throw err;
      
    const ingredientsObjects = [];
      
    ingredients.forEach(function(doc) {
      ingredientsObjects.push(doc.toObject());
    });
    
    callback(ingredientsObjects);
  });
};

// Recording discrepancy and updating ingredients
exports.updateStock = (req, res) => {
  const errors = validationResult(req);
  const { physicalCount, id } = req.body;

  if(errors.isEmpty()){
    if(physicalCount != ""){
      ingredientModel.getByID(id, (err, result) => {
        var stock = result.totalQuantity;
        if(physicalCount == stock){
          req.flash('success_msg', 'System count and physical count are the same.');
          res.redirect('/ingredients');               
        }
        else {
          var discrepancy = {
            physicalCount: physicalCount,
            date: Date.now(),
            ingredientID: id
          };

          var updateStock = {
            totalQuantity: physicalCount
          };
            
          discrepancyModel.add(discrepancy, function(err, result){
            if (err) {
                throw err;
            } else {
              console.log('Discrepancy added!');
              console.log(result);
              ingredientModel.updateStock(id, updateStock, (err, result) => {
                if (err) {
                  req.flash('error_msg', 'Could not update ingredient.');
                  res.redirect('/ingredients');
                } else {
                  req.flash('success_msg', 'Ingredient updated!');
                  res.redirect('/ingredients');
                }
              })
            }
          })
        }
      })
    }
    else {
      req.flash('error_msg', 'Please enter physical count.');
      res.redirect('/ingredients');
    }
  }
};