const Order = require('../models/order');
const Product = require('../models/product');

exports.getOrders = (req, res) => {
    Order
        .find()
        .populate('product')
        .exec()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders)
            } else {
                res.status(400).json({
                    message: "No Orders found"
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.createOrder = (req, res) => {
    const order = new Order({
        product: req.body.product,
        quantity: req.body.quantity
    });

    Product
        .findById({ _id: req.body.product })
        .exec()
        .then(product => {
            if (!product) {
                return res.json({
                    message: "Product with that Id not found"
                });
            }
            order
                .save()
                .then(order => {
                    res.status(200).json({
                        message: "Order Created successfully",
                        order: order
                    });
                })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.getOrder = (req, res) => {
    const orderId = req.params.orderId;

    Order
        .findById({ _id: orderId })
        .populate('product')
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json(order);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.deleteOrder = (req, res) => {
    const orderId = req.params.orderId;

    Order
        .remove({ _id: orderId })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Order deleted successfully with id " + orderId
                });
            } else {
                res.status(400).json({
                    message: "Something went worng"
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}