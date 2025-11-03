const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 100
    },
    tagline: {
        type: String,
        max: 200,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        ingridients: {
            type: String,
            required: true,
            min: 100
        },
        nutritionalInfo: {
            type: String,
            required: true,
            min: 100
        },
        direction: {
            type: String,
            required: true,
            min: 100
        }

    },
    ...commonStr



}, schemaOpts)

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;