const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 255
    }
})

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(255)
    })
    return schema.validate(category)
};

exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;