const productModel = require('../models/Product');
const ingredientModel = require('../models/Ingredients');
const prodIngModel = require('../models/productIngredients');
const unitModel = require('../models/Unit');
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

// Get product by ID
exports.getProductID = (req, res) => {
  var id = req.params.id;

  prodIngModel.getIngredientsList(id, function(err, ingredients){
    if (err) {
      throw err;
    } else {
      var i;
      var product = [], temp = [];

      for(i = 0; i < ingredients.length; i++){
        temp.push({
          ingredientName: ingredients[i].ingredientID.ingredientName,
          quantityNeeded: ingredients[i].quantityNeeded,
          unitName: ingredients[i].ingredientID.unitID.unitName
        })
      }

      productModel.getByID(id, function(err, result){
        product = ({
          prodName: result.prodName,
          category: result.category,
          prodPrice: result.prodPrice,
          ingredientList: temp
        })
        console.log(product);
        res(product);
      })
    }
  });
}

// Adding product
exports.addProduct = (req, res) => {
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

      var product = {
        prodName: prodName,
        prodPrice: prodPrice,
        category: category
      }

      productModel.add(product, function(err, result) {
        if (err) {
          console.log(err);
          req.flash('error_msg', 'Could not add product list.');
          res.redirect('/products/add');
        } else {
          for(i = 0; i < idList.length; i++){
            var ingredients = {
              productID: result._id, 
              ingredientID: idList[i],
              quantityNeeded: qtyList[i]
            }

            prodIngModel.add(ingredients, function(err, result){
              if (err) {
                console.log(err);
              } else {
                console.log(result);
              }
            })
          }
        console.log("Product saved!");
        req.flash('success_msg', 'Product added!');
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

// Edit product
exports.editProduct = (req, res) => {
  const { id, prodName, prodPrice } = req.body; 

  if(prodPrice <= 0){
    req.flash('error_msg', 'Could not enter negative value!');
    res.redirect('/products/edit/'+id);
  } else {
    var edit = {
      $set: { 
        prodName: prodName,
        prodPrice: prodPrice
      } 
    };
  
    productModel.edit(req.body.id, edit,(err, result) => {
      if (err) {
        console.log("Error cannot edit product!");
        console.log(err);
      } else {
        console.log("Product edited!");
        console.log(result);
        req.flash('success_msg', 'Product edited!');
        res.redirect('/products');
      }
    });
  }
};

// Delete product
exports.delete = (req, res) => {
  var id = req.body.id;
  console.log("product id to be removed");
  console.log(id);
  
  productModel.remove(id, (err, result) => {
    if (err) {
      console.log(err);
      throw err; 
    } 
    else {
      console.log(result);
      req.flash('success_msg', 'Product removed!');
      res.status(200).send();
    }
  }); 
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