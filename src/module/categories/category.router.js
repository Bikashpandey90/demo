const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const categoryCtrl = require("./category.controller");
const { categoryCreateDTO, categoryUpdateDTO } = require("./category.validator");

const categoryRouter = require("express").Router();
//admin
categoryRouter.post('/create-category', checkLogin, allowedRole('admin'), uploader().single('image'), bodyValidator(categoryCreateDTO), categoryCtrl.create)

categoryRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().single('image'), bodyValidator(categoryUpdateDTO), categoryCtrl.update)
    .delete(checkLogin, allowedRole('admin'), categoryCtrl.delete)


//user
categoryRouter.get('/list-categories', categoryCtrl.list)

categoryRouter.get('/:slug/products-by-category', categoryCtrl.fetchByCategory)





module.exports = categoryRouter;