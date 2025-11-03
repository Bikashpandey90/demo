const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const categoryCtrl = require("./category.controller");
const { categoryCreateDTO } = require("./category.validator");

const categoryRouter = require("express").Router();

categoryRouter.post('/create-category', uploader().single('image'), bodyValidator(categoryCreateDTO), categoryCtrl.create)

categoryRouter.get('/list-categories', categoryCtrl.list)

categoryRouter.get('/:slug/products-by-category', categoryCtrl.fetchByCategory)





module.exports = categoryRouter;