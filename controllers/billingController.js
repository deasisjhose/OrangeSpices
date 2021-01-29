const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const ingredientModel = require('../models/Ingredients');
const prodIngModel = require('../models/productIngredients');
const { validationResult } = require('express-validator');

// Double checking ingredients
exports.checkIngredients = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var i, j;
        var idList = req.body.id;
        var qtyList = req.body.orderQuantity;

        for(i = 0; i < idList.length; i++){
            prodIngModel.getIngredients(idList[i], function(err, prodIng){
                if (err) {
                    console.log("Could not find product ingredients.");
                    console.log(err);
                } else {
                    for(j = 0; j < prodIng.length; j++){
                        var total = [];
                        total[j] = qtyList[i] * prodIng[j].quantityNeeded;
    
                        var reduceStock = {
                            $inc: {
                                totalQuantity: -total[j]
                            }
                        };
    
                        ingredientModel.getByID(prodIng[j].ingredientID, function(err, ingredient){
                            if(ingredient.totalQuantity < total[j]){
                                console.log("Not enough ingredients!");
                                res.status(400).send("Ingredient not enough!");
                            }
                            else {
                                ingredientModel.updateStock(ingredient._id, reduceStock, (err, result) => {
                                    if (err) {
                                        console.log("Could not reduce ingredients.");
                                        console.log(err);
                                    }
                                    else {
                                        console.log("Ingredient stock reduced!");
                                        console.log(result);
        
                                        
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
};

// After clicking checkout
exports.checkout = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var i, j;
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

        orderListModel.add(orderList, function(err, result) {
            if (err) {
                console.log(err);
                req.flash('error_msg', 'Could not add order list.');
                res.redirect('/POS');
            } else {
                for(i = 0; i < idList.length; i++){
                    var order = {
                        productID: idList[i],
                        orderListID: result._id, 
                        productName: prodList[i],
                        orderQuantity: qtyList[i],
                        productPrice: priceList[i],
                        subTotal: subList[i]
                    }

                    orderModel.add(order, function(err, result){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    })
                }
                console.log("Order saved!");
            }
        })
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/POS');
    }
};