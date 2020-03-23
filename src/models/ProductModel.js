const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        unique: true
    },
    description: {
        type: String,
        default: '-'
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.']
    },
    img: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

ProductSchema.plugin(uniqueValidator, {
    message: 'Product name must be unique.'
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;