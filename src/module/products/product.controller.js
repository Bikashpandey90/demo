const productSvc = require("./product.service");

class ProductController {

    create = async (req, res, next) => {
        try {
            console.log(req.body)
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
    update = async (req, res, next) => {
        try {
            const data = await productSvc.getSingleByFilter({
                _id: req.params.id
            })
            const transformData = await productSvc.transformUpdateRequest(req, data)
            const response = await productSvc.updateByFilter({
                _id: req.params.id
            }, transformData)

            res.json({
                detail: response,
                message: "Product Updated Successfully",
                status: "PRODUCT_UPDATE_SUCCESS",
                options: null
            })


        } catch (exception) {
            next(exception

            )
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await productSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                throw {
                    code: 404,
                    messgae: "Product not found",
                    status: "PRODUCT_NOT_FOUND"
                }
            }
            const response = await productSvc.deleteByFilter({
                _id: data._id
            })
            res.json({
                detail: response,
                message: "Product deleted successfully !",
                status: "PRODUCT_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }

    }


}
const productCtrl = new ProductController();
module.exports = productCtrl;
