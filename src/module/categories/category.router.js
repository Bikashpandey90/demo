const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const categoryCtrl = require("./category.controller");
const { categoryCreateDTO, categoryUpdateDTO } = require("./category.validator");

const categoryRouter = require("express").Router();
//admin
categoryRouter.post('/create-category', checkLogin, allowedRole('admin'), uploader().fields([
    { name: 'image', maxCount: 1 },
    { name: 'bowlImage', maxCount: 1 },
    { name: 'ingridientsImage', maxCount: 1 }


]), bodyValidator(categoryCreateDTO), categoryCtrl.create)

categoryRouter.get('/list-categories', categoryCtrl.list)


categoryRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().single('image'), bodyValidator(categoryUpdateDTO), categoryCtrl.update)
    .delete(checkLogin, allowedRole('admin'), categoryCtrl.delete)
    .get(checkLogin, allowedRole('admin'), categoryCtrl.fetch)


//user

categoryRouter.get('/:slug/products-by-category', categoryCtrl.fetchByCategory)





module.exports = categoryRouter;