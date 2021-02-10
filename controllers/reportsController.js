const productModel = require('../models/Product');
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
                
                
                console.log("listObjects");
                console.log(listObjects);
                
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
                console.log("temp sales rep");
                console.log(temp);

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
                                console.log()
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
                ordersArray.sort((a,b) => (a.productName > b.productName) ? 1 : ((b.productName > a.productName) ? -1 : 0));
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
                listObjects.sort((a,b) => (a.orders.productName > b.orders.productName) ? 1 : ((b.orders.productName > a.orders.productName) ? -1 : 0));

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
                ordersArray.sort((a,b) => (a.productName > b.productName) ? 1 : ((b.productName > a.productName) ? -1 : 0));
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
                var temp = [], dailySales = [];
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
exports.inventoryReport = function(req, res){
    var sDate = req.query.ordfromDate;
    var eDate = req.query.ordToDate;
    
    if(sDate == undefined && eDate == undefined){
        var startDate = new Date(new Date().setHours(00,00,00));
        var endDate = new Date(new Date().setHours(23,59,59));

        orderListModel.getProductIngredientsList(req, (err, ingredients) => {
            console.log("ingredients");
            console.log(ingredients);
            var ordersObjects = ingredients.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the day
            ordersObjects.sort((a,b) => (a.ingredients.ingredientName > b.ingredients.ingredientName) ? 1 : ((b.ingredients.ingredientName > a.ingredients.ingredientName) ? -1 : 0));

            var i, j, temp = [], ingredients = [], inventoryReport = [];
            console.log("ordersObjects");
            console.log(ordersObjects);
            for(i = 0; i < ordersObjects.length; i++){
                temp.push({
                    ingredientID: ordersObjects[i].prodIng.ingredientID,
                    ingredientName: ordersObjects[i].ingredients.ingredientName,
                    usedInventory: ordersObjects[i].orders.orderQuantity * ordersObjects[i].prodIng.quantityNeeded,
                    endingInventory: ordersObjects[i].ingredients.totalQuantity,
                    unitName: ordersObjects[i].units.unitName
                })
            }

            for(i = 0; i < temp.length; i++){
                if(i == 0){;
                    inventoryReport.push({
                        ingredientID: temp[i].ingredientID,
                        ingredientName: temp[i].ingredientName,
                        startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                        usedInventory: temp[i].usedInventory,
                        endingInventory: temp[i].endingInventory,
                        unitName: temp[i].unitName
                    })
                }
                else {
                    for(j = 0; j < inventoryReport.length; j++){
                        if(inventoryReport[j].ingredientName == temp[i].ingredientName){
                            inventoryReport[j].usedInventory += temp[i].usedInventory;
                            inventoryReport[j].startingInventory += temp[i].usedInventory;
                            break;
                        } 
                        if(j == inventoryReport.length-1){
                            inventoryReport.push({
                                ingredientID: temp[i].ingredientID,
                                ingredientName: temp[i].ingredientName,
                                startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                                usedInventory: temp[i].usedInventory,
                                endingInventory: temp[i].endingInventory,
                                unitName: temp[i].unitName
                            })
                            break;
                        }
                    }
                }
            }
            console.log("inventoryReport");
            console.log(inventoryReport);
            res(inventoryReport);
        })
    } else if(sDate == eDate){
        var startDate = new Date(sDate);
        var endDate = new Date(eDate).setHours(23,59,59);

        orderListModel.getProductIngredientsList(req, (error, ingredients) => {
            var ordersObjects = ingredients.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the day
            ordersObjects.sort((a,b) => (a.ingredients.ingredientName > b.ingredients.ingredientName) ? 1 : ((b.ingredients.ingredientName > a.ingredients.ingredientName) ? -1 : 0));

            var i, j, temp = [], ingredients = [], inventoryReport = [];

            for(i = 0; i < ordersObjects.length; i++){
                temp.push({
                    ingredientID: ordersObjects[i].prodIng.ingredientID,
                    ingredientName: ordersObjects[i].ingredients.ingredientName,
                    usedInventory: ordersObjects[i].orders.orderQuantity * ordersObjects[i].prodIng.quantityNeeded,
                    endingInventory: ordersObjects[i].ingredients.totalQuantity,
                    unitName: ordersObjects[i].units.unitName
                })
            }

            for(i = 0; i < temp.length; i++){
                if(i == 0){;
                    inventoryReport.push({
                        ingredientID: temp[i].ingredientID,
                        ingredientName: temp[i].ingredientName,
                        startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                        usedInventory: temp[i].usedInventory,
                        endingInventory: temp[i].endingInventory,
                        unitName: temp[i].unitName
                    })
                }
                else {
                    for(j = 0; j < inventoryReport.length; j++){
                        if(inventoryReport[j].ingredientName == temp[i].ingredientName){
                            inventoryReport[j].usedInventory += temp[i].usedInventory;
                            inventoryReport[j].startingInventory += temp[i].usedInventory;
                            break;
                        } 
                        if(j == inventoryReport.length-1){
                            inventoryReport.push({
                                ingredientID: temp[i].ingredientID,
                                ingredientName: temp[i].ingredientName,
                                startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                                usedInventory: temp[i].usedInventory,
                                endingInventory: temp[i].endingInventory,
                                unitName: temp[i].unitName
                            })
                            break;
                        }
                    }
                }
            }
            console.log("inventoryReport");
            console.log(inventoryReport);
            res(inventoryReport);
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        orderListModel.getProductIngredientsList(req, (error, ingredients) => {
            var ordersObjects = ingredients.filter(e => e.orderDate >= startDate && e.orderDate <= endDate); // filter documents within the day
            ordersObjects.sort((a,b) => (a.ingredients.ingredientName > b.ingredients.ingredientName) ? 1 : ((b.ingredients.ingredientName > a.ingredients.ingredientName) ? -1 : 0));

            var i, j, temp = [], ingredients = [], inventoryReport = [];

            for(i = 0; i < ordersObjects.length; i++){
                temp.push({
                    ingredientID: ordersObjects[i].prodIng.ingredientID,
                    ingredientName: ordersObjects[i].ingredients.ingredientName,
                    usedInventory: ordersObjects[i].orders.orderQuantity * ordersObjects[i].prodIng.quantityNeeded,
                    endingInventory: ordersObjects[i].ingredients.totalQuantity,
                    unitName: ordersObjects[i].units.unitName
                })
            }
            
            for(i = 0; i < temp.length; i++){
                if(i == 0){;
                    inventoryReport.push({
                        ingredientID: temp[i].ingredientID,
                        ingredientName: temp[i].ingredientName,
                        startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                        usedInventory: temp[i].usedInventory,
                        endingInventory: temp[i].endingInventory,
                        unitName: temp[i].unitName
                    })
                }
                else {
                    for(j = 0; j < inventoryReport.length; j++){
                        if(inventoryReport[j].ingredientName == temp[i].ingredientName){
                            inventoryReport[j].usedInventory += temp[i].usedInventory;
                            inventoryReport[j].startingInventory += temp[i].usedInventory;
                            break;
                        } 
                        if(j == inventoryReport.length-1){
                            inventoryReport.push({
                                ingredientID: temp[i].ingredientID,
                                ingredientName: temp[i].ingredientName,
                                startingInventory: temp[i].usedInventory + temp[i].endingInventory,
                                usedInventory: temp[i].usedInventory,
                                endingInventory: temp[i].endingInventory,
                                unitName: temp[i].unitName
                            })
                            break;
                        }
                    }
                }
            }
            console.log("inventoryReport");
            console.log(inventoryReport);
            res(inventoryReport);
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