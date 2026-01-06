const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const BlogSchema = new mongoose.Schema({
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
    },
    content: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },
   
    ...commonStr
}, schemaOpts)

const BlogModel = mongoose.model('Blog', BlogSchema);
module.exports = BlogModel;