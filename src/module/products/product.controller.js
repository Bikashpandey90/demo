const productSvc = require("./product.service");

class ProductController {

    create = async (req, res, next) => {
        try {
            const data = await productSvc.transformCreateRequest(req)

            const product = await productSvc.createProduct(data)

            res.json({
                detail: product,
                message: "Product created successfully",
                status: "PRODUCT_CREATED",
                options: null
            })


        } catch (exception) {

            next(exception)
        }
    }
    fetchProduct = async (req, res, next) => {
        try {
            const slug = req.params.slug
            const productDetail = await productSvc.getSingleByFilter({
                slug: slug
            })

            //list related products


            res.json({
                detail: productDetail,
                message: "Product fetched successfully",
                status: "PRODUCT_FETCHED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    listAllProduct = async (req, res, next) => {
        try {
            let skip = 0
            let limit = 100
            let filter = {}
            const products = await productSvc.getAllByFilter({ skip, limit, filter })
            res.json({
                detail: products,
                message: "All Products Fetched",
                status: "PRODUCTS_FETCHED",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }


}
const productCtrl = new ProductController();
module.exports = productCtrl;
