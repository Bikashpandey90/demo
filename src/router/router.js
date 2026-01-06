const authRouter = require('../module/auth/auth.router');
const blogRouter = require('../module/blogs/blog.router');
const categoryRouter = require('../module/categories/category.router');
const licenseRouter = require('../module/license/license.router');
const productRouter = require('../module/products/product.router');
const recipeRouter = require('../module/receipes/recipe.router');

const router = require('express').Router();

router.use('/auth', authRouter)
router.use('/products', productRouter);
router.use('/category', categoryRouter);
router.use('/blogs', blogRouter);
router.use('/recipe', recipeRouter);
router.use('/license',licenseRouter)


module.exports = router;