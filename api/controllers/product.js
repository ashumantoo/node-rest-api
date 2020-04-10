const multer = require('multer');
const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // To accept the file pass `true`, like so:
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        // To reject this file pass `false`, like so:
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter
});

exports.createProduct = upload.single('productImage'), (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImage: req.file.path
    });
    product
        .save()
        .then(product => {
            res.status(201).json({
                message: "Product Created Successfully",
                createdProduct: product,
                request: {
                    method: "GET",
                    url: "http://localhost:8001/products/" + product._id
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

exports.getProducts = (req, res) => {
    Product
        .find()
        .select('_id name price description productImage')
        .then(products => {
            if (products.length > 0) {
                let response = {
                    products: products.map(product => {
                        //Just passing some usefull into with the request and making readable data
                        return {
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            productImage: product.productImage,
                            request: {
                                method: "GET",
                                url: "http://localhost:8001/products/" + product._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(400).json({
                    message: "No Product found!"
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.getProduct = (req, res) => {
    const productId = req.params.productId;
    Product
        .findById({ _id: productId })
        .then(product => {
            if (product) {
                res.status(200).json({
                    product: product,
                    request: {
                        method: "GET",
                        info: "Get all the products",
                        url: "http://localhost:8001/products"
                    }
                })
            } else {
                res.status(404).json({
                    message: "Product Not found with that identifire"
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

exports.updateProduct = (req, res) => {
    const productId = req.params.productId;

    const updateQuery = {};
    for (const query of req.body) {
        updateQuery[query.propName] = query.value;
    }

    // Product.update({_id:productId},{$set:{name:req.body.newName, price:req.body.newPrice,description:req.body.newDescription}})
    Product
        .update({ _id: productId }, { $set: updateQuery })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Product Updated successfully of Id " + productId,
                    request: {
                        method: "GET",
                        url: "http://localhost:8001/products/" + result._id
                    }
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.deleteProduct = (req, res) => {
    const productId = req.params.productId;
    Product
        .remove({ _id: productId })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Product Deleted successfully with Id " + productId,
                    request: {
                        method: "POST",
                        info: "Create a new Product",
                        url: "http://localhost:8001/products/",
                        payroads: { name: "String", price: "Number", description: "String" }
                    }
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}