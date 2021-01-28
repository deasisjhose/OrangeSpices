const router = require('express').Router();
const userController = require('../controllers/userController');
const billingController = require('../controllers/billingController');
const unitController = require('../controllers/unitController');
const productController = require('../controllers/productController');
const supplyController = require('../controllers/supplyController');
const ingredientController = require('../controllers/ingredientController');
const purchaseController = require('../controllers/purchaseController');
const expenseController = require('../controllers/expenseController');
const reportsController = require('../controllers/reportsController');
const { loginValidation, addPurchaseValidation } = require('../validators.js');
const { loggedIn } = require('../middlewares/checkAuth');

router.get('/', (req, res) => {
  res.redirect('/login');
});

// Get login page
router.get('/login', (req, res) => {
  if (req.session.user) res.redirect('/POS');
  else {
    console.log("Read login successful!");
    res.render('login');
  }
});

// Get POS [landing] page
router.get('/POS', loggedIn, (req, res) => {
  console.log("Read POS successful!");
  userController.getID(req.session.user, user => {
    productController.getAlaCarte(req, alaCarte => {
      productController.getChickenRiceMeal(req, CRM => {
        productController.getPorkRiceMeal(req, PRM => {
          productController.getBeefRiceMeal(req, BRM => {
            productController.getAllDayBreakfast(req, ADB => {
              productController.getBakedSpaghetti(req, BSPAG => {
                productController.getBakedSushi(req, BSUSH => {
                  productController.getAllProducts (req, ALL => {
                    if(req.session.username == "admin"){
                      res.render('POS', {
                        isAdmin: true,
                        username: req.session.username,
                        alaCarte: alaCarte,
                        CRM: CRM,
                        PRM: PRM,
                        BRM: BRM,
                        ADB: ADB,
                        BSPAG: BSPAG,
                        BSUSH: BSUSH,
                        ALL: ALL
                      })
                    }
                    else {
                      res.render('POS', { 
                        isAdmin: false, 
                        username: req.session.username,
                        alaCarte: alaCarte,
                        CRM: CRM,
                        PRM: PRM,
                        BRM: BRM,
                        ADB: ADB,
                        BSPAG: BSPAG,
                        BSUSH: BSUSH,
                        ALL: ALL
                      })
                    }
                  })
                })
              })
            })
          })
        })
      })
    })
  })
});

// Get products page
router.get('/products', loggedIn, (req, res) => {
  console.log("Read products successful!");
  productController.getAllProducts(req, products => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('products', { 
          isAdmin: true,
          product: products,
        })
      }
      else {
        res.render('products', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get create products page
router.get('/products/add', loggedIn, (req, res) => {
  console.log("Read add product successful!");
  ingredientController.getAllIngredients(req, ingredients => {
    userController.getID(req.session.user, (user) => {
      if(req.session.username == "admin"){
        res.render('addProduct', { 
          isAdmin: true,
          ingName: ingredients,
        })
      }
      else {
        res.render('addProduct', { 
          isAdmin: false
        })
      }
    })
  })
});

// Search products 
router.get('/products/search', loggedIn, (req, res) => {
  console.log("Read search product successful!");
  productController.searchProduct(req, product => {
    userController.getID(req.session.user, (user) => {
      if(req.session.username == "admin"){
        res.render('products', { 
          isAdmin: true,
          product: product,
        })
      }
      else {
        res.render('products', { 
          isAdmin: false
        })
      }
    })
  })
});

// Getting id of the product user wants to edit
router.get('/products/edit/:id', loggedIn, (req, res) => {
  console.log("Read edit product successful!");
  productController.getProductID(req, product => {
    console.log(product);
    userController.getID(req.session.user, (user) => {
      if(req.session.username == "admin"){
        res.render('editProduct', { 
          isAdmin: true,
          product: product,
        })
      }
      else {
        res.render('editProduct', { 
          isAdmin: false
        })
      }
    })
  })
});

// Delete product
router.get('/product/delete/:id', loggedIn, productController.delete);

// Get inventory [supplies] page
router.get('/supplies', loggedIn, (req, res) => {
  console.log("Read supplies successful!");
  supplyController.getAllSupplies(req, supplies => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('supplies', { 
          isAdmin: true,
          supply: supplies,
        })
      }
      else {
        res.render('supplies', { 
          isAdmin: false, 
          supply: supplies,
        })
      }
    })
  })
});

// Get add supply page
router.get('/supplies/add', loggedIn, (req, res) => {
  console.log("Read add supply successful!");
  ingredientController.getIngredientName(req, ingredients => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('addSupply', { 
          isAdmin: true,
          ingName: ingredients,
        })
      }
      else {
        res.render('addSupply', { 
          isAdmin: false, 
          ingName: ingredients,
        })
      }
    })
  })
});

// Get inventory [ingredients] page
router.get('/ingredients', loggedIn, (req, res) => {
  console.log("Read ingredients successful!");
  ingredientController.getAllIngredients(req, ingredients => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('ingredients', { 
          isAdmin: true,
          ingredient: ingredients,
        })
      }
      else {
        res.render('ingredients', { 
          isAdmin: false,
          ingredient: ingredients,
        })
      }
    })    
  })
});

// Search ingredients 
router.get('/ingredients/search', loggedIn, (req, res) => {
  console.log("Read search ingredient successful!");
  ingredientController.searchIngredient(req, ingredients => {
    userController.getID(req.session.user, (user) => {
      if(req.session.username == "admin"){
        res.render('ingredients', { 
          isAdmin: true,
          ingredient: ingredients,
        })
      }
      else {
        res.render('ingredients', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get add ingredient page
router.get('/ingredients/add', loggedIn, (req, res) => {
  console.log("Read add ingredient successful!");
  unitController.getAllUnits(req, units => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('addIngredient', { 
          isAdmin: true,
          unit: units,
        })
      }
      else {
        res.render('addIngredient', { 
          isAdmin: false,
          unit: units,
        })
      }
    })
  })
});

// Get procurement page
router.get('/procurement', loggedIn, (req, res) => {
  console.log("Read procurement successful!");
  purchaseController.getAllPurchase(req, purchase => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('procurement', { 
          isAdmin: true,
          purchase: purchase
        })
      }
      else {
        res.render('procurement', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get procurement filter report page
router.get('/procurement/filter', loggedIn, (req, res) => {
  console.log("Read procurement filter successful!");
  purchaseController.getAllPurchase(req, purchase => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('procurement', { 
          isAdmin: true,
          purchase: purchase,
          filterDate: true
        })
      }
      else {
        res.render('procurement', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get add purchase page
router.get('/purchase/add', loggedIn, (req, res) => {
  console.log("Read add purchase successful!");
  supplyController.getSupplyName(req, supplies => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('addPurchase', { 
          isAdmin: true,
          supplyName: supplies
        })
      }
      else {
        res.render('addPurchase', { 
          isAdmin: false, 
          supplyName: supplies
        })
      }
    })
  })
});

// Get purchase order page
router.get('/purchase/order', (req, res) => {
  console.log("Read purchase order successful!");
  supplyController.getSupplyName(req, supplies => {
    unitController.getAllUnits(req, (units) => {
      userController.getID(req.session.user, user => {
        if(req.session.username == "admin"){
          res.render('purchaseOrder', { 
            isAdmin: true,
            supplyName: supplies,
            unit: units
          })
        }
        else {
          res.render('purchaseOrder', { 
            isAdmin: false, 
            supplyName: supplies,
            unit: units
          })
        }
      })
    })
  })
});

// Get expense page
router.get('/expense', loggedIn, (req, res) => {
  console.log("Read expense successful!");
  expenseController.getAllExpense(req, expenses => {
    userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('expense', { 
          isAdmin: true,
          expense: expenses,
        })
      }
      else {
        res.render('expense', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get add expense page
router.get('/expense/add', loggedIn, (req, res) => {
  console.log("Read add expense successful!");
  userController.getID(req.session.user, user => {
    if(req.session.username == "admin"){
      res.render('addExpense', { 
        isAdmin: true
      })
    }
    else {
      res.render('addExpense', { 
        isAdmin: false
      })
    }
  })
});

// Get order history report page
router.get('/order_history', loggedIn, (req, res) => {
  console.log("Read order history successful!");
  reportsController.orderHistory(req, orderHistory  => {
    userController.getID(req.session.user, user => {
      var today = new Date();
      if(req.session.username == "admin"){
        res.render('orderHistory', { 
          isAdmin: true,
          orderList: orderHistory,
          today: today,
          timestamp: new Date()
        })
      }
      else {
        res.render('orderHistory', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get order history filter report page
router.get('/order_history/filter', loggedIn, (req, res) => {
  console.log("Read order history filter successful!");
  reportsController.orderHistory(req, orderHistory  => {
    userController.getID(req.session.user, user => {
      var startDate = req.query.ordfromDate;
      var endDate = req.query.ordToDate;
      if(req.session.username == "admin"){
        res.render('orderHistory', { 
          isAdmin: true,
          orderList: orderHistory,
          filterDate: true,
          startDate: startDate,
          endDate: endDate,
          timestamp: new Date()
        })
      }
      else {
        res.render('orderHistory', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get sales report page
router.get('/sales_report', loggedIn, (req, res) => {
  console.log("Read sales report successful!");
  reportsController.salesReport(req, sales => {
    userController.getID(req.session.user, user => {
      var today = new Date();
      var i, totalAmount = 0;

      for(i = 0; i < sales.length; i++){
        totalAmount += sales[i].subTotal; 
      }
      
      if(req.session.username == "admin"){
        res.render('salesReport', { 
          isAdmin: true,
          products: sales,
          totalAmount: totalAmount,
          today: today,
          timestamp: new Date()
        })
      }
      else {
        res.render('salesReport', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get sales report page
router.get('/sales_report/filter', loggedIn, (req, res) => {
  console.log("Read sales report filter successful!");
  reportsController.salesReport(req, sales => {
    userController.getID(req.session.user, user => {
      var startDate = req.query.salfromDate;
      var endDate = req.query.salToDate;
      var i, j, totalAmount = 0;

      for(i = 0; i < sales.length; i++){
        totalAmount += sales[i].subTotal; 
      }

      if(req.session.username == "admin"){
        res.render('salesReport', { 
          isAdmin: true,
          products: sales,
          filterDate: true,
          totalAmount: totalAmount,
          startDate: startDate,
          endDate: endDate,
          timestamp: new Date()
        })
      }
      else {
        res.render('salesReport', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get inventory report page
router.get('/inventory_report', loggedIn, (req, res) => {
  console.log("Read inventory report successful!");
  //expenseController.getExpenseName(req, expense => {
    //userController.getID(req.session.user, user => {
      if(req.session.username == "admin"){
        res.render('inventoryReport', { 
          isAdmin: true,
          //expenseName: expense
        })
      }
      else {
        res.render('inventoryReport', { 
          isAdmin: false,
          //expenseName: expense
        })
      }
    //})
  //})
});


// Get purchase report page
router.get('/purchase_report', loggedIn, (req, res) => {
  console.log("Read purchase report successful!");
  reportsController.purchaseReport(req, purchase => {
    userController.getID(req.session.user, user => {
      var start = new Date((new Date() - (7 * 24 * 60 * 60 * 1000)));
      var end = new Date();
      var i, totalAmount = 0;

      for(i = 0; i < purchase.length; i++){
        totalAmount += purchase[i].subTotal; 
      }

      if(req.session.username == "admin"){
        res.render('purchaseReport', { 
          isAdmin: true,
          purchase: purchase,
          startDate: start,
          endDate: end,
          totalAmount: totalAmount,
          timestamp: new Date()
        })
      }
      else {
        res.render('purchaseReport', { 
          isAdmin: false,
        })
      }
    })
  })
});

// Get purchase report page
router.get('/purchase_report/filter', loggedIn, (req, res) => {
  console.log("Read purchase report filter successful!");
  reportsController.purchaseReport(req, purchase => {
    userController.getID(req.session.user, user => {
      var startDate = req.query.ordfromDate;
      var endDate = req.query.ordToDate;
      var i, totalAmount = 0;

      for(i = 0; i < purchase.length; i++){
        totalAmount += purchase[i].subTotal; 
      }

      if(req.session.username == "admin"){
        res.render('purchaseReport', { 
          isAdmin: true,
          purchase: purchase,
          filterDate: true,
          startDate: startDate,
          endDate: endDate,
          timestamp: new Date(),
          totalAmount: totalAmount
        })
      }
      else {
        res.render('purchaseReport', { 
          isAdmin: false
        })
      }
    })
  })
});

// Get  profitability page
router.get('/profitability', loggedIn, (req, res) => {
  console.log("Read profitability report successful!");
  expenseController.getAllExpense(req, expenses => {
    reportsController.profitReport(req, total => {
      reportsController.profitExpReport(req, expTotal => {
        reportsController.getNetIncome(req, netIncome => {
          userController.getID(req.session.user, user => {
            if(req.session.username === "admin"){
              res.render('profitability', { 
                isAdmin: true,
                expenseDetails: expenses,
                sales: total,
                totalExpenses: expTotal,
                timestamp: new Date(),
                netIncome: netIncome
              })
            }
            else {
              res.render('profitability', { 
                isAdmin: false,
                
              })
            }
          })
        })
      })
    })
  })
});

router.get('/getIngredients', (req, res) => {
  ingredientController.getIngredientName(req.query.name, ing => {
      console.log(ing);
      res.status(200).send(ing);
  });
});

router.get('/getSupplies', (req, res) => {
  supplyController.getSupplyName(req.query.name, supply => {
      console.log(supply);
      res.status(200).send(supply);
  });
});

router.get('/getUnit', (req, res) => {
  unitController.getUnitID(req, unit => {
      console.log(unit);
      res.status(200).send(unit);
  });
});

// router.get('/getExpense', (req, res) => {
//   expenseController.getExpenseName(req.query.name, expense => {
//         console.log(expense);
//         res.status(200).send(expense);
//   });
// });

// Logout
router.get('/logout', loggedIn, userController.logoutUser);

// POST methods for form submissions
router.post('/login', loginValidation, userController.loginUser);
router.post('/products/add', loggedIn, productController.addProduct);
router.post('/products/edit', loggedIn, productController.editProduct);
router.post('/unit/name', loggedIn, unitController.getUnitID);
router.post('/supplies/add', loggedIn, supplyController.addSupply);
router.post('/ingredients/add', loggedIn, ingredientController.addIngredient);
router.post('/purchase/add', loggedIn, addPurchaseValidation, purchaseController.addPurchase);
router.post('/purchase/order', loggedIn, purchaseController.sendEmail);
router.post('/expense/add', loggedIn, expenseController.addExpense);
router.post('/ingredient/update', loggedIn, ingredientController.updateStock);
router.post('/checkout', loggedIn, billingController.checkout);

module.exports = router;