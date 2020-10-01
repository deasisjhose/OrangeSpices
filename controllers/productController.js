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
        var idList = req.body.idIngList;
        var prodName = req.body.prodName;
        var category = req.body.category;
        var prodPrice = req.body.prodPrice;

        var ingName = req.body.ingName;
        var qtyList = req.body.qtyList;
        var unitList = req.body.unitList; 
                
        var ingredientList = {
          prodName: prodName,
          prodPrice: prodPrice,
          category: category
        }

        console.log(idList);
        console.log(ingName);
        console.log(qtyList); 
        console.log(unitList);

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
                      quantityNeeded: qtyList,
                      unitID: unitList
                     
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
            }
        })
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/products/add');
    }
}; 


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