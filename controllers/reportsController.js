const productModel = require('../models/Product');
const prodIngModel = require('../models/productIngredients');
const orderModel = require('../models/Order');
const expenseModel = require('../models/Expense');
const orderListModel = require('../models/OrderList');
const ingredientModel = require('../models/Ingredients');
const purchaseModel = require('../models/PurchaseSupplies');
const { validationResult } = require('express-validator');

// Order history report
exports.orderHistory = (req, res) => {
    var sDate = req.query.ordfromDate;
    var eDate = req.query.ordToDate;
    
    if(sDate == undefined && eDate == undefined){ 
        var start = new Date(new Date().setHours(00,00,00))
        var end = new Date(new Date().setHours(23,59,59));

        orderListModel.getOrderHistory(req,(err, list) => {
            if(err){
                console.log("order history error");
                console.log(err);
            } else {
                var listObjects = list.filter(e => e.orderDate >= start && e.orderDate <= end); // filter documents within the day

                console.log("listObjects");
                console.log(listObjects);

                res(listObjects);
            }
        })
    } else if (sDate == eDate){ // if date range is same day
        var startDate = new Date(sDate);
        var endDate = new Date(eDate).setHours(23,59,59);
        
        orderListModel.getOrderHistory(req, (err, list) => {
            if(err){
                console.log("order history error");
                console.log(err);
            } else {
                var listObjects = list.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the date range

                console.log("listObjects");
                console.log(listObjects);
                        
                res(listObjects);
            }
        })

    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        orderListModel.getOrderHistory(req, (err, list) => {
            if(err){
                console.log("order history error");
                console.log(err);
            } else {
                endDate.setDate(endDate.getDate()+1);
                var listObjects = list.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the date range

                console.log("listObjects");
                console.log(listObjects);
                        
                res(listObjects);
            }
        })
    }
};

// Sales report
exports.salesReport = (req, res) => {
    var sDate = req.query.salfromDate;
    var eDate = req.query.salToDate;

    if(sDate == undefined && eDate == undefined){
        var start = new Date(new Date().setHours(00,00,00))
        var end = new Date(new Date().setHours(23,59,59));

        orderListModel.getOrderHistory(req, (err, orders) => {
            if(err){
                console.log("Sales error");
                console.log(err);
            } else {
                var i, j;
                var temp = [], ordersArray = [];
                var listObjects = orders.filter(e => e.orderDate >= start && e.orderDate <= end); // filter documents within the day

                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].orders.length; j++){
                        temp.push({
                            productID: listObjects[i].orders[j].productID,
                            productName: listObjects[i].orders[j].productName,
                            orderQuantity: listObjects[i].orders[j].orderQuantity,
                            productPrice: listObjects[i].orders[j].productPrice,
                            subTotal: listObjects[i].orders[j].subTotal
                        })

                    }
                }

                for(i = 0; i < temp.length; i++){
                    if(i == 0){
                        ordersArray.push({
                            productID: temp[i].productID,
                            productName: temp[i].productName,
                            orderQuantity: temp[i].orderQuantity,
                            productPrice: temp[i].productPrice,
                            subTotal: temp[i].subTotal
                        })
                    }
                    else {
                        for(j = 0; j < ordersArray.length; j++){
                            if(temp[i].productName == ordersArray[j].productName){
                                ordersArray[j].orderQuantity += temp[i].orderQuantity;
                                ordersArray[j].subTotal += temp[i].subTotal;
                                break;
                            }
                            if(j == ordersArray.length-1){
                                ordersArray.push({
                                    productID: temp[i].productID,
                                    productName: temp[i].productName,
                                    orderQuantity: temp[i].orderQuantity,
                                    productPrice: temp[i].productPrice,
                                    subTotal: temp[i].subTotal
                                })
                                break;
                            }
                        }
                    }
                }
                console.log("ordersArray");
                console.log(ordersArray);
                res(ordersArray);
            }
        })
    } else if (sDate == eDate){
        var startDate = new Date(sDate);
        var endDate = new Date(eDate).setHours(23,59,59);

        orderListModel.getOrderHistory(req, (err, orders) => {
            if(err){
                console.log("Sales error");
                console.log(err);
            } else {
                var i, j, k;
                var temp = [], ordersArray = [];
                var listObjects = orders.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the day

                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].orders.length; j++){
                        temp.push({
                            productID: listObjects[i].orders[j].productID,
                            productName: listObjects[i].orders[j].productName,
                            orderQuantity: listObjects[i].orders[j].orderQuantity,
                            productPrice: listObjects[i].orders[j].productPrice,
                            subTotal: listObjects[i].orders[j].subTotal
                        })

                    }
                }

                for(i = 0; i < temp.length; i++){
                    if(i == 0){
                        ordersArray.push({
                            productID: temp[i].productID,
                            productName: temp[i].productName,
                            orderQuantity: temp[i].orderQuantity,
                            productPrice: temp[i].productPrice,
                            subTotal: temp[i].subTotal
                        })
                    }
                    else {
                        for(j = 0; j < ordersArray.length; j++){
                            if(temp[i].productName == ordersArray[j].productName){
                                ordersArray[j].orderQuantity += temp[i].orderQuantity;
                                ordersArray[j].subTotal += temp[i].subTotal;
                                break;
                            }
                            if(j == ordersArray.length-1){
                                ordersArray.push({
                                    productID: temp[i].productID,
                                    productName: temp[i].productName,
                                    orderQuantity: temp[i].orderQuantity,
                                    productPrice: temp[i].productPrice,
                                    subTotal: temp[i].subTotal
                                })
                                break;
                            }
                        }
                    }
                }
                console.log("ordersArray");
                console.log(ordersArray);
                res(ordersArray);
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate).setHours(23,59,59);

        orderListModel.getOrderHistory(req, (err, orders) => {
            if(err){
                console.log("Sales error");
                console.log(err);
            } else {
                var i, j;
                var temp = [], ordersArray = [], dailySales = [];
                var listObjects = orders.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents according to date range

                console.log("listObjects");
                console.log(listObjects);

                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].orders.length; j++){
                        console.log("listObjects[i].orders[j]");
                        console.log(listObjects[i].orders[j]);
                        temp.push({
                            orderDate: listObjects[i].orderDate,
                            subTotal: listObjects[i].orders[j].subTotal
                        })
                    }
                }

                for(i = 0; i < temp.length; i++){
                    if(i == 0){
                        dailySales.push({
                            orderDate: temp[i].orderDate,
                            subTotal: temp[i].subTotal
                        })
                    }
                    else {
                        for(j = 0; j < dailySales.length; j++){
                            if(temp[i].orderDate.getMonth()+1 == dailySales[j].orderDate.getMonth()+1 && 
                            temp[i].orderDate.getDate() == dailySales[j].orderDate.getDate() && 
                            temp[i].orderDate.getFullYear() == dailySales[j].orderDate.getFullYear()){
                                dailySales[j].subTotal += temp[i].subTotal;
                                break;
                            } 
                            if(j == dailySales.length-1){
                                dailySales.push({
                                    orderDate: temp[i].orderDate,
                                    subTotal: temp[i].subTotal
                                })
                                break;
                            }
                            console.log("dailySales");
                            console.log(dailySales);
                        }
                    }
                }
                res(dailySales);
            }
        })
    }
};

// Inventory report
exports.inventoryReport = (req, res) => {
    var sDate = req.query.fromDate;
    var eDate = req.query.toDate;
    var startDate = new Date(new Date().setHours(00,00,00))
    var endDate = new Date(new Date().setHours(23,59,59));
    var i, j;
    var orderQuantity, temp = [], ingredients = [], inventoryReport =[];

    if(sDate == undefined && eDate == undefined){
        orderModel.getAllOrders(req, function(err, orders){
            for(i = 0; i < orders.length; i++){
                if(orders[i].orderListID.orderDate >= startDate && orders[i].orderListID.orderDate <= endDate){ // getting orders within the day
                    orderQuantity = orders[i].orderQuantity;
                    console.log("orderQuantity1");
                    console.log(orderQuantity);
                    prodIngModel.getIngredientsList(orders[i].productID, function(err, ingredient){    // getting ingredients of per product

                        console.log("orderQuantity2");
                        console.log(orderQuantity);
                        for(j = 0; j < ingredient.length; j++){
                            
                            // temp.push({
                            //     productName: productName,
                            //     ingredientName: ingredient[j].ingredientID.ingredientName,
                            //     startingInventory: ingredient[j].quantityNeeded * orderQuantity + ingredients[j].ingredientID.totalQuantity,
                            //     usedInventory: ingredient[j].quantityNeeded * orderQuantity,
                            //     endingInventory: ingredient[j].ingredientID.totalQuantity
                            // })
                            temp.push({
                                ingredientID: ingredient[j].ingredientID._id,
                                ingredientName: ingredient[j].ingredientID.ingredientName,
                                usedInventory: ingredient[j].quantityNeeded * orderQuantity,
                            })
                            // console.log("temp");
                            // console.log(temp);
                        }

                        // grouping ingredients
                        for(i = 0; i < temp.length; i++){
                            if(i == 0){
                                ingredients.push({
                                    ingredientID: temp[i].ingredientID,
                                    ingredientName: temp[i].ingredientName,
                                    usedInventory: temp[i].usedInventory
                                })
                            }
                            else {
                                for(j = 0; j < ingredients.length; j++){
                                    if(temp[j].ingredientID._id == ingredients[j].ingredientID){
                                        ingredients[j].usedInventory += temp[j].usedInventory;
                                        break;
                                    } 
                                    if(j == ingredients.length-1){
                                        ingredients.push({
                                            ingredientID: temp[i].ingredientID,
                                            ingredientName: temp[i].ingredientName,
                                            quantityNeeded: temp[i].quantityNeeded,
                                            usedInventory: temp[i].usedInventory
                                        })
                                        break;
                                    }
                                }
                            }
                        }

                        // for(i = 0; i < ingredients.length; i++){
                        //     inventoryReport.push({
                        //         ingredientName: ingredients[i].ingredientName,
                        //         quantityNeeded: ingredients[i].quantityNeeded,
                        //         startingInventory: ingredients[i].usedInventory + ingredients[j].ingredientID.totalQuantity,
                        //         usedInventory: ingredients[i].usedInventory,
                        //         endingInventory: ingredient[j].ingredientID.totalQuantity
                        //     })
                        // }
                    })
                }
            }
            // res(inventoryReport);
        })
    }

    
};

// Purchase report
exports.purchaseReport = (req, res) => {
    var sDate = req.query.ordfromDate;
    var eDate = req.query.ordToDate;
    
    if(sDate == undefined && eDate == undefined){
        var start = new Date((new Date() - (7 * 24 * 60 * 60 * 1000)));
        var end = new Date();

        purchaseModel.getAllPurchase(req,(err, purchase) => {
            if(err){
                console.log("Purchase error");
                console.log(err);;
            } else {
                var i, j;
                var temp = [], purchaseArray = [];

                var listObjects = purchase.filter(e => e.purchaseDate >= start && e.purchaseDate <= end);

                console.log("listObjects");
                console.log(listObjects);

                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].supply.length; j++){
                        temp.push({
                            supplyID: listObjects[i].supplyID,
                            supplyName: listObjects[i].supply[j].brandName,
                            quantity: listObjects[i].purchaseQty,
                            productPrice: listObjects[i].purchasePrice,
                            subTotal: listObjects[i].totalPrice
                        })

                    }
                }

                for(i = 0; i < temp.length; i++){
                    if(i == 0){
                        purchaseArray.push({
                            supplyID: temp[i].supplyID,
                            supplyName: temp[i].supplyName,
                            quantity: temp[i].quantity,
                            productPrice: temp[i].productPrice,
                            subTotal: temp[i].subTotal
                        })
                    }
                    else {
                        for(j = 0; j < purchaseArray.length; j++){
                            if(temp[i].supplyName == purchaseArray[j].supplyName){
                                purchaseArray[j].quantity += temp[i].quantity;
                                purchaseArray[j].subTotal += temp[i].subTotal;
                                break;
                            }
                            if(j == purchaseArray.length-1){
                                purchaseArray.push({
                                    supplyID: temp[i].supplyID,
                                    supplyName: temp[i].supplyName,
                                    quantity: temp[i].quantity,
                                    productPrice: temp[i].productPrice,
                                    subTotal: temp[i].subTotal
                                })
                                break;
                            }
                        }
                    }
                }
                console.log("purchaseArray");
                console.log(purchaseArray);
                res(purchaseArray);
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        purchaseModel.getAllPurchase(req, (err, purchase) => {
            if(err){
                console.log("Purchase error");
                console.log(err);;
            } else {
                var i, j;
                var temp = [], purchaseArray = [];

                var listObjects = purchase.filter(e => e.purchaseDate >= startDate && e.purchaseDate <= endDate);

                console.log("listObjects");
                console.log(listObjects);

                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].supply.length; j++){
                        temp.push({
                            supplyID: listObjects[i].supplyID,
                            supplyName: listObjects[i].supply[j].brandName,
                            quantity: listObjects[i].purchaseQty,
                            productPrice: listObjects[i].purchasePrice,
                            subTotal: listObjects[i].totalPrice
                        })

                    }
                }

                for(i = 0; i < temp.length; i++){
                    if(i == 0){
                        console.log('1');
                        purchaseArray.push({
                            supplyID: temp[i].supplyID,
                            supplyName: temp[i].supplyName,
                            quantity: temp[i].quantity,
                            productPrice: temp[i].productPrice,
                            subTotal: temp[i].subTotal
                        })
                    }
                    else {
                        for(j = 0; j < purchaseArray.length; j++){
                            if(temp[i].supplyName == purchaseArray[j].supplyName){
                                console.log('2');
                                purchaseArray[j].quantity += temp[i].quantity;
                                purchaseArray[j].subTotal += temp[i].subTotal;
                                break;
                            }
                            if(j == purchaseArray.length-1){
                                console.log('3');
                                purchaseArray.push({
                                    supplyID: temp[i].supplyID,
                                    supplyName: temp[i].supplyName,
                                    quantity: temp[i].quantity,
                                    productPrice: temp[i].productPrice,
                                    subTotal: temp[i].subTotal
                                })
                                break;
                            }
                        }
                    }
                }
                console.log("purchaseArray");
                console.log(purchaseArray);
                res(purchaseArray);
            }
        })
    }
};

// Profitability total sales
exports.profitReport = (req, res) => {
    productModel.getTotalSales(req,(err, total) => {
        if(err){
            req.flash('error_msg', 'Could not get total sales.');
            res.redirect('/profitability');
        } else {
            console.log("total");
            console.log(total[0].totalSales);
            res(total[0].totalSales);
        }
    })
};

// Profitability total sales
exports.profitExpReport = (req, res) => {
    expenseModel.getTotalExpenses(req,(err, expenses) => {
        if(err){
            req.flash('error_msg', 'Could not get expenses.');
            res.redirect('/profitability');
        } else {
            console.log("total expenses");
            console.log(expenses[0].totalExpenses);
            res(expenses[0].totalExpenses);
        }
    })
};

// Getting net income
exports.getNetIncome = (req, res) => {
    expenseModel.getTotalExpenses(req,(err, expenses) => {
        productModel.getTotalSales(req,(err, total) => {
            var totalSales, totalExpenses, netIncome;
            if(err){
                req.flash('error_msg', 'Could not get purchases.');
                res.redirect('/profitability');
            } else {
                totalSales = total[0].totalSales;
                totalExpenses = expenses[0].totalExpenses;
                netIncome = totalSales - totalExpenses;
                console.log(netIncome);
                res(netIncome);
            }
        })
    })
};