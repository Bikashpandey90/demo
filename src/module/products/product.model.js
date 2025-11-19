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
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    allergyAdvice: {
        type: String,
        required: true,
    },
    vegNonVeg: {
        type: String,
        enum: ['veg', 'nonveg'],
        default: 'nonveg',

    },
    ingridients: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    nutritionalInfo: {
        header: {
            type: String,
            required: true,
            min: 10
        },
        rows: [
            {
                values: String,
                perValue: String,
                perPacket: String
            }
        ],
        footer: {
            type: String,
            required: true,
            min: 10
        },
        links: [
            {
                type: String,

            }
        ]

    },
    directionImages: [{
        url: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            // required: true
        },
        description: {
            type: String,
            default: ''
        },

    }],

    ...commonStr



}, schemaOpts)

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;