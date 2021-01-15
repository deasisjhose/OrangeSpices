const mongoose = require('./connection');

const purchaseSupplySchema = new mongoose.Schema({
  purchaseDate: { type: Date, required: true },
  supplyID: { type: mongoose.Schema.Types.ObjectId, ref: 'supply', required: true }, 
  purchaseQty: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  totalPrice: { type: Number, required: false }
});

const Purchase = mongoose.model('purchase', purchaseSupplySchema);

// Add purchase
exports.add = function(obj, next) {
  const purchase = new Purchase(obj);
    purchase.save(function(err, purchase) {
      next(err, purchase);
    });
};

// Get all purchases
exports.getAll = (param, next) => {
  Purchase.find({}).populate('supplyID').exec((err, purchase) => next(err, purchase));
};

// for displaying purchases grouped by date
exports.getPurchase = (param, next) => {
  Purchase.aggregate(
  [
    { '$lookup': {
      'from': 'supplies',
      'localField': 'supplyID',
      'foreignField': '_id',
      'as': 'supp'
      }
    },
    { '$unwind': '$supp' },
    { '$group': 
      {
        _id: { 
          month: { $month: "$purchaseDate" },
          day: { $dayOfMonth: "$purchaseDate" },
          year: { $year: "$purchaseDate" }
        }, 
        purchaseDate: { "$first": "$purchaseDate" }, 
        supplyName: { "$push": "$supp.brandName" },
        purchaseQty: { "$push": "$purchaseQty" },
        expiryDate: { "$push": "$expiryDate" },
        price: { "$push": "$purchasePrice" },
        subTotal: { "$push": "$totalPrice" }
      }
    },
    {
      $sort : { 'purchaseDate' : -1 }
    },
    {
      '$project':
      {
        purchaseDate: 1,
        supplyName: 1,
        purchaseQty: 1,
        totalQuantity: 1,
        expiryDate: 1,
        price: 1,
        subTotal: 1
      }
    }
  ]).exec((err, purchase) => next(err, purchase));
};

// Get all purchase
exports.getAllPurchase = (param, next) => {
  Purchase.aggregate(
  [
    { '$lookup': {
      'from': 'supplies',
      'localField': 'supplyID',
      'foreignField': '_id',
      'as': 'supply'
      }
    }
  ]).exec((err, purchase) => next(err, purchase));
};