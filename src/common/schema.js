
const statusSchema = {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
}
const commonStr = {
    status: statusSchema,
}
const schemaOpts = {
    timestamps: true,
    autoIndex: true,
    autoCreate: true

}
module.exports = {
    schemaOpts,
    statusSchema,
    commonStr
}