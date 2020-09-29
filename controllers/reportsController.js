const productModel = require('../models/Product');
const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const { validationResult } = require('express-validator');

exports.getSales = (req, res) => {
    var i, j;
    var quantity = [], total = 0;

    productModel.getAll(req, (err, product) => {
        var products = [];
        product.forEach(function(doc) {
            products.push(doc.toObject());
        });
        //productID = result._id;
        // console.log("product");
        // console.log(productID);

        orderModel.getAll(req, (err, order) => {
            var orders = [];
            order.forEach(function(doc) {
                orders.push(doc.toObject());
            });
            //orderID = result._id;
            // console.log("order");
            // console.log(orderID);
            
            // console.log("products[4]._id");
            // console.log(products[4]._id);
            // console.log("products[4].prodName");
            // console.log(products[4].prodName);

            // console.log("orders[0].productName._id");
            // console.log(orders[0].productID._id);
            // console.log("orders[0].productName");
            // console.log(orders[0].productName);
            
            

            for(i = 0; i < products.length; i++){
                for(j = 0; j < orders.length; j++){
                    // console.log("products[i]._id");
                    // console.log(products[i]);
                    // console.log("orders[j].productID");
                    //console.log(orders[j].productID);
                    if(products[i]._id == orders[j].productID){
                        console.log("dapat merong pasok dito");
                        // console.log("products[i]._id");
                        // console.log(products[i]._id);
                        // console.log("orders[j].productID._id");
                        // console.log(orders[j].productID._id);
                        // quantity[i] = quantity[i] + orders[j].productID.orderQuantity;
                        // console.log(quantity[i]);
                    }
                }
            }
        })
    })
};

exports.orderHistory = (req, res) => {
    //if(){ // if statement for the date range
        orderListModel.getAll(req, (err, list) => {
            if(err){
                req.flash('error_msg', 'Could not get order lsit.');
                res.redirect('/order_history');
            } else {
                console.log("list");
                console.log(list);
                for (var i= 0; i < list.length; i++){
                    
                    // console.log("list[0]");
                    // console.log(list[0]);
                    console.log("list[i].orders");
                    console.log(list[i].orders);
                    // console.log("list[0].orders[0]");
                    // console.log(list[0].orders[0]);
                    // console.log("list[0].orders[0].productName");
                    // console.log(list[0].orders[0].productName);
                }
                
                res(list);
            }
        })
    //}
};