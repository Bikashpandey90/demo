const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        unique: true

    },
    image: {
        type: String,
        required: true

    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    ...commonStr

}, schemaOpts)

const CategoryModel = mongoose.model('Category', CategorySchema)
module.exports = CategoryModel