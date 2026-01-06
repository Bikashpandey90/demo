const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const blogCtrl = require("./blog.controller");
const { blogCreateDTO, blogUpdateDTO } = require("./blog.validator");

const blogRouter = require("express").Router();
//admin
blogRouter.post('/create-blog', checkLogin, allowedRole('admin'), uploader().fields([
    { name: 'image', maxCount: 1 },
]), bodyValidator(blogCreateDTO), blogCtrl.create)

blogRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().fields(
        [
            { name: 'image', maxCount: 5 },
        ]
    ), bodyValidator(blogUpdateDTO), blogCtrl.update)
    .delete(checkLogin, allowedRole('admin'), blogCtrl.delete)

//users
blogRouter.get('/:slug/by-slug', blogCtrl.fetchBlog)
blogRouter.get('/list-all-blogs', blogCtrl.listAllBlog)


module.exports = blogRouter;