const productSvc = require("../products/product.service");
const categorySvc = require("./category.service");

class CategoryController {

    create = async (req, res, next) => {
        try {
            const data = await categorySvc.transformCreateRequest(req)
            const category = await categorySvc.createCategory(data)

            res.json({
                detail: category,
                message: "Category Created Successfully",
                status: "CATEGORY_CREATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    list = async (req, res, next) => {
        try {

            const categories = await categorySvc.listAllCategory(
                {
                    skip: 0,
                    limit: 10,
                    filter: {
                        $and: [{ status: 'active' },
                        ]
                    }
                }
            )

            res.json({
                detail: categories,
                message: "All categories fetched",
                stauts: "CATEGORIES_FETCH_SUCCESS",
                options: null
            })


        } catch (exception) {
            next(exception)
            console.log(exception)
        }
    }
    fetchByCategory = async (req, res, next) => {
        try {
            const slug = req.params.slug
            let skip = 0
            let limit = 20

            const category = await categorySvc.getCategoryBySlug({
                slug: slug
            })
            if (!category) {
                res.json({
                    message: "Category not found",
                    status: "NOT_FOUND",
                    options: null
                })
            }
            let filter = {
                category: category._id,
            }

            const products = await productSvc.getAllByFilter({ skip, limit, filter })

            res.json({
                detail: products,
                message: "Product fetched successfully",
                status: "PRODUCT_FETCHED",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await categorySvc.getCategoryBySlug({
                _id: req.params.id
            })
            if (!data) {
                res.json({ code: 404, message: "Category not found", status: "CATEGORY_NOT_FOUND" })
            }
            const transformData = await categorySvc.transformUpdateRequest(req, data)
            const response = await categorySvc.updateByFilter({
                _id: data._id
            }, transformData)
            res.json({
                detail: response,
                message: "Category update success",
                status: "CATEGORY_UPDATE_SUCCESS",
                options: null
            })
        } catch (exception) {
            next(exception)
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await categorySvc.getCategoryBySlug({
                _id: req.params.id
            })
            if (!data) {
                throw {
                    code: 404, message: "Category not found", status: "CATEGORY_NOT_FOUND"
                }
            }
            const response = await categorySvc.deleteByFilter({
                _id: data._id
            })
            res.json({
                detail: response,
                message: "Category deleted",
                status: "CATEGORY_DELETE_SUCCESS",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    fetch = async (req, res, next) => {
        try {
            const id = req.params.id
            const response = await categorySvc.getSingleByFilter({
                _id: id
            })
            res.json({
                detail: response,
                message: "Category fetched successfully",
                status: "CATEGORY_FETCHED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
}
const categoryCtrl = new CategoryController();
module.exports = categoryCtrl;
