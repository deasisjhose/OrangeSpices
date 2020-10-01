const purchaseModel = require('../models/PurchaseSupplies');
const ingredientModel = require('../models/Ingredients');
const supplyModel = require('../models/Supplies');

const { validationResult } = require('express-validator');

//Getting all purchase
exports.getAllPurchase = (param, callback) => {
    purchaseModel.getAll(param, (err, purchase) => {
        if (err) throw err;

        const purchasesObjects = [];

        purchase.forEach(function(doc) {
            purchasesObjects.push(doc.toObject());
        });

        callback(purchasesObjects);
    });
};

// Adding purchase
exports.addPurchase = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const purchDate = req.body.purchDate;
        const supplyName = req.body.supplyName;
        const numItems = req.body.numItems;
        const expDate = req.body.expDate;
        const purchPrice = req.body.purchPrice;

        if (supplyName == "Select supply name...") {
            req.flash('error_msg', 'Please select supply name.');
            res.redirect('/purchase/add');
        } else if (purchDate == "" && expDate != "") {
            req.flash('error_msg', 'Please select purchase date.');
            res.redirect('/purchase/add');
        } else if (purchDate != "" && expDate == "") {
            req.flash('error_msg', 'Please select expiry date.');
            res.redirect('/purchase/add');
        } else if (purchDate == "" && expDate == "") {
            req.flash('error_msg', 'Please select dates.');
            res.redirect('/purchase/add');
        } else {
            var total;
            total = numItems * purchPrice;

            var purchase = {
                purchaseDate: purchDate,
                supplyID: supplyName,
                purchaseQty: numItems,
                expiryDate: expDate,
                purchasePrice: purchPrice,
                totalPrice: total
            }

            purchaseModel.add(purchase, function(err, result) {
                if (err) {
                    console.log(err);
                    req.flash('error_msg', 'Could not add purchase. Please try again.');
                    res.redirect('/purchase/add');
                } else {
                    var suppID = result.supplyID;
                    var quantity = result.purchaseQty;
                    var unitQuantity, total;
                    var ingID;

                    supplyModel.getByID(suppID, (err, supply) => {
                        if (err) {
                            req.flash('error_msg', 'Could not find supply.');
                            res.redirect('/purchase/add');
                        } else {
                            ingID = supply.ingredientID;
                            unitQuantity = supply.unitQuantity;
                            total = quantity * unitQuantity;

                            var updateStock = {
                                $inc: {
                                    totalSupply: total
                                }
                            };

                            supplyModel.updateStock(suppID, updateStock, (err, result) => {
                                if (err) {
                                    req.flash('error_msg', 'Could not update supply stock.');
                                    res.redirect('/purchase/add');
                                } else {
                                    ingredientModel.getByID(ingID, (err, ingredient) => {
                                        if (err) {
                                            req.flash('error_msg', 'Could not find ingredient.');
                                            res.redirect('/purchase/add');
                                        } else {
                                            var ingUpd = {
                                                $inc: {
                                                    totalQuantity: total
                                                }
                                            }

                                            ingredientModel.updateIngredient(ingID, ingUpd, (err, result) => {
                                                if (err) {
                                                    req.flash('error_msg', 'Could not update ingredient.');
                                                    res.redirect('/supplies');
                                                } else {
                                                    console.log("Purchase added!");
                                                    res.status(200).send();
                                                }
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/purchase/add');
    }
};

exports.getIngredientName = (param, callback) => {
    ingredientModel.getName({ ingredientName: true }, (err, ingredients) => {
        if (err) throw err;

        const ingredientsObjects = [];

        ingredients.forEach(function(doc) {
            ingredientsObjects.push(doc.toObject());
        });

        callback(ingredientsObjects);
    });
};