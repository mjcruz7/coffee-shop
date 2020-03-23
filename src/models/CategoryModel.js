const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Category name is required.']
    },
    description: {
        type: String,
        default: '-'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CategorySchema.plugin(uniqueValidator, {
    message: 'Category name must be unique.'
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;