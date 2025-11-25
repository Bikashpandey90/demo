const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const productCtrl = require("./product.controller");
const { productCreateDTO, productUpdateDTO } = require("./product.validator");

const productRouter = require("express").Router();
//admin
productRouter.post('/create-product', checkLogin, allowedRole('admin'), uploader().fields([
    { name: 'images', maxCount: 5 },
    { name: 'directionImages', maxCount: 5 }
]), bodyValidator(productCreateDTO), productCtrl.create)

productRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().fields(
        [
            { name: 'images', maxCount: 5 },
            { name: 'directionImages', maxCount: 5 }
        ]
    ), bodyValidator(productUpdateDTO), productCtrl.update)
    .delete(checkLogin, allowedRole('admin'), productCtrl.delete)


//users
productRouter.get('/:slug/by-slug', productCtrl.fetchProduct)
productRouter.get('/list-all-products', productCtrl.listAllProduct)


module.exports = productRouter;