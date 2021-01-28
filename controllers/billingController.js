const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const ingredientModel = require('../models/Ingredients');
const prodIngModel = require('../models/productIngredients');
const { validationResult } = require('express-validator');

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
        console.log('idList');
        console.log(idList);
        for(i = 0; i < idList.length; i++){
            prodIngModel.getIngredients(idList[i], (err, prodIng) => {
                if (err) {
                    console.log("Could not find product ingredients.");
                    console.log(err);
                } else {
                    console.log("prodIng");
                    console.log(prodIng);

                    for(j = 0; j < prodIng.length; j++){
                        var reduceStock = {
                            $inc: {
                                totalQuantity: -prodIng[j].quantityNeeded
                            }
                        };
                        ingredientModel.updateStock(prodIng[j].ingredientID, reduceStock, (err, result) => {
                            if (err) {
                                console.log("Could not reduce ingredients.");
                                console.log(err);
                            } else {
                                console.log("Ingredient stock reduced!");
                                console.log(result);
                                orderListModel.add(orderList, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        req.flash('error_msg', 'Could not add order list.');
                                        res.redirect('/POS');
                                    } else {
                                        for(j = 0; j < idList.length; j++){
                                            var order = {
                                                productID: idList[j],
                                                orderListID: result._id, 
                                                productName: prodList[j],
                                                orderQuantity: qtyList[j],
                                                productPrice: priceList[j],
                                                subTotal: subList[j]
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