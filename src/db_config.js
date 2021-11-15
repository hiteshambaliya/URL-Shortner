const mongoose = require('mongoose');
const DB_URI = 'mongodb+srv://<dbusername>:<password>@cluster0.74huv.mongodb.net/urlshortner?retryWrites=true&w=majority'

mongoose.connect(DB_URI,{useNewUrlParser:true, useUnifiedTopology:true});

const connection = mongoose.connection;

module.exports = connection;
