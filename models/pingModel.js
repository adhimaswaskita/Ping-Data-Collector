const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time : {type : String, required : true},
    deviceStatus : {type : String, required : true},
    IP : {type : String, required : true},
    deviceName : {type : String, required : true}
})

module.exports = mongoose.model('pingreport', schema)