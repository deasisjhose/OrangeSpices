const nodemailer = require('nodemailer');
const purchaseModel = require('../models/PurchaseSupplies');
const ingredientModel = require('../models/Ingredients');
const supplyModel = require('../models/Supplies');

const { validationResult } = require('express-validator');

// Sending purchase order via email
exports.sendEmail = (req, res) => {
    var supplierName = req.body.supplierName;
    var supplierEmail = req.body.supplierEmail;
    var orders = req.body.orders;

    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'orangeandspices.system@gmail.com',
            pass: 'orange&spices'
        }
    });

    var content = 
    '<p>Hi, '+ supplierName + '!</p><p>This is the owner of Orange & Spices. We would like to order the following: </p><br>'
    + '<div><table style="width: 60%; margin-bottom: 1rem; text-align: center!important; font-size: 12px !important;"><thead><tr><th>Item</th><th>No. of Items</th></tr></thead><tbody>';
    orders.forEach((orders) => {
        content += '<tr><td>' + orders.selectedValue +'</td><td>' + orders.numItems + '</td>'
    });
    content += '</tbody></table></div>';
    
    var mailOptions = {
        from: 'orangeandspices.system@gmail.com',
        to: supplierEmail,
        subject: 'Order Request!',
        html: content
    };
    smtpTransport.sendMail(mailOptions, function(error) {
        if (error){
            console.log(error);
            res.status(400).send();
        }
        smtpTransport.close();
        res.status(200).send();
    });
};

// Getting all purchase
exports.getAllPurchase = (req, res) => {
    var sDate = req.query.fromDate;
    var eDate = req.query.toDate;

    if(sDate == undefined && eDate == undefined){
        purchaseModel.getPurchase(req, (err, purchase) => {
            if(err){
                console.log("Getting all purchase erorr");
                console.log(err);
            } else {
                var i, j, temp = [], purchaseArray = [];

                for(i = 0; i < purchase.length; i++){
                    for(j = 0; j < purchase[i].supplyName.length; j++){
                        temp.push({
                            supplyName: purchase[i].supplyName[j],
                            purchaseQty: purchase[i].purchaseQty[j],
                            expiryDate: purchase[i].expiryDate[j],
                            price: purchase[i].price[j],
                            subTotal: purchase[i].subTotal[j]
                        })
                    }
                    purchaseArray.push({
                        _id: purchase[i]._id,
                        purchaseDate: purchase[i].purchaseDate,
                        purchaseDetails: temp
                    })
                    temp = [];
                }
                console.log(purchaseArray);
                res(purchaseArray);
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        purchaseModel.getPurchase(req, (err, purchase) => {
            if(err){
                console.log("Getting all purchase erorr");
                console.log(err);
            } else {
                var i, j, temp = [], purchaseArray = [];
                var listObjects = purchase.filter(e => e.purchaseDate >= startDate && e.purchaseDate <= endDate);
                
                for(i = 0; i < listObjects.length; i++){
                    for(j = 0; j < listObjects[i].supplyName.length; j++){
                        temp.push({
                            supplyName: listObjects[i].supplyName[j],
                            purchaseQty: listObjects[i].purchaseQty[j],
                            expiryDate: listObjects[i].expiryDate[j],
                            price: listObjects[i].price[j],
                            subTotal: listObjects[i].subTotal[j]
                        })
                    }
                    purchaseArray.push({
                        _id: listObjects[i]._id,
                        purchaseDate: listObjects[i].purchaseDate,
                        purchaseDetails: temp
                    })
                    temp = [];
                }
                res(purchaseArray);
            }
        })        
    }
};

// Adding purchase
exports.addPurchase = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var i;
        const purchDate = req.body.purchDate;
        const idSupplyList = req.body.idSupplyList;
        const supplyList = req.body.supplyList;
        const numItems = req.body.numItems;
        const expDate = req.body.expDate;
        const purchPrice = req.body.purchPrice;
        const totalPrice = [];

        for(i = 0; i < idSupplyList.length; i++){
            totalPrice[i] = numItems[i] * purchPrice[i];

            var purchaseList = {
                purchaseDate: purchDate,
                supplyID: idSupplyList[i],
                purchaseQty: numItems[i],
                expiryDate: expDate[i],
                purchasePrice: purchPrice[i],
                totalPrice: totalPrice[i]
            }

            purchaseModel.add(purchaseList, function(err, result) {
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
    
                                            ingredientModel.updateStock(ingID, ingUpd, (err, result) => {
                                                if (err) {
                                                    req.flash('error_msg', 'Could not update ingredient.');
                                                    res.redirect('/supplies');
                                                } else {
                                                    console.log("Purchase added!");
                                                }
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
                req.flash('sucess_msg', 'Purchase added!');
                res.status(200).send();
            })   
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/purchase/add');
    }
};

// Get ingredient name
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