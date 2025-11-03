const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const productCtrl = require("./product.controller");
const { productCreateDTO } = require("./product.validator");

const productRouter = require("express").Router();

productRouter.post('/create-product', uploader().array('images'), bodyValidator(productCreateDTO), productCtrl.create)
productRouter.get('/:slug/by-slug', productCtrl.fetchProduct)
productRouter.get('/list-all-products', productCtrl.listAllProduct)


module.exports = productRouter;