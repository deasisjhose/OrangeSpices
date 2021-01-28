const productModel = require('../models/Product');
const ingredientModel = require('../models/productIngredients');
const { validationResult } = require('express-validator');

//Getting all products
exports.getAllProducts = (param, callback) =>{
    productModel.getAll(param, (err, products) => {
    if (err) throw err;
      
    const productsObjects = [];
      
    products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
    });
      
    callback(productsObjects);
  });
};

// Adding product
exports.addProduct = (req, res) => {
  //const { prodName, category, prodPrice, productID, ingredientID, quantityNeeded, unitID } = req.body;
  const errors = validationResult(req);
    if (errors.isEmpty()) {
      var i;
      var prodName = req.body.prodName;
      var category = req.body.category;
      var prodPrice = req.body.prodPrice;

      var idList = req.body.idIngList;
      // var ingName = req.body.ingName;
      var qtyList = req.body.qtyList;
      var unitList = req.body.unitList; 

      var ingredientList = {
        prodName: prodName,
        prodPrice: prodPrice,
        category: category
      }

      productModel.add(ingredientList, function(err, result) {
        if (err) {
          console.log(err);
          req.flash('error_msg', 'Could not add product list.');
          res.redirect('/products/add');
        } else {
          for(i = 0; i < idList.length; i++){
            var ingredients = {
              productID: result._id, 
              ingredientID: idList[i],
              quantityNeeded: qtyList[i],
              unitID: unitList[i]
            }

            ingredientModel.add(ingredients, function(err, result){
              if (err) {
                console.log(err);
              } else {
                console.log(result);
              }
            })
          }
        console.log("Product saved!");
        res.status(200).send();
        }
      })
    } else {
      const messages = errors.array().map((item) => item.msg);
      req.flash('error_msg', messages.join(' '));
      res.redirect('/products/add');
    }
}; 

// Search product
exports.searchProduct = (req, res) => {
  var query = req.query.searchProd;
  const errors = validationResult(req);
  console.log(query);
  if (errors.isEmpty()) {
    productModel.search({ prodName: { $regex: query, $options:'i' }}, (err, result) => {
      if (err) {
        console.log("There's an error!")
        console.log(err);
      } else {
        console.log("product results");
        console.log(result);
        if (result) { 
          const productObjects = [];
          result.forEach(function(doc) {
            productObjects.push(doc.toObject());
          });
          res(productObjects);
        } 
        else { 
          console.log("No products found!");
          res.status(400).send("No products found!");
        }
      }
    });
  } else {
    console.log("Error searching product!");
    res.status(400).send("Error searching product!");
  }
};

// Get ala carte products
exports.getAlaCarte = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getAC({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });

      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get beef rice meal products
exports.getBeefRiceMeal = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getBRM({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });

      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get pork rice meal products
exports.getPorkRiceMeal = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getPRM({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });
      
      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get chicken rice meal products
exports.getChickenRiceMeal = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getCRM({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });
      
      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get all day breakfast products
exports.getAllDayBreakfast = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getADB({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });
      
      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get baked spaghetti products
exports.getBakedSpaghetti = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getBSPAG({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });
      
      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Get baked sushi products
exports.getBakedSushi = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
  {
    productModel.getBSUSH({prodName: true}, (err, products) => {
      const productsObjects = [];

      products.forEach(function(doc) {
        productsObjects.push(doc.toObject());
      });
    
      res(productsObjects);
    })
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' ')); 
    res.redirect('/POS');
  }
};

// Delete product
exports.delete = (req, res) => {
  var id = req.params.id;
  
  productModel.remove(id, (err, result) => {
    if (err) {
      throw err; 
    } 
    else {
      req.flash('success_msg', 'Product removed!');
      res.redirect('/products');
    }
  }); 
};