const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DATABASE_URI, {useNewUrlParser : true}).then(
    ()=>{
        // console.log("Database connection established");
    }, err =>{
        console.log(err);
    }
)