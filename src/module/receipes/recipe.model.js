const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const RecipeSchema = new mongoose.Schema({
    title: {
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
    tagline: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    }
    ],
    primaryColor: {
        type: String,
    },
    secondaryColor: {
        type: String,
    },
    ...commonStr
}, schemaOpts)

const RecipeModel = mongoose.model('Recipe', RecipeSchema);
module.exports = RecipeModel;