const discrepancyModel = require('../models/Discrepancy');
const supplyModel = require('../models/Supplies');
const { validationResult } = require('express-validator');

exports.checkDiscrepancy = (req, res) => {
    const errors = validationResult(req);
    const { physicalCount, id } = req.body;

    if(errors.isEmpty()){
        if(physicalCount != ""){
            supplyModel.getByID(id, (err, result) => {
                console.log(result);
                var stock = result.totalSupply;
                if(physicalCount == stock){
                    req.flash('error_msg', 'System count and physical count are the same.');
                }
                else {
                    var discrepancy = {
                       physicalCount: physicalCount,
                       date: Date.now(),
                       supplyID: id
                    };
                    console.log("discrepancy");
                    console.log(discrepancy);
                    
                    discrepancyModel.add(discrepancy, function(err, result){
                        if (err) {
                            throw err;
                        } else {
                            console.log('Discrepancy added!');
                            console.log(result);
                        }
                    })
                }
            })
        }
        else {
            req.flash('error_msg', 'Please enter physical count.');
        }
    }
    res.redirect('/supplies');
};