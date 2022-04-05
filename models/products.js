const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const { categorySchema } = require('./category');

const productSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength: 255
    },
    brand: {
        type: String,
        required: true,
        minlength:2,
        maxlength:255
    },
    description : {
        type: String,
        required: true
    },
    category: {
        type: categorySchema,
        required: true
    },
    price: {
        type: Number,
        default: 10,
    },
    inStock: {
        type: Boolean,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().required(),
        brand: Joi.string().required(),
        description: Joi.string().required(),
        categoryId: Joi.objectid().required(),
        price: Joi.number().required(),
        inStock: Joi.boolean().required()
    });
    return schema.validate(product);
};

exports.Product = Product;
exports.validate = validateProduct;

