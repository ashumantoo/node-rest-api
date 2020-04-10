const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

const app = express();

mongoose.connect('mongodb+srv://ashumantoo:' + process.env.MONGO_ATLAS_PW + '@firstcluster-1gkcp.mongodb.net/node-shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to MongoDB Database');
    })
    .catch(err => {
        console.log(err);
    });

mongoose.Promise = global.Promise;

//logging requested api to the console
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

//body-parser Parse incoming request bodies in a middleware before your handlers, 
//available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling Cross Origin Request error handling (CORS ERROR)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        req.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


/**********************************************************************************************
 *                             HANDLING NOT FOUND ROUTES
 *  - if any routes other than which are not handling with routing will definityly reach here
 *    becasue there routes are not defined and not handling already
 * 
 *  - Here Generating the custome error message using the express app.use() middleware 
 * 
 **********************************************************************************************/
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


//Handling the custom error message route not found and sending it to the Client
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
//Handling routes error end here

module.exports = app;