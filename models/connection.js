const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/o&sdb';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
};

mongoose.set('useCreateIndex', true);

mongoose.connect(databaseURL, options);
module.exports = mongoose;