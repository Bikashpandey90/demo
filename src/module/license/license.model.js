const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const LicenseSchema = new mongoose.Schema({
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

    link: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    ...commonStr
}, schemaOpts)

const LicenseModel = mongoose.model('License', LicenseSchema);
module.exports = LicenseModel;