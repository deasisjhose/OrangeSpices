const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const ingredientModel = require('../models/Ingredients');
const prodIngModel = require('../models/productIngredients');
const { validationResult } = require('express-validator');

// Double checking ingredients
exports.checkIngredients = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var i;
        var id = req.body.id;
        var qty = req.body.orderQuantity;

        prodIngModel.getIngredients(id, function(err, prodIng){
            if (err) {
                console.log("Could not find product ingredients.");
                console.log(err);
            } else {
                var total;

                for(i = 0; i < prodIng.length; i++){
                    total = qty * prodIng[i].quantityNeeded;
                    console.log("items to reduce");
                    console.log(total);

                    ingredientModel.getByID(prodIng[i].ingredientID, function(err, ingredient){
                        if(ingredient.totalQuantity < total){
                            console.log("Not enough ingredients in controller");
                            res.status(400).send();
                        }
                        else {
                            console.log("ingredients enough in controller.");
                            res.status(200).send();
                        }
                    })
                }
            }
        })
    }
};

// After clicking checkout
exports.checkout = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var i, j, k;
        var idList = req.body.id;
        var prodList = req.body.productName;
        var qtyList = req.body.orderQuantity;
        var priceList = req.body.productPrice;
        var subList = req.body.subTotal;
        var totalAmount = req.body.totalAmount;
        var orderList = {
            orderDate: Date.now(),
            totalAmount: totalAmount
        }
        var quantity;

        for(i = 0; i < idList.length; i++){
            quantity = qtyList[i];
            prodIngModel.getIngredients(idList[i], function(err, prodIng){
                if (err) {
                    console.log("Could not find product ingredients.");
                    console.log(err);
                } else {
                    var total = [];
                    
                    for(j = 0; j < prodIng.length; j++){
                        total[j] = quantity * prodIng[j].quantityNeeded;

                        var reduceStock = {
                            $inc: {
                                totalQuantity: -total[j]
                            }
                        };

                        ingredientModel.updateStock(prodIng[j].ingredientID, reduceStock, function(err, result){
                            if (err) {
                                console.log("Could not reduce ingredients.");
                                console.log(err);
                                res.status(500).send("Could not reduce ingredients.");
                            }
                            else {
                                console.log("Ingredient stock reduced!");
                                console.log(result);
                                
                                orderListModel.add(orderList, function(err, result) {
                                    if (err) {
                                        console.log("Could not add orderList.");
                                        console.log(err);
                                    } else {
                                        for(k = 0; k < idList.length; k++){
                                            var order = {
                                                productID: idList[k],
                                                orderListID: result._id, 
                                                productName: prodList[k],
                                                orderQuantity: qtyList[k],
                                                productPrice: priceList[k],
                                                subTotal: subList[k]
                                            }

                                            orderModel.add(order, function(err, result){
                                                if (err) {
                                                    console.log("Could not add order.");
                                                    console.log(err);
                                                } else {
                                                    console.log(result);
                                                    res.status(200).send();
                                                }
                                            })
                                        }
                                        console.log("Order saved!");
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/POS');
    }
};