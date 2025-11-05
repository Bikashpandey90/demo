const authRouter = require('../module/auth/auth.router');
const categoryRouter = require('../module/categories/category.router');
const productRouter = require('../module/products/product.router');

const router = require('express').Router();


router.get('/', (req, res, next) => {
    res.send("Welcome to the API");
})
router.use('/auth', authRouter)
router.use('/products', productRouter);
router.use('/category', categoryRouter)


module.exports = router;